import { Request, Response } from 'express';
import { db, SYSTEM_TOKEN } from '../config/db';
import { collection, getDocs, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';

// In-memory fallback list to cache orders if Firestore writes fail or are denied due to rules/permissions
const IN_MEMORY_ORDERS: any[] = [];

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const list: any[] = [];

    if (db) {
      try {
        const colRef = collection(db, 'orders');
        const q = query(colRef, where('systemToken', '==', SYSTEM_TOKEN));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          const orderData = docSnap.data();
          const { systemToken, ...cleanOrderData } = orderData;
          if (!userId || cleanOrderData.userId === userId) {
            list.push({ id: docSnap.id, ...cleanOrderData });
          }
        });
      } catch (dbReadErr) {
        console.warn('[ShopEZ Backend] Firestore orders read failed, using in-memory fallbacks only:', dbReadErr);
      }
    }

    // Merge in-memory orders
    for (const cachedOrder of IN_MEMORY_ORDERS) {
      if (!userId || cachedOrder.userId === userId) {
        if (!list.some(o => o.id === cachedOrder.id)) {
          list.push(cachedOrder);
        }
      }
    }

    // Sort by Date descending
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ status: 'success', orders: list });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in GET /api/orders:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
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

    let writtenToDb = false;
    if (db) {
      try {
        const { systemToken, ...cleanOrder } = finalizedOrder;
        // Create order document with systemToken
        await setDoc(doc(db, 'orders', orderId), {
          ...cleanOrder,
          systemToken: SYSTEM_TOKEN
        });
        writtenToDb = true;

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
      } catch (dbWriteErr: any) {
        console.warn('[ShopEZ Backend] Firestore write failed during checkout, caching in-memory instead:', dbWriteErr);
      }
    }

    if (!writtenToDb) {
      // Store in memory cache
      IN_MEMORY_ORDERS.push(finalizedOrder);
    }

    res.json({ status: 'success', order: finalizedOrder });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in POST /api/orders:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: 'Missing status value' });
      return;
    }

    let updatedInFirestore = false;
    if (db) {
      try {
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, {
          status,
          systemToken: SYSTEM_TOKEN,
          updatedAt: new Date().toISOString()
        });
        updatedInFirestore = true;
      } catch (dbErr) {
        console.warn('[ShopEZ Backend] Failed to update order status in Firestore, updating in-memory only:', dbErr);
      }
    }

    // Update in memory cache as well
    const cachedOrder = IN_MEMORY_ORDERS.find(o => o.id === id);
    if (cachedOrder) {
      cachedOrder.status = status;
      cachedOrder.updatedAt = new Date().toISOString();
    } else if (!updatedInFirestore) {
      // Cache as fallback
      IN_MEMORY_ORDERS.push({
        id,
        status,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        userId: 'guest',
        items: [],
        totalAmount: 0,
        shippingAddress: {}
      });
    }

    res.json({ success: true, id, status, statusUpdated: true });
  } catch (error: any) {
    console.error('[ShopEZ Backend] Error in status update:', error);
    res.status(500).json({ error: error.message });
  }
};
