export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  sizes: string[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
