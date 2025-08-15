# Seed Images

This directory contains images for seeded data in the e-commerce platform.

## 📁 Directory Structure

```
assets/seed-images/
├── users/           # User avatar images
├── products/        # Product images
└── categories/      # Category banner images
```

## 🖼️ Adding Custom Images

### **User Avatars**

Place user avatar images in the `users/` directory:

- `superadmin.jpg` - Superadmin avatar
- `admin.jpg` - Admin avatar
- `user.jpg` - Regular user avatar

### **Product Images**

Place product images in the `products/` directory:

- `smartphone-1.jpg` - Main product image
- `smartphone-2.jpg` - Secondary product image
- `smartphone-3.jpg` - Additional product image
- `smartphone-4.jpg` - Additional product image

### **Category Images**

Place category banner images in the `categories/` directory:

- `electronics.jpg` - Electronics category banner

## 📋 Image Requirements

- **Format**: JPG/JPEG recommended
- **User Avatars**: 200x200px (square)
- **Product Images**: 400x400px (square)
- **Category Images**: 400x300px (landscape)

## 🔄 Fallback System

If local images don't exist, the seeder will automatically use:

- **User Avatars**: UI Avatars API (generated avatars with initials)
- **Product Images**: Picsum Photos (random placeholder images)
- **Category Images**: Picsum Photos (random placeholder images)

## 🚀 Usage

1. Add your custom images to the appropriate directories
2. Run the seeder: `cd src/server && npm run seed`
3. The seeder will automatically use your custom images

## 💡 Tips

- Use descriptive filenames that match the seeder expectations
- Optimize images for web (compress, resize appropriately)
- Keep file sizes reasonable (< 500KB per image)
- Use consistent aspect ratios for better UX
