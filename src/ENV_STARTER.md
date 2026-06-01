# Environment starter (fresh clone)

Copy is already done if you have these files:

| File | Purpose |
|------|---------|
| `src/.env` | Postgres credentials for Docker `db` service |
| `src/server/.env` | API secrets and service URLs |
| `src/client/.env.local` | Next.js public URLs |

**Important:** `POSTGRES_PASSWORD` in `src/.env` must match the password in `src/server/.env` `DATABASE_URL` when using Docker (user `ecommerce`).

## Docker (recommended)

If you changed `src/.env` Postgres credentials after an earlier run, reset the database volume first (otherwise you get Prisma `P1000` auth errors):

```bash
cd src
docker compose down -v
docker compose up --build
```

Otherwise:

```bash
cd src
docker compose up --build
```

In another terminal, initialize the database:

```bash
cd src
docker compose exec server npx prisma migrate deploy
docker compose exec server npm run seed
```

Open http://localhost:3000 — API http://localhost:5000/api-docs

If the server container exits immediately, run:

```bash
docker compose logs server
```

## Without Docker

1. Install and start PostgreSQL and Redis locally.
2. In `src/server/.env`, set `DATABASE_URL` and `REDIS_URL` to your local instances.
3. `cd src/server && npm install && npx prisma migrate dev && npm run seed && npm run dev`
4. `cd src/client && npm install && npm run dev`

## Test login (after seed)

- `user@example.com` / `password123`
- `admin@example.com` / `password123`
- `superadmin@example.com` / `password123`

## What still needs real keys later

- **Stripe** — checkout
- **Cloudinary** — product images
- **Google / Facebook / Twitter** — social sign-in
- **SMTP** — email / password reset

The server should start with placeholders; those features fail until you add real credentials.
