export interface Product {
  id: string;
  name: string;
  description: string;
  artisanStory: string;
  price: number; // in INR
  category: 'Books' | 'Menwear' | 'Womenwear' | 'Accessories' | 'Electronics' | 'Skincare' | 'Gadgets' | 'Home Appliances';
  image: string;
  rating: number;
  discount: number; // e.g., 10 for 10%
  stock: number;
  createdAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: 'Pending' | 'Dispatched' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
