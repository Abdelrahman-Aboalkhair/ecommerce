# Maintenance notes

Last updated: 2026 maintenance pass.

## Resolved in this pass

- README states **no live demo**; deploy-yourself checklist added.
- Env-driven CORS via `ALLOWED_ORIGINS` ([src/server/src/config/cors.ts](src/server/src/config/cors.ts)).
- Client API/sockets use env vars ([src/client/app/lib/constants/config.ts](src/client/app/lib/constants/config.ts)); removed hardcoded Render/Vercel/egwinch URLs.
- Docker Compose uses `env_file`, `REDIS_URL`, no hardcoded DB password.
- Root/`src` gitignore; stop tracking `node_modules`, `src/.env`, `src/server/dist`.
- CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, client/server READMEs aligned.
- CI workflow and Dependabot config added.

## If you restore a public demo later

1. Deploy Postgres + Redis (managed).
2. Set server `DATABASE_URL`, `REDIS_URL`, secrets, `ALLOWED_ORIGINS=https://your-frontend.example`.
3. Set client `NEXT_PUBLIC_API_URL_PROD`, `NEXT_PUBLIC_SOCKET_URL` to your API origin.
4. Run `npx prisma migrate deploy` on the server.
5. Do **not** run `npm run seed` on production with default passwords.
6. Update README deployment status only when the demo is actually verified.

## Still optional / follow-up

- Merge Dependabot PRs and address GitHub Security tab alerts.
- Rotate Postgres password if credentials were ever committed to git history.
- Consider `git filter-repo` to purge historical secrets.
- Replace unmaintained middleware (`csurf`, `xss-clean`) over time.
- Add automated tests and CI database service for migrations.

## Manual action for maintainers

If `POSTGRES_PASSWORD` from an old `docker-compose.yml` was ever on a public branch, **rotate that password** on any database that used it.
