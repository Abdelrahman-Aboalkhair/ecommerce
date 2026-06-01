# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x on `main` | Yes |
| Older / unmaintained forks | No |

## Reporting a Vulnerability

Please do **not** open a public issue for security problems.

1. Use [GitHub Security Advisories](https://github.com/Abdelrahman-Aboalkhair/Full-Stack-E-Commerce-Platform/security/advisories/new) on this repository, or
2. Email **abdalrahman.aboalkhair.1@gmail.com** with a description and steps to reproduce.

You can expect an initial response within a reasonable timeframe. Accepted issues may be fixed on `main` and noted in release notes when applicable.

## Secrets and deployments

- Never commit `.env` files or database passwords.
- Rotate credentials immediately if they were ever pushed to a public branch.
- This project does not ship a maintained public demo; deploy with your own secrets and `ALLOWED_ORIGINS`.
