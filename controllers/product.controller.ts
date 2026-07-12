import { Request, Response } from 'express';
import { db, SYSTEM_TOKEN } from '../config/db';
import { SEED_PRODUCTS } from '../src/seedData';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

export const getSeedProducts = (req: Request, res: Response) => {
  res.json({
    status: 'success',
    products: SEED_PRODUCTS
  });
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    if (!db) {
      console.log('[ShopEZ Backend] Firestore not initialized, returning SEED_PRODUCTS in-memory.');
      res.json({ status: 'success', products: SEED_PRODUCTS });
      return;
    }

    const colRef = collection(db, 'products');
    const querySnapshot = await getDocs(colRef);
    
    const list: any[] = [];
    const dbProductMap = new Map<string, any>();
    
    querySnapshot.forEach(docSnap => {
      dbProductMap.set(docSnap.id, docSnap.data());
    });

    // Highly robust self-healing & syncing loop: ensure every seed product exists and has valid, updated data
    for (const seed of SEED_PRODUCTS) {
      const dbProduct = dbProductMap.get(seed.id);
      
      if (!dbProduct) {
        console.log(`[ShopEZ Sync] Product ${seed.id} is missing in Firestore. Seeding now...`);
        try {
          const prodRef = doc(db, 'products', seed.id);
          const dataToSet = { ...seed, createdAt: new Date().toISOString(), systemToken: SYSTEM_TOKEN };
          await setDoc(prodRef, dataToSet);
          list.push({ id: seed.id, ...seed });
        } catch (err) {
          console.error(`[ShopEZ Sync] Failed to seed missing product ${seed.id}:`, err);
          list.push({ id: seed.id, ...seed }); // local fallback
        }
      } else {
        // Exists in Firestore. Let's make sure its image and important data is healed if outdated, missing, or empty.
        const shouldHealImage = !dbProduct.image || dbProduct.image === '' || dbProduct.image !== seed.image;
        const shouldHealPrice = !dbProduct.price || dbProduct.price !== seed.price;
        
        if (shouldHealImage || shouldHealPrice) {
          console.log(`[ShopEZ Sync] Product ${seed.id} has outdated data or missing image in Firestore. Auto-healing...`);
          try {
            const prodRef = doc(db, 'products', seed.id);
            await updateDoc(prodRef, {
              image: seed.image,
              price: seed.price,
              name: seed.name,
              category: seed.category,
              description: seed.description,
              systemToken: SYSTEM_TOKEN
            });
            list.push({
              ...dbProduct,
              id: seed.id,
              image: seed.image,
              price: seed.price,
              name: seed.name,
              category: seed.category,
              description: seed.description
            });
          } catch (err) {
            console.error(`[ShopEZ Sync] Failed to heal product ${seed.id}:`, err);
            list.push({ id: seed.id, ...dbProduct, image: seed.image, price: seed.price }); // local heal fallback
          }
        } else {
          // Normal valid product
          const { systemToken, ...cleanData } = dbProduct;
          list.push({ id: seed.id, ...cleanData });
        }
      }
    }

    res.json({ status: 'success', products: list });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in GET /api/products, falling back to SEED_PRODUCTS:', error);
    res.json({ status: 'success', products: SEED_PRODUCTS, fallback: true, error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
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
};
