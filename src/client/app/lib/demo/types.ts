export type DemoRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  emailVerified: boolean;
  avatar: string | null;
}

export interface DemoCartItem {
  id: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    price: number;
    images: string[];
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface DemoCart {
  id: string;
  cartItems: DemoCartItem[];
}

export interface DemoOrderItem {
  id: string;
  quantity: number;
  price: number;
  variant?: {
    id: string;
    sku: string;
    product?: { id: string; name: string };
  };
  productName?: string;
}

export interface DemoOrder {
  id: string;
  userId: string;
  status: string;
  amount: number;
  orderDate: string;
  orderItems: DemoOrderItem[];
}

export interface DemoCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  attributes?: DemoCategoryAttribute[];
}

export interface DemoAttributeValue {
  id: string;
  value: string;
  slug: string;
}

export interface DemoAttribute {
  id: string;
  name: string;
  slug: string;
  values: DemoAttributeValue[];
}

export interface DemoCategoryAttribute {
  isRequired: boolean;
  attribute: DemoAttribute;
}

export interface DemoAdminProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  averageRating?: number;
  reviewCount?: number;
  categoryId: string;
  category?: DemoCategory;
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    stock: number;
    lowStockThreshold?: number;
    barcode?: string | null;
    warehouseLocation?: string | null;
    images: string[];
    attributes?: unknown[];
  }>;
}

export interface DemoVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  lowStockThreshold?: number;
  barcode?: string | null;
  warehouseLocation?: string | null;
  attributes: Array<{
    attributeId: string;
    valueId: string;
    attribute: { id: string; name: string; slug: string };
    value: { id: string; value: string; slug: string };
  }>;
  product?: { id: string; name: string; slug: string };
}

export interface DemoTransaction {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
  order?: { id: string };
}

export interface DemoLog {
  id: string;
  level: string;
  message: string;
  context?: Record<string, unknown>;
  createdAt: string;
}

export interface DemoReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { id: string; name: string; avatar: string | null };
}

export interface DemoState {
  users: DemoUser[];
  carts: Record<string, DemoCart>;
  orders: DemoOrder[];
  products: DemoAdminProduct[];
  categories: DemoCategory[];
  attributes: DemoAttribute[];
  variants: DemoVariant[];
  transactions: DemoTransaction[];
  logs: DemoLog[];
  reviews: DemoReview[];
}
