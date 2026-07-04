import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { SEED_PRODUCTS } from './src/seedData';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Load Firebase configuration
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = null;
let db: any = null;

if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log('[ShopEZ Backend] Firebase initialized successfully. Connected to database ID:', firebaseConfig.firestoreDatabaseId);
  } catch (err) {
    console.error('[ShopEZ Backend] Failed to initialize Firebase on server:', err);
  }
} else {
  console.warn('[ShopEZ Backend] firebase-applet-config.json not found! Server will run with local in-memory fallback.');
}

const SYSTEM_TOKEN = process.env.SYSTEM_TOKEN || 'shopez_secure_backend_system_token_2026';

// Initialize Gemini API
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey && geminiApiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({ apiKey: geminiApiKey });
    console.log('Gemini API initialized successfully in backend.');
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not configured or contains the default placeholder. AI Assistant will run in simulated mode.');
}

// --- API Routes ---

// 1. Get seed products catalog (raw endpoint)
app.get('/api/products/seed', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    products: SEED_PRODUCTS
  });
});

// 2. GET /api/products: Load or seed from Firestore
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    if (!db) {
      console.log('[ShopEZ Backend] Firestore not initialized, returning SEED_PRODUCTS in-memory.');
      res.json({ status: 'success', products: SEED_PRODUCTS });
      return;
    }

    const colRef = collection(db, 'products');
    const querySnapshot = await getDocs(colRef);
    
    const list: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const { systemToken, ...cleanData } = data;
      list.push({ id: docSnap.id, ...cleanData });
    });

    const hasNewCategories = list.some(item => item.category === 'Electronics' || item.category === 'Skincare');
    
    if (querySnapshot.empty || !hasNewCategories) {
      console.log('[ShopEZ Backend] Seeding / syncing new categories (Electronics, Skincare, Gadgets, Home Appliances) to Firestore...');
      const updatedList: any[] = [];
      for (const item of SEED_PRODUCTS) {
        const prodRef = doc(db, 'products', item.id);
        const dataToSet = { ...item, createdAt: new Date().toISOString() };
        await setDoc(prodRef, { ...dataToSet, systemToken: SYSTEM_TOKEN });
        updatedList.push(dataToSet);
      }
      res.json({ status: 'success', products: updatedList });
    } else {
      res.json({ status: 'success', products: list });
    }
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in GET /api/products, falling back to SEED_PRODUCTS:', error);
    res.json({ status: 'success', products: SEED_PRODUCTS, fallback: true, error: error.message });
  }
});

// 3. POST /api/products: Create/Update a product
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const newProduct = req.body;
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      res.status(400).json({ error: 'Missing product parameters.' });
      return;
    }
    if (db) {
      const { systemToken, ...cleanProduct } = newProduct;
      await setDoc(doc(db, 'products', newProduct.id), {
        ...cleanProduct,
        systemToken: SYSTEM_TOKEN,
        createdAt: new Date().toISOString()
      });
    }
    res.json({ status: 'success', product: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. GET /api/orders: Fetch all orders (with optional userId filter)
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    if (!db) {
      console.log('[ShopEZ Backend] Firestore not initialized, returning empty orders.');
      res.json({ status: 'success', orders: [] });
      return;
    }
    const { userId } = req.query;
    const colRef = collection(db, 'orders');
    const q = query(colRef, where('systemToken', '==', SYSTEM_TOKEN));
    const querySnapshot = await getDocs(q);
    const list: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const orderData = docSnap.data();
      const { systemToken, ...cleanOrderData } = orderData;
      if (!userId || cleanOrderData.userId === userId) {
        list.push({ id: docSnap.id, ...cleanOrderData });
      }
    });
    // Sort by Date descending
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ status: 'success', orders: list });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in GET /api/orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. POST /api/orders: Place checkout order & decrease stocks
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { order } = req.body;
    if (!order || !order.items || !order.shippingAddress || !order.totalAmount) {
      res.status(400).json({ error: 'Incomplete order payload' });
      return;
    }

    const orderId = order.id || `order-${Date.now()}`;
    const finalizedOrder = {
      ...order,
      id: orderId,
      createdAt: new Date().toISOString()
    };

    if (db) {
      const { systemToken, ...cleanOrder } = finalizedOrder;
      // Create order document with systemToken
      await setDoc(doc(db, 'orders', orderId), {
        ...cleanOrder,
        systemToken: SYSTEM_TOKEN
      });

      // Deduct stock for each item in Firestore
      for (const item of order.items) {
        try {
          const prodRef = doc(db, 'products', item.productId);
          const currentStock = Number(item.stock || 10) - Number(item.quantity || 1);
          await updateDoc(prodRef, {
            stock: Math.max(0, currentStock),
            systemToken: SYSTEM_TOKEN
          });
        } catch (stockErr) {
          console.error('[ShopEZ Backend] Failed to decrease stock for:', item.productId, stockErr);
        }
      }
    }

    res.json({ status: 'success', order: finalizedOrder });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in POST /api/orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. POST /api/orders/:id/status: Update order status (Pending, Dispatched, Delivered, Cancelled)
app.post('/api/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'Missing status value' });
      return;
    }

    if (db) {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status,
        systemToken: SYSTEM_TOKEN,
        updatedAt: new Date().toISOString()
      });
    }
    res.json({ success: true, id, status });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in status update:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    firebaseProject: firebaseConfig?.projectId || 'not_specified'
  });
});

// 8. AI Artisan Advisor - Gemini proxy endpoint
app.post('/api/artisan-advisor', async (req: Request, res: Response) => {
  const { messages, currentProductContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  // Fallback if Gemini key is missing
  if (!ai) {
    const lastUserMsg = messages[messages.length - 1]?.parts?.[0]?.text || '';
    let responseText = "Greetings from ShopEZ! I would be delighted to share the stories behind our elegant hand-bound books, premium apparel, advanced electronics, natural skincare, gadgets, or smart home appliances.\n\nHow may I help you explore our collection today?";
    
    if (lastUserMsg.toLowerCase().includes('book') || lastUserMsg.toLowerCase().includes('gitanjali') || lastUserMsg.toLowerCase().includes('mahabharata')) {
      responseText = "Our collection of Books is absolutely stellar! 'Gitanjali: Song Offerings' is printed on sustainable handmade parchment paper and bound using upcycled organic textiles. It represents Bengal’s noble book-binding legacy. Would you like to read Tagore's beautiful verses?";
    } else if (lastUserMsg.toLowerCase().includes('menwear') || lastUserMsg.toLowerCase().includes('kurta') || lastUserMsg.toLowerCase().includes('shirt')) {
      responseText = "In Men's Wear, we combine legacy handlooms with modern tailored cuts. Our Khadi Linen Kurta is spun by hand in Wardha, Maharashtra, using native charkhas. It feels unbelievably lightweight and soft. What sizes are you looking for?";
    } else if (lastUserMsg.toLowerCase().includes('womenwear') || lastUserMsg.toLowerCase().includes('saree') || lastUserMsg.toLowerCase().includes('kurti')) {
      responseText = "Our Women's Wear collection features magnificent royal brocade Banarasi sarees from Varanasi, taking 18 days of rigorous shuttle work, and hand-embroidered Chikankari kurtis from Lucknow. Perfect for celebrating festivals and milestones!";
    } else if (lastUserMsg.toLowerCase().includes('accessory') || lastUserMsg.toLowerCase().includes('bag') || lastUserMsg.toLowerCase().includes('watch') || lastUserMsg.toLowerCase().includes('copper')) {
      responseText = "Our Accessories feature legendary copper hammering and premium Kanpur leather satchels. The Ayurvedic Hammered Copper Bottle is forged by Thatheras of Jandiala Guru, Punjab—UNESCO Intangible Cultural Heritage! It naturally purifies drinking water.";
    } else if (lastUserMsg.toLowerCase().includes('electronic') || lastUserMsg.toLowerCase().includes('headphone') || lastUserMsg.toLowerCase().includes('keyboard')) {
      responseText = "Our Electronics combine top-tier technology with high-quality materials. Check out the AcousticPure Wireless ANC Headphones with beryllium drivers, or our retro typewriter mechanical keyboard which features tactile mechanical blue switches and alloy casing.";
    } else if (lastUserMsg.toLowerCase().includes('skin') || lastUserMsg.toLowerCase().includes('serum') || lastUserMsg.toLowerCase().includes('mist') || lastUserMsg.toLowerCase().includes('rose')) {
      responseText = "Our Skincare line features the organic Kumkumadi & Sandalwood Glow Serum, slow-brewed in traditional copper vessels, and the steam-distilled Pure Kannauj Rose Water Mist. Extremely nourishing, pure, and rich in natural botanicals.";
    } else if (lastUserMsg.toLowerCase().includes('gadget') || lastUserMsg.toLowerCase().includes('smartwatch') || lastUserMsg.toLowerCase().includes('camera')) {
      responseText = "In Gadgets, we feature the Aura Titanium Fitness Smartwatch with AMOLED screen and health biosensors, and the EpicView 4K Action Camera, which is ultra-rugged and water-resistant for your outdoor adventures.";
    } else if (lastUserMsg.toLowerCase().includes('appliance') || lastUserMsg.toLowerCase().includes('espresso') || lastUserMsg.toLowerCase().includes('kettle')) {
      responseText = "Our Home Appliances category features the chrome-plated Artisan Espresso Maker fitted with reclaimed rosewood handles, and the Quick-Boil Ceramic Smart Kettle whose clay housing is hand-glazed by pottery guilds in Khurja, the Ceramic City.";
    }

    res.json({ text: responseText });
    return;
  }

  try {
    // Construct the conversational context and instructions
    const systemInstruction = `You are the ShopEZ Artisan Advisor, a warm, highly cultured, and deeply knowledgeable digital curator of classical literature, designer men's & women's apparel, vintage accessories, and handcrafted lifestyle essentials.
Your mission is to share the "stories behind the craft" rather than just hard-selling. Help the customer feel connected to the legacy of bookbinders, weavers, tailors, leather craftsmen, and copper smiths.
All prices are represented in Indian Rupees (₹).

Here is the current product catalog of ShopEZ for your reference:
${SEED_PRODUCTS.map(p => `- ${p.name} (Category: ${p.category}, Price: ₹${p.price}): ${p.description}. Story: ${p.artisanStory}`).join('\n')}

${currentProductContext ? `The user is currently viewing: "${currentProductContext.name}" in category "${currentProductContext.category}". Focus on answering questions about this product, its history, or recommending related items.` : ''}

Rules:
1. Be polite, storytelling-oriented, elegant, and proud of Indian heritage.
2. Use formatting (bullet points, bold names) to make recommendations scannable and beautiful.
3. Suggest perfect cultural gifts or placements (e.g., weddings, housewarming, corporate gifting, premium personal libraries).
4. If asked to recommend products, always suggest items from the above list first.
5. Keep answers friendly, conversational, and avoid sounding dry.`;

    // Extract chat history and prepare contents
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: m.parts.map((p: any) => ({ text: p.text || p }))
    }));

    // Call Gemini 2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    const responseText = response.text;
    res.json({ text: responseText });

  } catch (error: any) {
    console.error('Error executing Gemini API call:', error);
    res.status(500).json({ error: error.message || 'Error occurred while contacting the AI Assistant.' });
  }
});

// --- Express + Vite Server Integration ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Vite dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware loaded in Express dev mode.');
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving static files from dist directory in production mode.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShopEZ Full-Stack Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
