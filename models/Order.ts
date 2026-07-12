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
