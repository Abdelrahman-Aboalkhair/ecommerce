# Modern E-commerce Platform

A modern Single Store Ecommerce platform built with a **TypeScript** backend (Express, Prisma, PostgreSQL, Redis) and a **Next.js** frontend. Features include user authentication, product management, cart, checkout, order processing, analytics, and real-time chat via Socket.IO, WebRTC. The application is fully Dockerized for easy setup and development.

[Demo Video](https://youtu.be/qJDXcQ_sxSI)

## Notes

- To transition from development to production, please refer to the [Deployment](#deployment) section.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Docker Setup](#docker-setup)
  - [Non-Docker Setup](#non-docker-setup)
- [Running the Application](#running-the-application)
- [Seeding the Database](#seeding-the-database)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

### **1. User Authentication & Authorization**

#### FLOW

[App Starts]
|
v
GET /me (with cookie)
|
+--> 200 OK => set user in Redux => Auth ready
|
+--> 401 Unauthorized
|
v
POST /refresh (cookie-based)
|
+--> 200 OK => new token => retry /me => set user
|
+--> 401 => logout

- **Sign‑up / Sign‑in** — Email & password, social login (Facebook, Google, Twitter, Apple)
- **Email Verification & Password Reset** — `/auth/verify-email`, `/auth/password-reset/[token]` flows
- **Role‑Based Access Control** — User, Admin, Superadmin roles enforced via `authorizeRole` middleware and protected routes
- **Error Pages** — Custom `forbidden`, `unauthorized` and error boundary components

### **2. Product & Catalog Management**

- **CRUD Operations** — Products, Categories, Attributes, Sections, Variants
- **Variant System** — Combine attributes (size, color, material, etc.) into SKU variants
- **Image Galleries & Uploads** — Cloudinary integration for product images, sliders, assets
- **Filtering & Browsing** — CategoryBrowser, ProductFilters, DependentDropdown components

### **3. Shopping Cart & Checkout**

- **Persistent Cart** — Guest + authenticated carts with quantity management (`QuantitySelector`)
- **Stripe Integration** — Checkout pages with success, failure, and cancel callbacks

### **4. Order & Shipment Workflow**

- **Order Lifecycle** — Pending → Shipped → Delivered → Returned statuses
- **Shipment Tracking** — Shipment module with tracking, webhook support for external updates
- **Webhooks** — `/webhook` endpoint for payment and shipping event handling

### **5. Real‑time Chat & Calls**

- **Socket.IO Chat** — Real‑time customer‑to‑admin messaging, persisted in DB
- **WebRTC Audio/Video** — Call screens, `useWebRTCCall`, `AudioPlayer`, `CallControls`

### **6. Admin Dashboard & Analytics**

- **Modular Dashboard** — Users, Orders, Products, Inventory, Transactions, Logs, Reports sections
- **Interactive Charts** — Area, Bar, Donut, RevenueOverTime (Recharts)
- **Analytics APIs** — REST v1 & v2, GraphQL v1 & v2, Redis caching

### **7. API Layer & Security**

- **REST & GraphQL** — Versioned endpoints (`/v1`, `/v2`) with Express and Apollo
- **JWT Authentication** — `protect` & `optionalAuth` middleware, CORS, input validation
- **Error Handling & Logging** — Centralized `globalError` handler, Winston logs, rate limiting

<!--

### **8. Background Processing & Notifications**

- **Job Queues** — Bull-powered queues (`queue.service.ts`) for email, image processing, etc.
- **Workers** — `email.worker.ts`, `image-upload.worker.ts` -->

<!-- ### **9. Database & Seeding**

- **Prisma ORM** — Schema, migrations, environment‑aware seeds (`seeds/seed.ts`)
- **Test Data** — Users, Products, Orders, Chats seeded for dev/test -->

### **10. DevOps & Deployment**

- **Docker Compose** — Containerized Next.js (client) & Express (server) services
- **Hot‑Reload** — Nodemon for server, Fast refresh for client
- **API Documentation** — Swagger UI (`docs/swagger.ts`)

## 📸 Screenshots

### 🏠 Homepage & Authentication

<p float="left">
  <img src="./assets/screenshots/homepage.png" width="300" />
  <img src="./assets/screenshots/sign-in.png" width="300" />
  <img src="./assets/screenshots/sign-up.png" width="300" />
</p>

### 🛒 E-commerce Flow

<p float="left">
  <img src="./assets/screenshots/product_detail.png" width="300" />
  <img src="./assets/screenshots/cart.png" width="300" />
  <img src="./assets/screenshots/payment.png" width="300" />
  <img src="./assets/screenshots/track_your_order.png" width="300" />
  <img src="./assets/screenshots/your_orders.png" width="300" />
</p>

### 📊 Admin Dashboards

<p float="left">
  <img src="./assets/screenshots/dashboard_overview.png" width="300" />
  <img src="./assets/screenshots/products_dashboard.png" width="300" />
  <img src="./assets/screenshots/attributes_dashboard.png" width="300" />
  <img src="./assets/screenshots/inventory_dashboard.png" width="300" />
  <img src="./assets/screenshots/reports_dashboard.png" width="300" />
  <img src="./assets/screenshots/analytics_dashboard.png" width="300" />
  <img src="./assets/screenshots/logs_dashboard.png" width="300" />
</p>

### 💬 Communication & Support

<p float="left">
  <img src="./assets/screenshots/dashboard_chat.png" width="300" />
  <img src="./assets/screenshots/user_chat.png" width="300" />
</p>

## Tech Stack

**Backend**:

- Node.js v22
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.IO
- Winston (logging)
- Cloudinary (image storage)
- Stripe (payment processing)

**Frontend**:

- Next.js
- TypeScript
- Tailwind CSS (assumed, adjust if different)

**Infrastructure**:

- Docker & Docker Compose
- WSL2 (development environment)

## Project Structure

```
├── client
│   ├── Dockerfile
│   ├── README.md
│   ├── app
│   │   ├── (auth)
│   │   ├── (private)
│   │   ├── (public)
│   │   ├── AuthGate.tsx
│   │   ├── ClientProviders.tsx
│   │   ├── StoreProvider.tsx
│   │   ├── assets
│   │   ├── components
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── gql
│   │   ├── hooks
│   │   ├── layout.tsx
│   │   ├── lib
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   │   ├── store
│   │   ├── types
│   │   └── utils
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── kgKraftLogo.png
│   │   ├── locales
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   └── tsconfig.json
├── docker-compose.yml
└── server
    ├── Dockerfile
    ├── nodemon.json
    ├── package-lock.json
    ├── package.json
    ├── prisma
    │   ├── migrations
    │   └── schema.prisma
    ├── seeds
    │   └── seed.ts
    ├── src
    │   ├── app.ts
    │   ├── docs
    │   ├── graphql
    │   ├── infra
    │   ├── modules
    │   ├── routes
    │   ├── server.ts
    │   ├── shared
    │   └── types.d.ts
    └── tsconfig.json
```

## Prerequisites

- **Node.js** v22 or higher ([Download](https://nodejs.org/))
- **npm** v10 or higher
- **Docker** and **Docker Compose** (for Docker setup) ([Download](https://www.docker.com/))
- **PostgreSQL** v15 and **Redis** v7 (for non-Docker setup)
- **WSL2** (optional, recommended for Windows users)

For WSL2 users, ensure Docker Desktop is configured with WSL2 integration and `localhostForwarding=true` in `~/.wslconfig`.

## Installation

### Docker Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/ss-ecommerce.git
   cd ss-ecommerce
   ```

2. **Install Dependencies**:

   - For backend:
     ```bash
     cd server
     npm install
     ```
   - For frontend:
     ```bash
     cd client
     npm install
     ```

3. **Set Up Environment Variables**:

   - Copy the example `.env` files:
     ```bash
     cp server/.env.example server/.env
     cp client/.env.example client/.env.local
     ```
   - Update `server/.env` with your credentials (e.g., `SESSION_SECRET`, `COOKIE_SECRET`, etc).

4. **Build and Start Services**:

   ```bash
   docker compose up --build
   ```

   - This starts `db` (PostgreSQL), `redis`, `server` (backend), and `client` (frontend).

5. **Run Prisma Migrations**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

### Non-Docker Setup

1. **Install PostgreSQL and Redis**:

   - On Ubuntu (WSL2):
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib redis-server
     ```
   - Start services:
     ```bash
     sudo service postgresql start
     sudo service redis-server start
     ```

2. **Configure PostgreSQL**:

   ```bash
   sudo -u postgres psql
   ```

   ```sql
   CREATE USER USERNAME WITH PASSWORD 'PASSWORD';
   CREATE DATABASE ss_ecommerce;
   GRANT ALL PRIVILEGES ON DATABASE ss_ecommerce TO USERNAME;
   \q
   ```

3. **Clone and Install Dependencies**:

   ```bash
   git clone https://github.com/Abdelrahman-Aboalkhair/ss-ecommerce.git
   cd ss-ecommerce
   cd server && npm install
   cd ../client && npm install
   ```

4. **Set Up Environment Variables**:

   - Copy `.env` files as above.
   - Ensure `server/.env` has:
     ```
     DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@localhost:5432/ss_ecommerce
     REDIS_HOST=localhost
     REDIS_PORT=6379
     PORT=5000
     NODE_ENV=development
     SESSION_SECRET=your_session_secret
     COOKIE_SECRET=your_cookie_secret
     ```
   - Ensure `client/.env.local` has:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:5000
     ```

5. **Run Prisma Migrations**:
   ```bash
   cd server
   npx prisma migrate dev
   ```

## Running the Application

### Docker

- Start all services:
  ```bash
  docker compose up
  ```
- Access:
  - Frontend: `http://localhost:3000`
  - Backend API: `http://localhost:5000/api/v1`
  - Swagger Docs: `http://localhost:5000/api-docs`
  - GraphQL: `http://localhost:5000/api/v1/graphql`

### Non-Docker

1. Start PostgreSQL and Redis (if not already running).
2. Start the backend:
   ```bash
   cd server
   npm run dev
   ```
3. Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

- Access URLs as above.

## Seeding the Database

Populate the database with test data (10 users, 5 categories, 50 products, 20 orders):

1. Ensure the database is running (`docker compose up -d db` or local PostgreSQL).
2. Run the seeding script:
   ```bash
   cd server
   npm run seed
   ```
3. Verify data:
   ```bash
   psql -h localhost -p 5432 -U abdelrahman -d ss_ecommerce
   SELECT * FROM "User" LIMIT 5;
   SELECT * FROM "Product" LIMIT 5;
   SELECT * FROM "Order" LIMIT 5;
   ```

## API Documentation

Explore the REST API via Swagger UI:

- URL: `http://localhost:5000/api-docs`
- Includes endpoints for `/api/v1/users`, `/api/v1/auth`, `/api/v1/products`, etc.

GraphQL API is available at:

- URL: `http://localhost:5000/api/v1/graphql`

## 🧪 API Testing with Postman

You can find Postman collections inside the [`/collections`](./collections) folder.

To test the APIs:

1. Open Postman.
2. Import the `.json` collection file(s) from the `collections/` directory.
3. Set the environment variables if needed.

## Deployment

## Transition from Development to Production

1. **Database**: Use a managed PostgreSQL/Redis provider (e.g., Neon).
2. **Redis**: Use a managed Redis provider (e.g., Upstash).
3. **Backend**: Host on a platform like AWS ECS, Heroku, or Render.
4. **Frontend**: Deploy on Vercel, Netlify, or AWS Amplify.

- **NOTES** to make sure your application is production-ready.

1. Go to /server/package.json and change moduleAlias folder to dist for prod, src for dev.
2. change env variables for prod on both server and client
3. change apolloClient file url from prod to dev or vice versa
4. change ApiSlice baseQuery method url from prod to dev or vice versa
5. For stripe webhook, go to your stripe dashboard, webhooks, create a new destination and get your webhook secret cause it differs from local listener secret (follow stripe instructions if you wanna test locally).
6. For Social media login, you would need to configure the urls as well in google console and facebook console (follow the instructions in the links), X (twitter) developers. (e.g. http://localhost:5000 for dev, https://ss-ecommerce.vercel.app for prod).

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please follow the [Code of Conduct](#) and report issues via [GitHub Issues](#).

## License

This project is licensed under the MIT License. See the [LICENSE](#) file for details.

---
