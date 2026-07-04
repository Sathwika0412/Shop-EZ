import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  signInAnonymously,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Product, Order, OrderItem, ShippingAddress } from '../types';

interface ShopContextType {
  user: FirebaseUser | null;
  authLoading: boolean;
  products: Product[];
  productsLoading: boolean;
  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  discountPercent: number;
  setDiscountPercent: (discount: number) => void;
  checkout: (shippingAddress: ShippingAddress, paymentMethod: string) => Promise<Order>;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
  orders: Order[];
  ordersLoading: boolean;
  fetchUserOrders: () => Promise<void>;
  fetchAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  isAdminUser: boolean;
  setAdminStatus: (status: boolean) => void;
  fetchProducts: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // 1. Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      
      if (firebaseUser) {
        const isEmailAdmin = firebaseUser.email?.includes('admin') || firebaseUser.email === 'sathwikaaluru2005@gmail.com';
        setIsAdminUser(isEmailAdmin || localStorage.getItem('shopez_admin_override') === 'true');
        // Fetch customer's orders from the backend API
        fetchUserOrdersWithId(firebaseUser.uid);
      } else {
        setIsAdminUser(false);
        setOrders([]);
      }
    });
    return unsubscribe;
  }, []);

  // Sync admin override state to localStorage
  const setAdminStatus = (status: boolean) => {
    setIsAdminUser(status);
    localStorage.setItem('shopez_admin_override', status ? 'true' : 'false');
  };

  // Helper to fetch user orders directly with ID
  const fetchUserOrdersWithId = async (uid: string) => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${uid}`);
      const data = await res.json();
      if (data.status === 'success' && data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch user orders with ID:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // 2. Fetch Products from Express Backend API (which proxies & seeds Firestore)
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.status === 'success' && data.products) {
        setProducts(data.products);
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to load products from Express API:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 3. Authenticate with Google
  const loginWithGoogle = async () => {
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      // Fallback: If popup fails in sandboxed iframe, suggest Anonymous sign-in
      await loginAnonymously();
    } finally {
      setAuthLoading(false);
    }
  };

  // 4. Authenticate Anonymously (Guest Mode)
  const loginAnonymously = async () => {
    setAuthLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.warn('Anonymous Sign-In failed, falling back to Simulated Guest Session:', error);
      // Fallback simulated guest user for iframe environment compatibility
      const simulatedGuest = {
        uid: `simulated-guest-${Date.now()}`,
        displayName: 'Guest Artisan Patron',
        email: 'guest@shopez.com',
        isAnonymous: true,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
        emailVerified: false,
      } as any;
      setUser(simulatedGuest);
    } finally {
      setAuthLoading(false);
    }
  };

  // 5. Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      setCart([]);
      setDiscountPercent(0);
    } catch (error) {
      console.error('Sign-Out failed:', error);
    }
  };

  // 6. Shopping Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // 7. Get User Orders from Express Backend API
  const fetchUserOrders = async () => {
    const currentUserId = user?.uid || auth.currentUser?.uid;
    if (!currentUserId) return;
    await fetchUserOrdersWithId(currentUserId);
  };

  // 8. Get All Orders for Admin Dashboard
  const fetchAllOrders = async (): Promise<Order[]> => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.status === 'success' && data.orders) {
        return data.orders;
      } else {
        throw new Error(data.error || 'Failed to fetch all orders');
      }
    } catch (error) {
      console.error('Failed to fetch all orders from Express API:', error);
      return [];
    }
  };

  // 9. Update Order Status (Admin Dashboard or Cancel)
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.status !== 'success') {
        throw new Error(data.error || 'Failed to update order status');
      }

      const updateData: any = { status };
      if (status !== 'Cancelled') {
        updateData.updatedAt = new Date().toISOString();
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updateData } : o))
      );
    } catch (error) {
      console.error('Failed to update order status via Express API:', error);
      throw error;
    }
  };

  // 10. Checkout Operation via Express Backend API
  const checkout = async (shippingAddress: ShippingAddress, paymentMethod: string): Promise<Order> => {
    const currentUserId = user?.uid || auth.currentUser?.uid;
    if (!currentUserId) {
      throw new Error('You must be logged in to checkout.');
    }

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price * (1 - (item.product.discount || 0) / 100),
      quantity: item.quantity,
      image: item.product.image
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalTotal = Math.round(subtotal * (1 - discountPercent / 100));

    const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newOrder: Order = {
      id: orderId,
      userId: currentUserId,
      items: orderItems,
      totalAmount: finalTotal,
      shippingAddress,
      status: 'Pending',
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder })
      });
      const data = await res.json();
      if (data.status !== 'success') {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear Cart & reset discount on success
      clearCart();
      setDiscountPercent(0);
      
      // Re-fetch orders & products to update stocks
      await fetchUserOrdersWithId(currentUserId);
      await fetchProducts();

      return data.order || newOrder;
    } catch (error) {
      console.error('Checkout write failed via Express API:', error);
      throw error;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        authLoading,
        products,
        productsLoading,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        discountPercent,
        setDiscountPercent,
        checkout,
        loginWithGoogle,
        loginAnonymously,
        logout,
        orders,
        ordersLoading,
        fetchUserOrders,
        fetchAllOrders,
        updateOrderStatus,
        isAdminUser,
        setAdminStatus,
        fetchProducts
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
