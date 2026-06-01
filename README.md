# Full-Stack E-Commerce Platform

Open-source single-store shop built with Next.js and Express. Includes auth, catalog, cart, Stripe checkout, orders, admin analytics, and real-time chat.

## Deployment status

**There is no maintained live demo.** Previous Vercel/Render URLs are not kept online by the maintainer and should be treated as down.

- Do not expect a public frontend, API, database, or Redis to work out of the box.
- **Run locally** (below) for a working copy.
- **To deploy yourself**, you must provision hosting and set environment variables. This repo does not include cloud dashboard setup.

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

1. Clone and go to the repo root.

2. Copy env files:

```
cp src/server/.env.example src/server/.env
cp src/client/.env.example src/client/.env.local
```

3. Edit `src/server/.env` (at minimum `DATABASE_URL`, JWT secrets, `REDIS_URL`). See [src/server/.env.example](src/server/.env.example).

4. **Option A — Docker** (from `src/`):

```
cp .env.example .env
# Edit .env with POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
cd src
docker compose up --build
```

5. **Option B — without Docker:**

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

Run `npm run seed` in `src/server` first. Use only in local development.

| Role       | Email                    | Password      |
|------------|--------------------------|---------------|
| Superadmin | superadmin@example.com | password123   |
| Admin      | admin@example.com      | password123   |
| User       | user@example.com       | password123   |

## Stack

Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Socket.IO, Stripe, Cloudinary.

Frontend: Next.js, TypeScript, Tailwind, Redux Toolkit.

## More docs

- [MAINTENANCE.md](MAINTENANCE.md) — maintenance notes and audit history
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to contribute
- [src/server/README.md](src/server/README.md) — server details
- [src/client/README.md](src/client/README.md) — client details

## License

MIT. See LICENSE.
