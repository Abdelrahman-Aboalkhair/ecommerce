# Database Seeding

This directory contains the database seeding script for the e-commerce platform.

## Running the Seeder

```bash
# From the server directory
npm run seed
```

## What Gets Created

The seeder creates the following basic data:

### Users

- **Superadmin**: `superadmin@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **User**: `user@example.com` / `password123`

### Categories

- **Electronics**: Basic electronics category

### Products

- **Smartphone X**: A sample product in the Electronics category
  - Variant: SMART-X-001 ($599.99, 50 in stock)

## 🖼️ Images

The seeder automatically adds images to users, products, and categories:

### **User Avatars**

- **Superadmin**: Generated avatar with "Super Admin" initials
- **Admin**: Generated avatar with "Admin User" initials
- **User**: Generated avatar with "Regular User" initials

### **Product Images**

- **Smartphone X**: Multiple product images for gallery view

### **Category Images**

- **Electronics**: Category banner image

### **Custom Images**

You can add your own images by placing them in the `assets/seed-images/` directory. See the [Seed Images README](../../../assets/seed-images/README.md) for details.

## Notes

- The seeder uses `upsert` operations, so it's safe to run multiple times
- All users have the same password for simplicity
- The seeder is designed to be minimal and basic for development purposes
- Images use fallback URLs if local images don't exist
