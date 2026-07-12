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
