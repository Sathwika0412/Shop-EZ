import { Request, Response } from 'express';
import { ai } from '../config/db';
import { SEED_PRODUCTS } from '../src/seedData';

export const artisanAdvisor = async (req: Request, res: Response) => {
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
    } else if (lastUserMsg.toLowerCase().includes('skin') || lastUserMsg.toLowerCase().includes('skin-serum') || lastUserMsg.toLowerCase().includes('mist') || lastUserMsg.toLowerCase().includes('rose')) {
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

    // Call Gemini with robust fallback options
    let response;
    try {
      console.log('Attempting AI generateContent with model: gemini-3.5-flash');
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      });
    } catch (primaryError: any) {
      console.warn('Primary model gemini-3.5-flash failed. Trying fallback to gemini-2.5-flash. Error details:', primaryError);
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        });
      } catch (secondaryError: any) {
        console.error('All Gemini model calls failed:', secondaryError);
        throw secondaryError;
      }
    }

    const responseText = response.text;
    res.json({ text: responseText });

  } catch (error: any) {
    console.error('Error executing Gemini API call:', error);
    res.status(500).json({ error: error.message || 'Error occurred while contacting the AI Assistant.' });
  }
};
