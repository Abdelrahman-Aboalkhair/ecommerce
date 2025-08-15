import path from "path";
import fs from "fs";

// Local image paths for seeded data
const SEED_IMAGES_PATH = path.join(process.cwd(), "../../assets/seed-images");

// Fallback image URLs (if local images don't exist)
const FALLBACK_IMAGES = {
  users: {
    superadmin:
      "https://ui-avatars.com/api/?name=Super+Admin&background=6366f1&color=fff&size=200",
    admin:
      "https://ui-avatars.com/api/?name=Admin+User&background=10b981&color=fff&size=200",
    user: "https://ui-avatars.com/api/?name=Regular+User&background=3b82f6&color=fff&size=200",
  },
  products: {
    smartphone: "https://picsum.photos/400/400?random=1",
    electronics: "https://picsum.photos/400/400?random=2",
  },
  categories: {
    electronics: "https://picsum.photos/400/300?random=3",
  },
} as const;

// Check if local image exists
const imageExists = (imagePath: string): boolean => {
  try {
    return fs.existsSync(imagePath);
  } catch {
    return false;
  }
};

// Get image URL (local or fallback)
export const getImageUrl = (
  type: "users" | "products" | "categories",
  name: string,
  fallbackKey?: string
): string => {
  const localPath = path.join(SEED_IMAGES_PATH, type, `${name}.jpg`);
  const fallbackKeyToUse = fallbackKey || name;

  if (imageExists(localPath)) {
    // Return local path that can be served by Next.js
    return `/assets/seed-images/${type}/${name}.jpg`;
  }

  // Return fallback URL with proper type checking
  const fallbackImages = FALLBACK_IMAGES[type] as Record<string, string>;
  return (
    fallbackImages[fallbackKeyToUse] ||
    fallbackImages.user ||
    fallbackImages.superadmin ||
    fallbackImages.admin
  );
};

// Get multiple product images
export const getProductImages = (productName: string): string[] => {
  const images: string[] = [];

  // Try to get multiple local images
  for (let i = 1; i <= 4; i++) {
    const localPath = path.join(
      SEED_IMAGES_PATH,
      "products",
      `${productName}-${i}.jpg`
    );
    if (imageExists(localPath)) {
      images.push(`/assets/seed-images/products/${productName}-${i}.jpg`);
    }
  }

  // If no local images, use fallbacks
  if (images.length === 0) {
    return [
      "https://picsum.photos/400/400?random=1",
      "https://picsum.photos/400/400?random=2",
      "https://picsum.photos/400/400?random=3",
    ];
  }

  return images;
};

// Get category images
export const getCategoryImages = (categoryName: string): string[] => {
  const localPath = path.join(
    SEED_IMAGES_PATH,
    "categories",
    `${categoryName}.jpg`
  );

  if (imageExists(localPath)) {
    return [`/assets/seed-images/categories/${categoryName}.jpg`];
  }

  const fallbackImages = FALLBACK_IMAGES.categories as Record<string, string>;
  return [fallbackImages[categoryName] || fallbackImages.electronics];
};
