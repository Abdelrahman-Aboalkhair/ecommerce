# Full-Stack E-Commerce Platform

Open-source single-store shop built with Next.js and Express. Includes auth, catalog, cart, Stripe checkout, orders, admin analytics, and real-time chat.

IMPORTANT: The hosted deployment may not work right now.

- The production database on the hosting instance is down or misconfigured. API calls that need Postgres will fail until DATABASE_URL and related settings are fixed on the host.
- The API runs on Render free tier (https://full-stack-ecommerce-n5at.onrender.com). Free services spin down when idle, so cold starts and timeouts are normal. The frontend may load while the backend or DB is unavailable.

For a reliable experience, run the app locally (see below).

Links (when services are up):

- Live frontend: https://ss-ecommerce-one.vercel.app
- API base: https://full-stack-ecommerce-n5at.onrender.com/api/v1
- Demo video: https://youtu.be/qJDXcQ_sxSI

## What this is

Single-store e-commerce app: Next.js frontend, Express + Prisma backend, PostgreSQL, Redis, Socket.IO chat, Stripe checkout, admin dashboard.

## Project layout

```
src/
  client/     Next.js frontend
  server/     Express API + Prisma
  docker-compose.yml
```

## Local setup

Prerequisites: Node.js 18+, PostgreSQL, Redis (or use Docker).

1. Clone and go to the repo root.

2. Copy env files:

```
cp src/server/.env.example src/server/.env
cp src/client/.env.example src/client/.env.local
```

3. Edit `src/server/.env` (at minimum DATABASE_URL, JWT secrets, Redis). See `src/server/.env.example` for all variables.

4. Option A - Docker (from `src/`):

```
cd src
docker compose up --build
```

5. Option B - run without Docker:

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

6. Open http://localhost:3000 (frontend) and http://localhost:5000/api/v1 (API). Swagger: http://localhost:5000/api-docs

## Test accounts (after seeding)

Run `npm run seed` in `src/server` first.

| Role       | Email                    | Password      |
|------------|--------------------------|---------------|
| Superadmin | superadmin@example.com | password123   |
| Admin      | admin@example.com      | password123   |
| User       | user@example.com       | password123   |

## Stack

Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Socket.IO, Stripe, Cloudinary.

Frontend: Next.js, TypeScript, Tailwind, Redux Toolkit.

## Deployment notes

- Frontend: Vercel (see live link above).
- API: Render free tier. Keep DATABASE_URL and Redis env vars set in the Render dashboard; verify the Postgres instance is running and reachable from the web service.
- If the hosted site loads but login or data fails, check Render logs and database status before debugging application code.

## More docs

- `CONTRIBUTING.md` - how to contribute
- `src/server/README.md` - server details
- `src/client/README.md` - client details

## License

MIT. See LICENSE.
