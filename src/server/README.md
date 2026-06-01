# Server (Express + Prisma)

API for the Full-Stack E-Commerce Platform.

**Setup:** see the [root README](../../README.md). There is no maintained public demo.

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

API: http://localhost:5000/api/v1 — Swagger: http://localhost:5000/api-docs

## Production CORS

Set `ALLOWED_ORIGINS` to a comma-separated list of frontend URLs (e.g. `https://your-app.vercel.app`). If unset, only localhost origins are allowed.

See [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) for additional deployment notes.
