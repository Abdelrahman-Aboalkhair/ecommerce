import { Product } from "@/app/types/productTypes";
import type { FilterValues } from "@/app/(public)/shop/ProductFilters";

export type DemoCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

const electronics: DemoCategory = {
  id: "demo-cat-electronics",
  slug: "electronics",
  name: "Electronics",
  description: "Devices and gadgets",
};

const clothing: DemoCategory = {
  id: "demo-cat-clothing",
  slug: "clothing",
  name: "Clothing",
  description: "Fashion and apparel",
};

const footwear: DemoCategory = {
  id: "demo-cat-footwear",
  slug: "footwear",
  name: "Footwear",
  description: "Shoes and sneakers",
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  electronics,
  clothing,
  footwear,
];

function variant(
  id: string,
  sku: string,
  price: number,
  stock = 24
): Product["variants"][0] {
  return {
    id,
    sku,
    price,
    images: [],
    stock,
    lowStockThreshold: 5,
    barcode: null,
    warehouseLocation: null,
    attributes: [],
  };
}

function product(p: Omit<Product, "reviews"> & { reviews?: Product["reviews"] }): Product {
  return {
    reviews: [],
    description: p.description ?? null,
    ...p,
  };
}

export const DEMO_PRODUCTS: Product[] = [
  product({
    id: "demo-prod-1",
    slug: "smartphone-x",
    name: "Smartphone X",
    isNew: true,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    averageRating: 4.8,
    reviewCount: 128,
    description:
      "Flagship smartphone with OLED display, triple camera, and all-day battery. Demo listing for offline browsing.",
    variants: [variant("demo-var-1", "SMART-X-001", 599.99)],
    category: electronics,
  }),
  product({
    id: "demo-prod-2",
    slug: "wireless-headphones-pro",
    name: "Wireless Headphones Pro",
    isNew: false,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
    averageRating: 4.5,
    reviewCount: 64,
    description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
    variants: [variant("demo-var-2", "WH-PRO-001", 149.99)],
    category: electronics,
  }),
  product({
    id: "demo-prod-3",
    slug: "smart-watch-series",
    name: "Smart Watch Series",
    isNew: false,
    isFeatured: true,
    isTrending: true,
    isBestSeller: false,
    averageRating: 4.4,
    reviewCount: 89,
    description: "Fitness tracking, notifications, and customizable watch faces.",
    variants: [variant("demo-var-3", "SW-SER-001", 249.99)],
    category: electronics,
  }),
  product({
    id: "demo-prod-4",
    slug: "classic-denim-jacket",
    name: "Classic Denim Jacket",
    isNew: false,
    isFeatured: false,
    isTrending: true,
    isBestSeller: false,
    averageRating: 4.6,
    reviewCount: 42,
    description: "Medium-wash denim jacket with a relaxed fit.",
    variants: [variant("demo-var-4", "DENIM-J-001", 79.99)],
    category: clothing,
  }),
  product({
    id: "demo-prod-5",
    slug: "running-sneakers",
    name: "Running Sneakers",
    isNew: false,
    isFeatured: false,
    isTrending: false,
    isBestSeller: true,
    averageRating: 4.7,
    reviewCount: 203,
    description: "Lightweight runners with responsive cushioning.",
    variants: [variant("demo-var-5", "RUN-SN-001", 119.99)],
    category: footwear,
  }),
  product({
    id: "demo-prod-6",
    slug: "usb-c-laptop-stand",
    name: "USB-C Laptop Stand",
    isNew: true,
    isFeatured: false,
    isTrending: false,
    isBestSeller: false,
    averageRating: 4.3,
    reviewCount: 17,
    description: "Aluminum stand for better ergonomics at your desk.",
    variants: [variant("demo-var-6", "STAND-001", 49.99)],
    category: electronics,
  }),
];

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function filterDemoProducts(
  products: Product[],
  filters: FilterValues
): Product[] {
  return products.filter((product) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!product.name.toLowerCase().includes(q)) return false;
    }
    if (filters.categoryId && product.category?.id !== filters.categoryId) {
      return false;
    }
    if (filters.isNew && !product.isNew) return false;
    if (filters.isFeatured && !product.isFeatured) return false;
    if (filters.isTrending && !product.isTrending) return false;
    if (filters.isBestSeller && !product.isBestSeller) return false;

    const price = product.variants[0]?.price ?? 0;
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;

    return true;
  });
}

export function paginateDemoProducts(
  products: Product[],
  skip: number,
  first: number
): { products: Product[]; hasMore: boolean; totalCount: number } {
  const slice = products.slice(skip, skip + first);
  return {
    products: slice,
    hasMore: skip + first < products.length,
    totalCount: products.length,
  };
}
