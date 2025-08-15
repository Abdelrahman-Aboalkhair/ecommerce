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

  // Create users - bypassing auth service restrictions for seeding
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

  // Create a category
  const category = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Electronic devices and gadgets",
      images: [],
    },
  });

  // Create a product
  const product = await prisma.product.upsert({
    where: { slug: "smartphone-x" },
    update: {},
    create: {
      name: "Smartphone X",
      slug: "smartphone-x",
      description: "Latest smartphone with advanced features",
      categoryId: category.id,
      isNew: true,
      isFeatured: true,
    },
  });

  // Create a product variant
  const variant = await prisma.productVariant.upsert({
    where: { sku: "SMART-X-001" },
    update: {},
    create: {
      productId: product.id,
      sku: "SMART-X-001",
      price: 599.99,
      stock: 50,
      images: [],
      barcode: "1234567890123",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Created:");
  console.log(`- Superadmin: ${superadmin.email} (password: password123)`);
  console.log(`- Admin: ${admin.email} (password: password123)`);
  console.log(`- User: ${user.email} (password: password123)`);
  console.log(`- Category: ${category.name}`);
  console.log(`- Product: ${product.name}`);
  console.log(`- Variant: ${variant.sku} - $${variant.price}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
