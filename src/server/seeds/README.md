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

The seeder creates basic data without images. The frontend automatically generates beautiful placeholder images:

### **User Avatars**
- Generated automatically with user initials and random background colors
- Clean, professional look with user's first and last name initials

### **Product Images**
- Generated automatically with product name initials
- Random background colors for visual variety
- Consistent sizing and styling

### **How It Works**
- Frontend detects missing or invalid images
- Automatically generates SVG placeholders with:
  - Random background colors (Indigo, Emerald, Blue, Amber, Red, Violet, Cyan, Lime)
  - Product/user initials in white text
  - Professional styling and consistent sizing

## Notes

- The seeder uses `upsert` operations, so it's safe to run multiple times
- All users have the same password for simplicity
- The seeder is designed to be minimal and basic for development purposes
- Frontend automatically generates placeholder images when needed
