<div align="center">

# Full-Stack Learning Management System

**A production-shaped LMS: instructors publish paid video courses, learners buy them through Stripe, and progress is tracked lesson-by-lesson.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout%20%2B%20Webhooks-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](https://YOUR-DEPLOYMENT-URL.vercel.app) · [Report a Bug](https://github.com/vamsi80/LMS/issues) · [Architecture](#architecture)

</div>

---

> **Replace the placeholders before you share this.** The demo link, the screenshots and the GIF below are the three things a reviewer looks at first. A README that promises a demo and doesn't have one reads worse than no README at all.

<div align="center">
  <img src="docs/demo.gif" alt="Course creation, checkout and lesson playback" width="800" />
</div>

---

## Table of Contents

- [What this is](#what-this-is)
- [Features](#features)
- [Architecture](#architecture)
- [Data model](#data-model)
- [Key flows](#key-flows)
- [Tech stack](#tech-stack)
- [Running it locally](#running-it-locally)
- [Project structure](#project-structure)
- [Engineering decisions](#engineering-decisions)
- [Known limitations & roadmap](#known-limitations--roadmap)
- [License](#license)

---

## What this is

Skillsome is a multi-tenant course platform built on the Next.js App Router. It covers the full commercial loop rather than just CRUD:

1. An **admin** authors a course — chapters and lessons, drag-and-drop reordering, rich-text descriptions, video and thumbnail uploads.
2. A **learner** browses the catalogue, pays through Stripe Checkout, and is enrolled by a signed webhook rather than by a client-side redirect.
3. The learner works through lessons; per-lesson completion drives a live progress bar, and the admin dashboard aggregates enrolments and revenue over time.

Everything that touches money, files or identity runs on the server: React Server Components read directly from Postgres through Prisma, mutations are Server Actions, and the only public API routes are the ones that genuinely need to be — S3 presigning, the Stripe webhook, and the auth handler.

## Features

### For learners
- **Passwordless email OTP and GitHub OAuth** sign-in via Better Auth.
- **Course catalogue** with level, category, duration and price, rendered from server components.
- **Stripe Checkout** with idempotent enrolment — a duplicate purchase attempt reuses the pending enrolment record instead of creating a second one.
- **Lesson player** with a persistent course sidebar, per-lesson completion toggles, and an optimistic progress bar.
- **Course completion confetti** and a personal dashboard split between in-progress and completed courses.

### For instructors / admins
- **Course builder** with nested chapters and lessons, reordered by drag-and-drop (`@dnd-kit`) and persisted as integer positions.
- **TipTap rich-text editor** for descriptions, stored as HTML and rendered through a sanitised parser.
- **Direct-to-S3 uploads** using presigned PUT URLs, so video files never pass through the Next.js server.
- **Analytics dashboard** — 30-day enrolment chart (Recharts), signup/course/lesson totals, recent course list.
- **Draft / Published / Archived** course states, plus a guarded delete flow.

### Platform
- **Arcjet** shield, bot detection and rate limiting wired into auth and the upload routes.
- **Zod + `@t3-oss/env-nextjs`** validates every environment variable at boot, so a missing key fails the build instead of a request at 2am.
- **Role-gated routing** — `require-admin.ts` and `require-user.ts` are the single choke points for authorisation, called from every server action and data loader.
- **Type-safe forms** end to end: one Zod schema per entity, shared by `react-hook-form` on the client and the server action on the server.

## Architecture

```
                    ┌──────────────────────────────────────────┐
   Browser ────────▶│  Next.js 15 App Router (RSC + Actions)   │
                    │                                          │
                    │  (main)      public catalogue            │
                    │  (auth)      sign-in / verify            │
                    │  admin/      course authoring + stats    │
                    │  dashboard/  enrolled learning surface   │
                    └───────┬─────────────┬────────────┬───────┘
                            │             │            │
                    Prisma  │       presigned PUT      │ Checkout session
                            ▼             ▼            ▼
                    ┌───────────┐   ┌───────────┐  ┌──────────┐
                    │ Postgres  │   │ S3 store  │  │  Stripe  │
                    │  (Neon)   │   │ (Tigris)  │  │          │
                    └───────────┘   └───────────┘  └────┬─────┘
                            ▲                            │
                            └──── signed webhook ────────┘
                              /api/webhook/stripe
```

Three rules the codebase holds to:

- **Data access lives in `src/app/data/`, never in components.** Loaders are split by audience (`admin/`, `course/`, `user/`) and each one calls its own auth guard first. A component cannot accidentally read a course it isn't allowed to see.
- **Mutations are colocated Server Actions** (`actions.ts` next to the route that uses them), all returning a shared `ApiResponse` shape so the client toast handling is uniform.
- **Nothing trusts the client for authorisation or price.** Course price is read from the database when the Checkout session is created; enrolment is only activated by the webhook.

## Data model

```mermaid
erDiagram
    User ||--o{ Course : authors
    User ||--o{ Enrollment : has
    User ||--o{ LessonProgress : tracks
    User ||--o{ Session : owns
    User ||--o{ Account : links
    Course ||--o{ Chapter : contains
    Course ||--o{ Enrollment : sold_through
    Chapter ||--o{ Lesson : contains
    Lesson ||--o{ LessonProgress : measured_by

    User {
        string id PK
        string email UK
        string role
        string stripeCustomerId UK
        boolean banned
    }
    Course {
        string id PK
        string slug UK
        string stripePriceId UK
        int price
        int duration
        enum level
        enum status
    }
    Chapter {
        string id PK
        int position
    }
    Lesson {
        string id PK
        string videoKey
        string thumbnailKey
        int position
    }
    Enrollment {
        string id PK
        int amount
        enum status
    }
    LessonProgress {
        string id PK
        boolean completed
    }
```

Two constraints carry most of the correctness:

- `@@unique([userId, courseId])` on `Enrollment` — one enrolment per user per course, enforced by the database rather than by application logic.
- `@@unique([userId, lessonId])` on `LessonProgress` — makes the completion toggle a safe `upsert`, so a double-click can't create duplicate progress rows.

## Key flows

**Purchase → enrolment (the part that has to be right)**

```mermaid
sequenceDiagram
    participant U as Learner
    participant A as Server Action
    participant DB as Postgres
    participant S as Stripe
    participant W as /api/webhook/stripe

    U->>A: Enroll
    A->>DB: find or create Enrollment (status: Pending)
    A->>S: create Checkout Session (price from DB, enrollmentId in metadata)
    A-->>U: redirect to Stripe
    U->>S: pays
    S->>W: checkout.session.completed (signed)
    W->>W: verify signature with STRIPE_WEBHOOK_SECRET
    W->>DB: Enrollment.status = Active
    U->>U: /payment/success
```

The learner's browser never sets the enrolment to active. If they close the tab mid-redirect, the webhook still lands and the enrolment completes.

**Video upload**

The client asks `/api/s3/upload` for a presigned PUT URL, uploads straight to object storage with progress tracking, and stores only the resulting key in Postgres. Deletes go through `/api/s3/delete` so the storage credentials stay server-side. This keeps large files off the serverless function entirely.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, Turbopack) | Server Components remove a whole API layer for read paths |
| Language | TypeScript 5 | — |
| UI | Tailwind CSS 4, shadcn/ui, Radix primitives | Accessible primitives without a component-library lock-in |
| Auth | Better Auth (email OTP + GitHub OAuth) | Sessions in the same Postgres instance; no third-party identity bill |
| Database | PostgreSQL (Neon) + Prisma 6 | Migrations in version control; relation-aware queries |
| Payments | Stripe Checkout + webhooks | Hosted checkout means no card data touches this app |
| Storage | S3-compatible (Tigris) via AWS SDK v3 | Presigned URLs, no proxying of large uploads |
| Email | Resend + React Email | Templated OTP mail |
| Security | Arcjet (shield, bot detection, rate limits) | Edge-level abuse protection on auth and upload routes |
| Editor | TipTap 3 | HTML output that renders cleanly server-side |
| Charts | Recharts | Enrolment trends on the admin dashboard |
| Validation | Zod 4 | One schema shared by client form and server action |

## Running it locally

**Prerequisites:** Node 20+, pnpm 10+, a PostgreSQL database, and accounts for Stripe, Resend, Arcjet and any S3-compatible store.

```bash
git clone https://github.com/vamsi80/LMS.git
cd LMS
pnpm install          # runs `prisma generate` via postinstall
cp .env.example .env  # then fill in the values below
pnpm prisma migrate dev
pnpm dev
```

Open http://localhost:3000.

### Environment variables

Every variable below is validated by `src/lib/env.ts` at build time. A missing or malformed value fails fast rather than at runtime.

```dotenv
# Database
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# Auth
BETTER_AUTH_SECRET=""          # openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000"
AUTH_GITHUB_CLIENT_ID=""
AUTH_GITHUB_SECRET=""

# Email (OTP delivery)
RESEND_API_KEY=""

# Abuse protection
ARCJET_KEY=""

# Object storage (S3-compatible)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_ENDPOINT_URL_S3=""
AWS_ENDPOINT_URL_IAM=""
AWS_REGION="auto"
NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES=""

# Payments
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### Stripe webhooks in development

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Copy the printed `whsec_…` value into `STRIPE_WEBHOOK_SECRET`. Without this, purchases complete in Stripe but enrolments stay `Pending`.

### Granting yourself admin

There is no self-serve admin signup by design. After your first sign-in:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'you@example.com';
```

## Project structure

```
src/
├── app/
│   ├── (auth)/            # sign-in, OTP verification — isolated layout
│   ├── (main)/            # public marketing site + course catalogue
│   ├── admin/             # course authoring, nested [courseId]/[chapterId]/[lessonId]
│   ├── dashboard/         # enrolled learner surface + lesson player
│   ├── api/
│   │   ├── auth/[...all]/ # Better Auth handler
│   │   ├── s3/            # presigned upload + delete
│   │   └── webhook/stripe # enrolment activation
│   └── data/              # ── all DB reads live here ──
│       ├── admin/         #    each loader calls requireAdmin()
│       ├── course/
│       └── user/          #    each loader calls requireUser()
├── components/
│   ├── ui/                # shadcn primitives
│   ├── file-uploader/     # dropzone + presigned PUT + progress
│   ├── rich-text-editor/  # TipTap editor and renderer
│   └── sidebar/           # dashboard chrome
├── hooks/                 # progress, signout, confetti, tryCatch
└── lib/                   # auth, db, stripe, s3, arcjet, env, zodSchemas
prisma/
├── schema.prisma
└── migrations/
```

Colocation is deliberate: `_components/` and `actions.ts` sit inside the route that owns them, so deleting a feature means deleting one folder.

## Engineering decisions

**Server Actions over API routes.** Read paths are Server Components hitting Prisma directly; write paths are Server Actions. Only three things need a real HTTP endpoint — the auth handler, S3 presigning, and the Stripe webhook — and those are the only three that exist.

**A `tryCatch` wrapper instead of scattered try/catch.** `hooks/try-catch.ts` returns a discriminated union so client code handles success and failure through the same branch, and every action returns the same `ApiResponse` shape to the toast layer.

**Integer positions for ordering.** Chapters and lessons carry an explicit `position`, rewritten in a transaction after a drag. Simpler to reason about than fractional indexing at this scale, and trivially migratable if it ever needs to change.

**Progress as a unique composite key.** `(userId, lessonId)` uniqueness turns "mark complete" into an `upsert` — no read-then-write race.

## Known limitations & roadmap

Being straight about what isn't done yet:

- [ ] **No automated tests.** The highest-value next step: Vitest around the Zod schemas and the progress calculation, Playwright over the purchase → enrolment path.
- [ ] **No CI pipeline.** A GitHub Actions workflow running `tsc --noEmit`, ESLint and the test suite on every PR.
- [ ] **Arcjet shield runs in `DRY_RUN`.** Rules are wired but not enforcing; needs `LIVE` mode plus tuned rate limits before real traffic.
- [ ] **Video delivery is direct-from-storage.** No signed playback URLs or HLS transcoding, so a determined user can share a video link. Next: short-lived signed GETs gated on enrolment.
- [ ] **Webhook is not replay-safe across event types.** Handles `checkout.session.completed`; should persist processed event IDs for idempotency.
- [ ] **No refunds or cancellation flow.** `EnrollmentStatus.Cancelled` exists in the schema but nothing writes it.
- [ ] **Course search and pagination.** The catalogue loads all published courses in one query.

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

Built by [**vamsi80**](https://github.com/vamsi80) · [LinkedIn](https://linkedin.com/in/vamsikrishna-m/) · [Portfolio](https://portfolio-eta-tan-14.vercel.app/)

</div>
