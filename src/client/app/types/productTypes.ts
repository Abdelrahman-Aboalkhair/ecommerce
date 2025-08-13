import { User } from "./authTypes";
export interface Product {
  id: string;
  slug: string;
  name: string;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  description: string | null;
  variants: {
    id: string;
    sku: string;
    price: number;
    images: string[];
    stock: number;
    lowStockThreshold: number;
    barcode: string | null;
    warehouseLocation: string | null;
    attributes: {
      id: string;
      attribute: {
        id: string;
        name: string;
        slug: string;
      };
      value: {
        id: string;
        value: string;
        slug: string;
      };
    }[];
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    userId: string;
    user?: { name: string };
  }[];
}
export interface Order {
  order_no: string;
  amount: number;
  order_date: Date;
  user: User;
  userId: string;
  products: Product[];
  tracking?: TrackingDetail | null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  order: Order;
  product: Product;
}

export interface Payment {
  id: string;
  method: string;
  amount: number;
  user: User;
  userId: string;
}

export interface Address {
  id: string;
  city: string;
  state: string;
  country: string;
  user: User;
  userId: string;
}

export interface TrackingDetail {
  id: string;
  status: string;
  order: Order;
  order_no: string;
}

export interface Cart {
  cart_id: string;
  user: User;
  userId: string;
  products: Product[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  products: Product[];
}
