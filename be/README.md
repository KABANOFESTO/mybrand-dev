# MyBrand Backend

Production-ready NestJS backend for the MyBrand portfolio platform.

## Overview

This service provides:

- JWT authentication with access and refresh tokens
- role-based access control for `OWNER`, `VISITOR`, `RECRUITER`, and `ADMIN`
- Prisma ORM with PostgreSQL
- bootstrap admin creation on startup
- frontend-friendly API responses and httpOnly cookie handling

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm 10+

## Setup

```bash
npm install
```

Create your environment file from the example:

```bash
copy .env.example .env
```

Then update `.env` with your local database and auth values.

## Prisma

The project uses UUIDs for all primary keys and relations.

Useful commands:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:studio
```

The Prisma npm scripts use a local temp directory to behave more reliably on Windows.

## Run

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

## Test

```bash
npm run test
npm run test:cov
npm run test:e2e
```

## Auth Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## API Response Shape

Auth endpoints return a frontend-ready response with:

- `message`
- `data`
- access token
- user profile data

Refresh tokens are stored in httpOnly cookies for safer browser sessions.

## Notes

- Prisma client is generated after install and after schema changes.
- Bootstrap admin creation is controlled by environment variables.
- The backend is ready to be integrated with the frontend portfolio app.
