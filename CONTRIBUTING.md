# Contributing

Thank you for contributing to the Full-Stack E-Commerce Platform. There is **no maintained live demo**; develop and test locally or on your own deployment.

## Code of Conduct

Participation is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL 14+ and Redis (or Docker)
- Git

## Setup

1. Clone:

   ```bash
   git clone https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform.git
   cd Full-Stack-E-Commerce-Platform
   ```

2. Environment files:

   ```bash
   cp src/server/.env.example src/server/.env
   cp src/client/.env.example src/client/.env.local
   ```

   Edit `src/server/.env` with `DATABASE_URL`, `REDIS_URL`, JWT/session secrets, and other values from the example file.

3. Backend:

   ```bash
   cd src/server
   npm install
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```

4. Frontend (new terminal):

   ```bash
   cd src/client
   npm install
   npm run dev
   ```

5. Open http://localhost:3000 (API at http://localhost:5000/api/v1).

### Docker

From `src/`:

```bash
cp .env.example .env
# Edit POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
docker compose up --build
```

See [README.md](README.md) for details.

## Pull requests

1. Branch from `main`: `feature/...`, `fix/...`, or `docs/...`
2. Keep changes focused.
3. Run `npm run build` in `src/server` and `src/client` before opening a PR.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) (enforced by commitlint on the root package).

## Production / CORS

If you deploy your own instance, set `ALLOWED_ORIGINS` on the server to your frontend URL(s). Set client `NEXT_PUBLIC_API_URL_PROD` and `NEXT_PUBLIC_SOCKET_URL` to match your API host.

## Issues

- [Open issues](https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform/issues)
- Security: see [SECURITY.md](SECURITY.md) (no public issues for vulnerabilities)

## Questions

Open a GitHub issue or discussion on the repository.
