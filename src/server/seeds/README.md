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

## Notes

- The seeder uses `upsert` operations, so it's safe to run multiple times
- All users have the same password for simplicity
- The seeder is designed to be minimal and basic for development purposes
