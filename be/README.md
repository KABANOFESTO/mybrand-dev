# MyBrand Backend

NestJS backend for the MyBrand portfolio platform.

## What’s Included

- JWT authentication with access, refresh, logout, and me endpoints
- role-based access control for `OWNER`, `VISITOR`, `RECRUITER`, and `ADMIN`
- profile, projects, skills, experiences, education, certificates, and contacts modules
- AI-backed resume generation, skill analysis, code review, and interview simulation
- interview sessions with reusable templates and summary endpoints
- PayPack-based payment integration with webhook verification
- dashboard summary API for admin and owner workflows
- Prisma ORM with PostgreSQL and UUID primary keys
- frontend-friendly API responses and httpOnly cookie handling

## Requirements

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

Then update `.env` with your local values.

## Environment

Core variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `BOOTSTRAP_ADMIN_*`
- `CORS_ORIGIN`

AI variables:

- `GEMINI_API_KEY`
- `AI_PROVIDER`
- `AI_MODEL`
- `AI_API_KEY`
- `AI_BASE_URL`

PayPack variables:

- `PAYPACK_CLIENT_ID`
- `PAYPACK_CLIENT_SECRET`
- `PAYPACK_APP_ID`
- `PAYPACK_BASE_URL`
- `PAYPACK_CHECKOUT_BASE_URL`
- `PAYPACK_CURRENCY`
- `PAYPACK_WEBHOOK_MODE`
- `PAYPACK_WEBHOOK_SECRET`
- `PAYPACK_REQUEST_TIMEOUT_SECONDS`

## Prisma

Useful commands:

```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:migrate:deploy
npm run prisma:studio
```

Prisma scripts are configured for Windows-friendly execution.

## Run

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## Test

```bash
npm run test
npm run test:cov
npm run test:e2e
```

## Auth

### Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Notes

- Access tokens are returned in the JSON response for frontend use.
- Refresh tokens are also stored in httpOnly cookies.
- Role guards are available for admin and owner routes.

## AI

### Endpoints

- `GET /ai/reports/me`
- `GET /ai/reports`
- `GET /ai/reports/:id`
- `POST /ai/resume-draft`
- `POST /ai/skill-analysis`
- `POST /ai/interview-simulation`
- `POST /ai/code-review`

## Interviews

### Endpoints

- `GET /interviews/templates`
- `GET /interviews/summary`
- `POST /interviews/me/sessions`
- `GET /interviews/me/sessions`
- `GET /interviews/me/sessions/:id`
- `PATCH /interviews/me/sessions/:id/answers`
- `POST /interviews/me/sessions/:id/feedback`
- `DELETE /interviews/me/sessions/:id`
- `GET /interviews`
- `GET /interviews/:id`

### Interview Flow

- `GET /interviews/templates` to populate frontend presets.
- `POST /interviews/me/sessions` to create a new session.
- Save answers with `PATCH /interviews/me/sessions/:id/answers`.
- Generate AI-backed feedback with `POST /interviews/me/sessions/:id/feedback`.
- `GET /interviews/summary` for dashboard analytics.

## Payments

### Endpoints

- `POST /payments/checkout`
- `POST /payments/cashin`
- `POST /payments/webhook/paypack`
- `GET /payments/me`
- `GET /payments/me/:id`
- `GET /payments`
- `GET /payments/:id`
- `GET /payments/summary`

### PayPack Flow

1. The frontend calls `POST /payments/checkout` with items and optional email.
2. The backend creates a PayPack checkout session and stores a pending payment record.
3. The frontend redirects the user to the returned `paymentLink`.
4. PayPack calls `POST /payments/webhook/paypack` on the backend.
5. The backend verifies the `x-paypack-signature` header using `PAYPACK_WEBHOOK_SECRET`.
6. The payment status is updated in PostgreSQL and the user gets a notification.

### Cash-in Flow

- `POST /payments/cashin` creates a PayPack mobile money request.
- The backend stores the payment record immediately and tracks webhook confirmation.

## Main Portfolio Modules

### Profiles

- `GET /profiles/public/:userId`
- `GET /profiles/me`
- `PATCH /profiles/me`
- `GET /profiles/summary/:userId`

### Projects

- `GET /projects`
- `GET /projects/featured`
- `GET /projects/:slug`
- `POST /projects`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### Skills

- `GET /skills`
- `GET /skills/categories`
- `POST /skills`
- `PATCH /skills/:id`
- `DELETE /skills/:id`

### Experiences

- `GET /experiences`
- `GET /experiences/:id`
- `POST /experiences`
- `PATCH /experiences/:id`
- `DELETE /experiences/:id`

### Education

- `GET /education`
- `GET /education/:id`
- `POST /education`
- `PATCH /education/:id`
- `DELETE /education/:id`

### Certificates

- `GET /certificates`
- `GET /certificates/:id`
- `POST /certificates`
- `PATCH /certificates/:id`
- `DELETE /certificates/:id`

### Contacts

- `POST /contacts`
- `POST /contacts/me`
- `GET /contacts`
- `GET /contacts/:id`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`

### Dashboard

- `GET /dashboard/summary`

## Notes

- The app serves public uploads from dedicated folders only.
- The PayPack webhook route relies on raw request body capture in `main.ts`.
- Bootstrap admin creation is controlled by environment variables.
