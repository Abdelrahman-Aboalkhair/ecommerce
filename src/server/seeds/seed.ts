import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function cleanup() {
  console.log("🧹 Cleaning up existing data...");

  // Delete in reverse order of dependencies to respect foreign key constraints
  await prisma.chatMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.report.deleteMany();
  await prisma.interaction.deleteMany();
  await prisma.cartEvent.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.address.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.restock.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.productVariantAttribute.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.categoryAttribute.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleanup completed");
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean up existing data first
  await cleanup();

  // 1. Create users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "SUPERADMIN",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: hashedPassword,
      name: "Regular User",
      role: "USER",
    },
  });

  // 2. Create categories
  const electronicsCategory = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and gadgets",
      images: [],
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "Clothing",
      slug: "clothing",
      description: "Fashion and apparel",
      images: [],
    },
  });

  const footwearCategory = await prisma.category.upsert({
    where: { slug: "footwear" },
    update: {},
    create: {
      name: "Footwear",
      slug: "footwear",
      description: "Shoes and sneakers",
      images: [],
    },
  });

  const furnitureCategory = await prisma.category.upsert({
    where: { slug: "furniture" },
    update: {},
    create: {
      name: "Furniture",
      slug: "furniture",
      description: "Home and office furniture",
      images: [],
    },
  });

  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      description: "Fashion accessories and jewelry",
      images: [],
    },
  });

  // 3. Create attributes
  const sizeAttribute = await prisma.attribute.upsert({
    where: { slug: "size" },
    update: {},
    create: {
      name: "Size",
      slug: "size",
    },
  });

  const colorAttribute = await prisma.attribute.upsert({
    where: { slug: "color" },
    update: {},
    create: {
      name: "Color",
      slug: "color",
    },
  });

  const materialAttribute = await prisma.attribute.upsert({
    where: { slug: "material" },
    update: {},
    create: {
      name: "Material",
      slug: "material",
    },
  });

  const storageAttribute = await prisma.attribute.upsert({
    where: { slug: "storage" },
    update: {},
    create: {
      name: "Storage",
      slug: "storage",
    },
  });

  const brandAttribute = await prisma.attribute.upsert({
    where: { slug: "brand" },
    update: {},
    create: {
      name: "Brand",
      slug: "brand",
    },
  });

  // 4. Create attribute values
  // Size values
  const sizeXS = await prisma.attributeValue.upsert({
    where: { slug: "xs" },
    update: {},
    create: {
      attributeId: sizeAttribute.id,
      value: "XS",
      slug: "xs",
    },
  });

  const sizeS = await prisma.attributeValue.upsert({
    where: { slug: "s" },
    update: {},
    create: {
      attributeId: sizeAttribute.id,
      value: "S",
      slug: "s",
    },
  });

  const sizeM = await prisma.attributeValue.upsert({
    where: { slug: "m" },
    update: {},
    create: {
      attributeId: sizeAttribute.id,
      value: "M",
      slug: "m",
    },
  });

  const sizeL = await prisma.attributeValue.upsert({
    where: { slug: "l" },
    update: {},
    create: {
      attributeId: sizeAttribute.id,
      value: "L",
      slug: "l",
    },
  });

  const sizeXL = await prisma.attributeValue.upsert({
    where: { slug: "xl" },
    update: {},
    create: {
      attributeId: sizeAttribute.id,
      value: "XL",
      slug: "xl",
    },
  });

  const sizeXXL = await prisma.attributeValue.upsert({
    where: { slug: "xxl" },
    update: {},
    create: {
      attributeId: sizeAttribute.id,
      value: "XXL",
      slug: "xxl",
    },
  });

  // Color values
  const colorRed = await prisma.attributeValue.upsert({
    where: { slug: "red" },
    update: {},
    create: {
      attributeId: colorAttribute.id,
      value: "Red",
      slug: "red",
    },
  });

  const colorBlue = await prisma.attributeValue.upsert({
    where: { slug: "blue" },
    update: {},
    create: {
      attributeId: colorAttribute.id,
      value: "Blue",
      slug: "blue",
    },
  });

  const colorBlack = await prisma.attributeValue.upsert({
    where: { slug: "black" },
    update: {},
    create: {
      attributeId: colorAttribute.id,
      value: "Black",
      slug: "black",
    },
  });

  const colorWhite = await prisma.attributeValue.upsert({
    where: { slug: "white" },
    update: {},
    create: {
      attributeId: colorAttribute.id,
      value: "White",
      slug: "white",
    },
  });

  const colorGreen = await prisma.attributeValue.upsert({
    where: { slug: "green" },
    update: {},
    create: {
      attributeId: colorAttribute.id,
      value: "Green",
      slug: "green",
    },
  });

  const colorYellow = await prisma.attributeValue.upsert({
    where: { slug: "yellow" },
    update: {},
    create: {
      attributeId: colorAttribute.id,
      value: "Yellow",
      slug: "yellow",
    },
  });

  // Material values
  const materialCotton = await prisma.attributeValue.upsert({
    where: { slug: "cotton" },
    update: {},
    create: {
      attributeId: materialAttribute.id,
      value: "Cotton",
      slug: "cotton",
    },
  });

  const materialLeather = await prisma.attributeValue.upsert({
    where: { slug: "leather" },
    update: {},
    create: {
      attributeId: materialAttribute.id,
      value: "Leather",
      slug: "leather",
    },
  });

  const materialPolyester = await prisma.attributeValue.upsert({
    where: { slug: "polyester" },
    update: {},
    create: {
      attributeId: materialAttribute.id,
      value: "Polyester",
      slug: "polyester",
    },
  });

  const materialWood = await prisma.attributeValue.upsert({
    where: { slug: "wood" },
    update: {},
    create: {
      attributeId: materialAttribute.id,
      value: "Wood",
      slug: "wood",
    },
  });

  const materialMetal = await prisma.attributeValue.upsert({
    where: { slug: "metal" },
    update: {},
    create: {
      attributeId: materialAttribute.id,
      value: "Metal",
      slug: "metal",
    },
  });

  // Storage values
  const storage128GB = await prisma.attributeValue.upsert({
    where: { slug: "128gb" },
    update: {},
    create: {
      attributeId: storageAttribute.id,
      value: "128GB",
      slug: "128gb",
    },
  });

  const storage256GB = await prisma.attributeValue.upsert({
    where: { slug: "256gb" },
    update: {},
    create: {
      attributeId: storageAttribute.id,
      value: "256GB",
      slug: "256gb",
    },
  });

  const storage512GB = await prisma.attributeValue.upsert({
    where: { slug: "512gb" },
    update: {},
    create: {
      attributeId: storageAttribute.id,
      value: "512GB",
      slug: "512gb",
    },
  });

  const storage1TB = await prisma.attributeValue.upsert({
    where: { slug: "1tb" },
    update: {},
    create: {
      attributeId: storageAttribute.id,
      value: "1TB",
      slug: "1tb",
    },
  });

  // Brand values
  const brandApple = await prisma.attributeValue.upsert({
    where: { slug: "apple" },
    update: {},
    create: {
      attributeId: brandAttribute.id,
      value: "Apple",
      slug: "apple",
    },
  });

  const brandNike = await prisma.attributeValue.upsert({
    where: { slug: "nike" },
    update: {},
    create: {
      attributeId: brandAttribute.id,
      value: "Nike",
      slug: "nike",
    },
  });

  const brandAdidas = await prisma.attributeValue.upsert({
    where: { slug: "adidas" },
    update: {},
    create: {
      attributeId: brandAttribute.id,
      value: "Adidas",
      slug: "adidas",
    },
  });

  const brandSamsung = await prisma.attributeValue.upsert({
    where: { slug: "samsung" },
    update: {},
    create: {
      attributeId: brandAttribute.id,
      value: "Samsung",
      slug: "samsung",
    },
  });

  const brandIkea = await prisma.attributeValue.upsert({
    where: { slug: "ikea" },
    update: {},
    create: {
      attributeId: brandAttribute.id,
      value: "IKEA",
      slug: "ikea",
    },
  });

  // 5. Assign attributes to categories
  // Clothing attributes
  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: clothingCategory.id,
        attributeId: sizeAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: clothingCategory.id,
      attributeId: sizeAttribute.id,
      isRequired: true,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: clothingCategory.id,
        attributeId: colorAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: clothingCategory.id,
      attributeId: colorAttribute.id,
      isRequired: true,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: clothingCategory.id,
        attributeId: materialAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: clothingCategory.id,
      attributeId: materialAttribute.id,
      isRequired: false,
    },
  });

  // Footwear attributes
  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: footwearCategory.id,
        attributeId: sizeAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: footwearCategory.id,
      attributeId: sizeAttribute.id,
      isRequired: true,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: footwearCategory.id,
        attributeId: colorAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: footwearCategory.id,
      attributeId: colorAttribute.id,
      isRequired: true,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: footwearCategory.id,
        attributeId: materialAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: footwearCategory.id,
      attributeId: materialAttribute.id,
      isRequired: false,
    },
  });

  // Electronics attributes
  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: electronicsCategory.id,
        attributeId: colorAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: electronicsCategory.id,
      attributeId: colorAttribute.id,
      isRequired: false,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: electronicsCategory.id,
        attributeId: storageAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: electronicsCategory.id,
      attributeId: storageAttribute.id,
      isRequired: true,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: electronicsCategory.id,
        attributeId: brandAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: electronicsCategory.id,
      attributeId: brandAttribute.id,
      isRequired: false,
    },
  });

  // Furniture attributes
  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: furnitureCategory.id,
        attributeId: materialAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: furnitureCategory.id,
      attributeId: materialAttribute.id,
      isRequired: true,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: furnitureCategory.id,
        attributeId: colorAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: furnitureCategory.id,
      attributeId: colorAttribute.id,
      isRequired: false,
    },
  });

  await prisma.categoryAttribute.upsert({
    where: {
      categoryId_attributeId: {
        categoryId: furnitureCategory.id,
        attributeId: brandAttribute.id,
      },
    },
    update: {},
    create: {
      categoryId: furnitureCategory.id,
      attributeId: brandAttribute.id,
      isRequired: false,
    },
  });

  // 6. Create 10 products with variants
  const products = [
    // Electronics
    {
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      description: "Latest iPhone with advanced features",
      categoryId: electronicsCategory.id,
      isNew: true,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      variants: [
        {
          sku: "IPH16-PRO-128-BLACK",
          price: 999.99,
          stock: 25,
          barcode: "1234567890001",
          warehouseLocation: "WH-1A",
          attributes: [
            { attributeId: storageAttribute.id, valueId: storage128GB.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            { attributeId: brandAttribute.id, valueId: brandApple.id },
          ],
        },
        {
          sku: "IPH16-PRO-256-BLUE",
          price: 1099.99,
          stock: 20,
          barcode: "1234567890002",
          warehouseLocation: "WH-1B",
          attributes: [
            { attributeId: storageAttribute.id, valueId: storage256GB.id },
            { attributeId: colorAttribute.id, valueId: colorBlue.id },
            { attributeId: brandAttribute.id, valueId: brandApple.id },
          ],
        },
      ],
    },
    {
      name: "Samsung Galaxy S24",
      slug: "samsung-galaxy-s24",
      description: "Premium Android smartphone",
      categoryId: electronicsCategory.id,
      isNew: false,
      isFeatured: true,
      isTrending: false,
      isBestSeller: false,
      variants: [
        {
          sku: "SAMS-S24-256-GREEN",
          price: 899.99,
          stock: 30,
          barcode: "1234567890003",
          warehouseLocation: "WH-2A",
          attributes: [
            { attributeId: storageAttribute.id, valueId: storage256GB.id },
            { attributeId: colorAttribute.id, valueId: colorGreen.id },
            { attributeId: brandAttribute.id, valueId: brandSamsung.id },
          ],
        },
      ],
    },

    // Clothing
    {
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      description: "Comfortable cotton t-shirt",
      categoryId: clothingCategory.id,
      isNew: false,
      isFeatured: false,
      isTrending: true,
      isBestSeller: false,
      variants: [
        {
          sku: "TSH-COT-RED-S",
          price: 19.99,
          stock: 50,
          barcode: "1234567890004",
          warehouseLocation: "WH-3A",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeS.id },
            { attributeId: colorAttribute.id, valueId: colorRed.id },
            { attributeId: materialAttribute.id, valueId: materialCotton.id },
          ],
        },
        {
          sku: "TSH-COT-BLUE-M",
          price: 19.99,
          stock: 45,
          barcode: "1234567890005",
          warehouseLocation: "WH-3B",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeM.id },
            { attributeId: colorAttribute.id, valueId: colorBlue.id },
            { attributeId: materialAttribute.id, valueId: materialCotton.id },
          ],
        },
        {
          sku: "TSH-COT-BLACK-L",
          price: 19.99,
          stock: 40,
          barcode: "1234567890006",
          warehouseLocation: "WH-3C",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeL.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            { attributeId: materialAttribute.id, valueId: materialCotton.id },
          ],
        },
      ],
    },
    {
      name: "Denim Jeans",
      slug: "denim-jeans",
      description: "Classic denim jeans",
      categoryId: clothingCategory.id,
      isNew: false,
      isFeatured: false,
      isTrending: false,
      isBestSeller: true,
      variants: [
        {
          sku: "JNS-DEN-BLUE-32",
          price: 59.99,
          stock: 35,
          barcode: "1234567890007",
          warehouseLocation: "WH-4A",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeM.id },
            { attributeId: colorAttribute.id, valueId: colorBlue.id },
            { attributeId: materialAttribute.id, valueId: materialCotton.id },
          ],
        },
        {
          sku: "JNS-DEN-BLACK-34",
          price: 59.99,
          stock: 30,
          barcode: "1234567890008",
          warehouseLocation: "WH-4B",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeL.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            { attributeId: materialAttribute.id, valueId: materialCotton.id },
          ],
        },
      ],
    },

    // Footwear
    {
      name: "Nike Air Max",
      slug: "nike-air-max",
      description: "Comfortable running shoes",
      categoryId: footwearCategory.id,
      isNew: true,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      variants: [
        {
          sku: "NKE-AM-WHT-42",
          price: 129.99,
          stock: 25,
          barcode: "1234567890009",
          warehouseLocation: "WH-5A",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeL.id },
            { attributeId: colorAttribute.id, valueId: colorWhite.id },
            {
              attributeId: materialAttribute.id,
              valueId: materialPolyester.id,
            },
            { attributeId: brandAttribute.id, valueId: brandNike.id },
          ],
        },
        {
          sku: "NKE-AM-BLK-44",
          price: 129.99,
          stock: 20,
          barcode: "1234567890010",
          warehouseLocation: "WH-5B",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeXL.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            {
              attributeId: materialAttribute.id,
              valueId: materialPolyester.id,
            },
            { attributeId: brandAttribute.id, valueId: brandNike.id },
          ],
        },
      ],
    },
    {
      name: "Adidas Ultraboost",
      slug: "adidas-ultraboost",
      description: "Premium running shoes",
      categoryId: footwearCategory.id,
      isNew: false,
      isFeatured: true,
      isTrending: false,
      isBestSeller: false,
      variants: [
        {
          sku: "ADI-UB-RED-43",
          price: 179.99,
          stock: 15,
          barcode: "1234567890011",
          warehouseLocation: "WH-6A",
          attributes: [
            { attributeId: sizeAttribute.id, valueId: sizeL.id },
            { attributeId: colorAttribute.id, valueId: colorRed.id },
            {
              attributeId: materialAttribute.id,
              valueId: materialPolyester.id,
            },
            { attributeId: brandAttribute.id, valueId: brandAdidas.id },
          ],
        },
      ],
    },

    // Furniture
    {
      name: "Wooden Chair",
      slug: "wooden-chair",
      description: "Elegant wooden chair",
      categoryId: furnitureCategory.id,
      isNew: false,
      isFeatured: false,
      isTrending: true,
      isBestSeller: false,
      variants: [
        {
          sku: "CHR-WOD-BRN-1",
          price: 149.99,
          stock: 10,
          barcode: "1234567890012",
          warehouseLocation: "WH-7A",
          attributes: [
            { attributeId: materialAttribute.id, valueId: materialWood.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            { attributeId: brandAttribute.id, valueId: brandIkea.id },
          ],
        },
      ],
    },
    {
      name: "Metal Desk",
      slug: "metal-desk",
      description: "Modern metal desk",
      categoryId: furnitureCategory.id,
      isNew: false,
      isFeatured: false,
      isTrending: false,
      isBestSeller: true,
      variants: [
        {
          sku: "DSK-MTL-SLV-1",
          price: 299.99,
          stock: 8,
          barcode: "1234567890013",
          warehouseLocation: "WH-8A",
          attributes: [
            { attributeId: materialAttribute.id, valueId: materialMetal.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            { attributeId: brandAttribute.id, valueId: brandIkea.id },
          ],
        },
      ],
    },

    // Accessories
    {
      name: "Leather Wallet",
      slug: "leather-wallet",
      description: "Premium leather wallet",
      categoryId: accessoriesCategory.id,
      isNew: false,
      isFeatured: true,
      isTrending: false,
      isBestSeller: false,
      variants: [
        {
          sku: "WLT-LTH-BLK-1",
          price: 49.99,
          stock: 20,
          barcode: "1234567890014",
          warehouseLocation: "WH-9A",
          attributes: [
            { attributeId: materialAttribute.id, valueId: materialLeather.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
          ],
        },
        {
          sku: "WLT-LTH-BRN-1",
          price: 49.99,
          stock: 18,
          barcode: "1234567890015",
          warehouseLocation: "WH-9B",
          attributes: [
            { attributeId: materialAttribute.id, valueId: materialLeather.id },
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
          ],
        },
      ],
    },
    {
      name: "Sunglasses",
      slug: "sunglasses",
      description: "Stylish sunglasses",
      categoryId: accessoriesCategory.id,
      isNew: true,
      isFeatured: false,
      isTrending: false,
      isBestSeller: false,
      variants: [
        {
          sku: "SGL-BLK-1",
          price: 89.99,
          stock: 12,
          barcode: "1234567890016",
          warehouseLocation: "WH-10A",
          attributes: [
            { attributeId: colorAttribute.id, valueId: colorBlack.id },
            { attributeId: materialAttribute.id, valueId: materialMetal.id },
          ],
        },
        {
          sku: "SGL-YLW-1",
          price: 89.99,
          stock: 10,
          barcode: "1234567890017",
          warehouseLocation: "WH-10B",
          attributes: [
            { attributeId: colorAttribute.id, valueId: colorYellow.id },
            { attributeId: materialAttribute.id, valueId: materialMetal.id },
          ],
        },
      ],
    },
  ];

  // Create products and variants
  const createdProducts: any[] = [];
  const createdVariants: any[] = [];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        categoryId: productData.categoryId,
        isNew: productData.isNew,
        isFeatured: productData.isFeatured,
        isTrending: productData.isTrending,
        isBestSeller: productData.isBestSeller,
      },
    });

    createdProducts.push(product);

    for (const variantData of productData.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: variantData.sku,
          price: variantData.price,
          stock: variantData.stock,
          lowStockThreshold: 10,
          barcode: variantData.barcode,
          warehouseLocation: variantData.warehouseLocation,
          images: [],
        },
      });

      // Create variant attributes
      for (const attr of variantData.attributes) {
        await prisma.productVariantAttribute.create({
          data: {
            variantId: variant.id,
            attributeId: attr.attributeId,
            valueId: attr.valueId,
          },
        });
      }

      createdVariants.push(variant);
    }
  }

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Created:");
  console.log(`- Users: Superadmin, Admin, User`);
  console.log(
    `- Categories: ${electronicsCategory.name}, ${clothingCategory.name}, ${footwearCategory.name}, ${furnitureCategory.name}, ${accessoriesCategory.name}`
  );
  console.log(`- Attributes: Size, Color, Material, Storage, Brand`);
  console.log(`- Products: ${createdProducts.length} products with variants`);
  console.log(`- Variants: ${createdVariants.length} variants with attributes`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
