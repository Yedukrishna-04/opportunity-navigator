# Opportunity Navigator

Opportunity Navigator is a full-stack Next.js 16 assignment project for education counselors who help students find financial aid, grants, and emergency support. It avoids a generic CRUD shape by combining case triage, eligibility scoring, counselor workflows, role-based access, and AI-assisted recommendations.

## Assignment Coverage

- Next.js 16 App Router with TypeScript and React components.
- PostgreSQL persistence with parameterized queries.
- Secure authentication with signed HTTP-only JWT cookies.
- Role-based authorization for counselor, reviewer, and admin actions.
- CRUD flows for student cases and aid resources.
- Zod validation and sanitization before database writes.
- AI add-on using OpenAI when `OPENAI_API_KEY` is present, with a deterministic local fallback for development.
- Responsive Tailwind CSS UI with accessible form labels, focus states, and status feedback.
- CI workflow and deployment notes for Vercel or any Node host.

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Apply schema and seed data:

```bash
pnpm db:migrate
pnpm db:seed
```

5. Run the app:

```bash
pnpm dev
```

Seed users:

- `admin@opnav.test` / `Password123!`
- `counselor@opnav.test` / `Password123!`
- `reviewer@opnav.test` / `Password123!`

## Deployment

Create a managed PostgreSQL database, set the variables from `.env.example`, run `pnpm db:migrate`, then deploy to Vercel. The included GitHub Actions workflow runs install, lint, and build checks on every push and pull request.

## Security Notes

- Passwords are stored with bcrypt hashes.
- Session cookies are HTTP-only, same-site, and secure in production.
- All write routes validate input with Zod and use parameterized SQL.
- Authorization is enforced in API routes and server pages.
- AI output is treated as advisory and never writes to records automatically.
