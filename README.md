# Full-Stack E-Commerce Platform

Open-source single-store shop built with Next.js and Express. Includes auth, catalog, cart, Stripe checkout, orders, admin analytics, and real-time chat.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Demo-Live-0070f3)](https://open-source-ecommerce.abdalrahman-aboalkhair.work)
[![YouTube Walkthrough](https://img.shields.io/badge/Video-Walkthrough-red?logo=youtube)](https://www.youtube.com/watch?v=qJDXcQ_sxSI)

**[Live demo](https://open-source-ecommerce.abdalrahman-aboalkhair.work)** · **[YouTube walkthrough](https://www.youtube.com/watch?v=qJDXcQ_sxSI)** · **[Local setup](#local-setup)** · [Repository](https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform)

![Storefront homepage](assets/screenshots/homepage.png)

## Demo video

[![Watch the full-stack walkthrough on YouTube](https://img.youtube.com/vi/qJDXcQ_sxSI/maxresdefault.jpg)](https://www.youtube.com/watch?v=qJDXcQ_sxSI)

**[▶ Watch on YouTube](https://www.youtube.com/watch?v=qJDXcQ_sxSI)** — local Docker setup, storefront, cart, Stripe checkout, admin dashboard, and chat. Some screens may differ slightly from the current codebase.

## Screenshots

### Storefront

| Home | Product detail |
| --- | --- |
| ![Homepage](assets/screenshots/homepage.png) | ![Product detail](assets/screenshots/product_detail.png) |

| Cart | Checkout |
| --- | --- |
| ![Cart](assets/screenshots/cart.png) | ![Payment](assets/screenshots/payment.png) |

| Sign in | Sign up |
| --- | --- |
| ![Sign in](assets/screenshots/sign-in.png) | ![Sign up](assets/screenshots/sign-up.png) |

| Your orders | Track order |
| --- | --- |
| ![Your orders](assets/screenshots/your_orders.png) | ![Track your order](assets/screenshots/track_your_order.png) |

| Customer chat |
| --- |
| ![User chat](assets/screenshots/user_chat.png) |

### Admin dashboard

| Overview | Products |
| --- | --- |
| ![Dashboard overview](assets/screenshots/dashboard_overview.png) | ![Products dashboard](assets/screenshots/products_dashboard.png) |

| Analytics | Inventory |
| --- | --- |
| ![Analytics](assets/screenshots/analytics_dashboard.png) | ![Inventory](assets/screenshots/inventory_dashboard.png) |

| Attributes | Reports |
| --- | --- |
| ![Attributes](assets/screenshots/attributes_dashboard.png) | ![Reports](assets/screenshots/reports_dashboard.png) |

| Logs | Admin chat |
| --- | --- |
| ![Logs](assets/screenshots/logs_dashboard.png) | ![Dashboard chat](assets/screenshots/dashboard_chat.png) |

## Features

- **Storefront** — catalog, product detail, cart, Stripe checkout, order tracking
- **Auth** — sign-up, sign-in, roles (user, admin, superadmin)
- **Admin** — products, inventory, attributes, analytics, reports, audit logs
- **Real-time chat** — customer support (Socket.IO)
- **API** — Express + Prisma, PostgreSQL, Redis, Swagger at `/api-docs`
- **Dev experience** — Docker Compose, seed data, env starter docs

## Deployment status

### Live demo (interactive, no backend)

The storefront is hosted on Vercel with **`NEXT_PUBLIC_DEMO_MODE=true`** — a full in-browser mock (no API/database):

**https://open-source-ecommerce.abdalrahman-aboalkhair.work**

- Browse catalog, **sign in** (quick demo accounts on the sign-in page), use **cart**, **mock checkout**, **orders**, and the **admin dashboard**.
- Data is simulated and stored in `localStorage` until you clear site data.
- **Live chat** is disabled on the hosted demo (requires Socket.IO + API). Run locally for chat.

**Vercel env for the public demo:** set `NEXT_PUBLIC_DEMO_MODE=true` in the client project settings and redeploy.

Demo accounts (any password works in demo mode):

| Role | Email |
|------|--------|
| Customer | `user@example.com` |
| Admin | `admin@example.com` |
| Superadmin | `superadmin@example.com` |

### Full stack (local or self-hosted)

There is no maintained hosted API, Postgres, or Redis for this repo. To run auth, cart, payments, and admin:

- **Run locally** using Docker or Node (below).
- **To deploy yourself**, provision API + database + Redis and set environment variables. This repo does not include cloud dashboard setup.

### If you deploy yourself

1. **Frontend** (e.g. Vercel): set `NEXT_PUBLIC_API_URL_PROD`, `NEXT_PUBLIC_API_URL_DEV` (if needed), `NEXT_PUBLIC_SOCKET_URL` — see [src/client/.env.example](src/client/.env.example).
2. **API** (e.g. Render, Railway, Fly): set `DATABASE_URL`, `REDIS_URL`, JWT/session secrets, Stripe, etc. — see [src/server/.env.example](src/server/.env.example).
3. **CORS / cookies**: set `ALLOWED_ORIGINS` on the server to your frontend URL (comma-separated). Required for production; no default production origin is baked into the code.
4. **Postgres + Redis**: use managed services; run `npx prisma migrate deploy` from `src/server`.

## What this is

Single-store e-commerce app: Next.js frontend, Express + Prisma backend, PostgreSQL, Redis, Socket.IO chat, Stripe checkout, admin dashboard.

## Project layout

```
src/
  client/     Next.js frontend
  server/     Express API + Prisma
  docker-compose.yml
  .env.example   Docker Postgres credentials (copy to .env)
```

## Local setup

Prerequisites: Node.js 18+, PostgreSQL, Redis (or use Docker).

No cloud database (Neon, etc.) is required for local Docker — Postgres and Redis run in Compose.

1. Clone and go to the repo root.

2. Create environment files (see [src/ENV_STARTER.md](src/ENV_STARTER.md) for a full starter pack):

```
cp src/.env.example src/.env
cp src/server/.env.example src/server/.env
cp src/client/.env.example src/client/.env.local
```

3. Edit the env files before the first `docker compose up`:

| File | Purpose |
|------|---------|
| `src/.env` | Postgres user, password, and database name for the `db` container |
| `src/server/.env` | API secrets, `REDIS_URL`, Stripe/OAuth placeholders, etc. |
| `src/client/.env.local` | `NEXT_PUBLIC_*` URLs pointing at `http://localhost:5000` |

Use the same Postgres password in `src/.env` and in `src/server/.env` `DATABASE_URL` (same user and database name). Example `DATABASE_URL` for Docker:

`postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/b2c_ecommerce` (host) — inside Compose, `DATABASE_URL` is overridden to use host `db`.

### Option A — Docker (recommended)

From `src/`:

```
docker compose up --build
```

In a **second terminal**, after containers are running:

```
cd src
docker compose exec server npx prisma migrate deploy
docker compose exec server npm run seed
```

Open http://localhost:3000 (frontend), http://localhost:5000/api/v1 (API), http://localhost:5000/api-docs (Swagger).

#### Postgres credentials and the `pgdata` volume (read this)

Docker Postgres reads `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` from `src/.env` **only when the database volume is created for the first time**.

If you already ran Compose before, or you change those values later, the old username/password stay stored in the `pgdata` volume. Prisma will then fail with:

`P1000: Authentication failed ... the provided database credentials for ... are not valid`

**Fix:** reset the local database volume, then start again and re-run migrate + seed:

```
cd src
docker compose down -v
docker compose up --build
docker compose exec server npx prisma migrate deploy
docker compose exec server npm run seed
```

`-v` deletes local Postgres data. Use it whenever you change `src/.env` Postgres credentials or hit `P1000` after a fresh clone with an old volume.

### Option B — without Docker

```
cd src/server
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

In another terminal:

```
cd src/client
npm install
npm run dev
```

## Test accounts (after seeding)

After `npm run seed` (or `docker compose exec server npm run seed`). Use only in local development.

| Role       | Email                    | Password      |
|------------|--------------------------|---------------|
| Superadmin | superadmin@example.com | password123   |
| Admin      | admin@example.com      | password123   |
| User       | user@example.com       | password123   |

## Demo mode flags

| Variable | Effect |
|----------|--------|
| `NEXT_PUBLIC_DEMO_MODE=true` | Full mock: auth, cart, checkout, orders, admin REST, dashboard GraphQL. See [src/client/.env.example](src/client/.env.example). |
| `NEXT_PUBLIC_USE_DEMO_CATALOG=true` | Catalog-only static products (legacy); use `DEMO_MODE` for the hosted site instead. |

When the API is unreachable and neither flag is set, the client **falls back** to static catalog data for browse-only pages.

## Stack

Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Socket.IO, Stripe, Cloudinary.

Frontend: Next.js, TypeScript, Tailwind, Redux Toolkit.

## More docs

- [src/ENV_STARTER.md](src/ENV_STARTER.md) — copy-paste env values for a fresh clone
- [MAINTENANCE.md](MAINTENANCE.md) — maintenance notes and audit history
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to contribute
- [src/server/README.md](src/server/README.md) — server details
- [src/client/README.md](src/client/README.md) — client details

## License

MIT. See LICENSE.
