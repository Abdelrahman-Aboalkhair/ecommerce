# Full-Stack E-Commerce Platform

Open-source single-store shop built with Next.js and Express. Includes auth, catalog, cart, Stripe checkout, orders, admin analytics, and real-time chat.

## Deployment status

### Live demo (browse-only)

The storefront UI is hosted on Vercel with **static sample catalog data** (no production API/database):

**https://open-source-ecommerce.abdalrahman-aboalkhair.work**

- Home, shop, and product pages work with built-in demo products and categories.
- A **Demo** banner explains that listings are static placeholders because the backend is not deployed for this demo.
- Sign-in, cart, checkout, and admin require a **full local or self-hosted stack** (see below).

### Full stack (local or self-hosted)

There is no maintained hosted API, Postgres, or Redis for this repo. To run auth, cart, payments, and admin:

- **Run locally** using Docker or Node (below).
- **To deploy yourself**, provision API + database + Redis and set environment variables. This repo does not include cloud dashboard setup.

### If you deploy yourself

1. **Frontend** (e.g. Vercel): set `NEXT_PUBLIC_API_URL_PROD`, `NEXT_PUBLIC_API_URL_DEV` (if needed), `NEXT_PUBLIC_SOCKET_URL` — see [src/client/.env.example](src/client/.env.example).
2. **API** (e.g. Render, Railway, Fly): set `DATABASE_URL`, `REDIS_URL`, JWT/session secrets, Stripe, etc. — see [src/server/.env.example](src/server/.env.example).
3. **CORS / cookies**: set `ALLOWED_ORIGINS` on the server to your frontend URL (comma-separated). Required for production; no default production origin is baked into the code.
4. **Postgres + Redis**: use managed services; run `npx prisma migrate deploy` from `src/server`.

Archived walkthrough (may not match current code): [demo video](https://youtu.be/qJDXcQ_sxSI).

Repository: https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform

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

## Browse-only demo catalog

Used on the [live Vercel demo](https://open-source-ecommerce.abdalrahman-aboalkhair.work) and whenever the API is unavailable. The client shows **sample products and categories** on the home page, shop, and product detail views, plus a banner that data is static.

- **Automatic:** when GraphQL calls fail, the client switches to built-in demo data.
- **Forced:** set `NEXT_PUBLIC_USE_DEMO_CATALOG=true` in `src/client/.env.local` (see [src/client/.env.example](src/client/.env.example)).

Cart, sign-in, checkout, and admin still require a running API and database.

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
