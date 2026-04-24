# Forge

Forge is a production-minded single-user fitness web app for a structured 9-week fat-loss and conditioning programme. V1 includes a 3-week build-up phase, a 6-week main course, account-based progress tracking, readiness checks, workout preview and active timer flows.

## Tech stack

- Next.js App Router, TypeScript and React
- Tailwind CSS with shadcn-style local UI primitives
- PostgreSQL with Prisma ORM
- Secure email/password auth with hashed passwords and signed HTTP-only session cookies
- Zod validation
- Recharts for progress charts
- Railway-ready build/start scripts

## Product structure

Core logic is kept out of React pages:

- `/lib/programme` programme day, phase and circuit logic
- `/lib/workout-engine` interval sequencing, duration and training load logic
- `/lib/progress` completion, streak, effort and chart calculations
- `/lib/readiness` rule-based readiness recommendations
- `/lib/auth` authentication and session handling
- `/lib/db` Prisma access
- `/components` UI, workout, programme, progress and layout components
- `/prisma` schema, migrations and seed data

## Local setup

1. Clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add a local PostgreSQL `DATABASE_URL`.
5. Set `AUTH_SECRET` to a strong random value.
6. Run `npx prisma migrate dev`.
7. Run `npm run prisma:seed`.
8. Run `npm run dev`.

## Environment variables

```bash
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NODE_ENV=
```

`AUTH_SECRET` is used by Forge's custom credentials auth. `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are included so the project can move to Auth.js later without reworking deployment conventions.

## Database setup

Forge uses PostgreSQL as the source of truth for user accounts, programme progress, body metrics, readiness checks, weekly reflections and workout completions. Local state is used only for the active workout timer.

## Prisma migration workflow

- Local development: `npm run prisma:migrate`
- Production/staging: `npm run prisma:deploy`
- Generate client: `npm run prisma:generate`

Commit migration files to GitHub. Do not use `prisma migrate dev` in production.

## Seed data

Run `npm run prisma:seed` to create the Forge 9-Week Fat-Loss System with 9 weeks and 63 daily workouts.

## GitHub workflow

1. Create a GitHub repository.
2. Commit the V1 codebase.
3. Push to GitHub.
4. Use `main` as the production branch.
5. Use feature branches for variations.
6. Merge tested changes into `main`.
7. Railway deploys from `main`.

## Railway deployment workflow

1. Create a Railway project.
2. Connect the GitHub repository.
3. Add a Railway PostgreSQL database.
4. Set `DATABASE_URL`, `AUTH_SECRET`, and the production `NEXTAUTH_URL` if later using Auth.js.
5. Deploy from `main`.
6. Run production migrations with `npx prisma migrate deploy`.
7. Seed the database if needed with `npm run prisma:seed`.

Railway should run `npm install`, `npm run build`, and `npm run start`. The build script runs `prisma generate` before `next build`.

## Future deployment updates

1. Make changes locally or in Codex.
2. Commit changes.
3. Push to GitHub.
4. Merge into `main`.
5. Railway automatically deploys.
6. If the schema changed, run `npx prisma migrate deploy`.
7. Keep migration files committed.

## V1 feature list

- Signup and login
- Protected authenticated routes
- Today dashboard
- 9-week programme timeline
- Week detail pages
- Readiness check
- Workout preview
- Active workout timer
- Circuit progression rules
- Workout completion logging
- Effort scoring and training load
- Progress dashboard
- Weekly charts
- Body metrics
- Weekly reflections
- Settings, reset programme data, logout and delete account

## Privacy and stored data

Forge stores only the data needed for the programme: name, email, password hash, programme start date, units, workout completions, readiness checks, body metrics, weekly reflections, consent timestamps and future data export request records. Password hashes are never exposed. User-owned records are associated with `User` and are deleted by cascade when an account is deleted. Avoid logging sensitive user data.

## Future App Store readiness notes

V1 is a Railway-hosted web app. GitHub is the source of truth, and every committed version can be reviewed, deployed, rolled back or branched. The app is structured so future versions can support PWA, mobile wrapper or native iOS development without a complete rebuild. Core workout, programme, readiness and progress logic is in reusable TypeScript modules. UI components are separated from business logic. Database models are user-based and suitable for future account deletion, data export, consent tracking, subscriptions and App Store compliance.

## Roadmap summary for V2-V5

### V1 - Single-user 9-week web app

- 3-week build-up phase
- 6-week main course
- 63-day programme
- Today screen
- Programme timeline
- Week detail pages
- Workout preview
- Active workout timer
- Circuit progression
- Readiness check
- Completion logging
- Effort scoring
- Progress dashboard
- Body metrics
- Weekly reflections
- GitHub source control
- Railway deployment from GitHub
- PostgreSQL database

### V2 - Personalisation and adherence

- Missed-day recovery logic
- Automatic rescheduling of missed workouts
- Programme pause and resume
- More intelligent workout substitutions
- Time-based session options: 8, 15, 20 and 30 minutes
- Email reminders
- Web notifications
- Progress photo upload
- Calendar view
- Downloadable weekly summary
- Expanded exercise library
- Exercise demonstration videos or animations

### V3 - Nutrition, benchmarks and deeper progress

- Simple nutrition guidance
- Protein and calorie targets
- Meal templates
- Shopping list generation
- Weekly weigh-in and waist-tracking prompts
- Benchmark workouts
- Before/after comparisons
- Resting heart rate trend tracking
- Plateau detection
- Exportable progress report
- More detailed training-load model
- Build-up phase report
- Main course midpoint report
- Final transformation report

### V4 - AI version

- AI coach interface
- AI-generated weekly review
- AI-generated daily workout adjustment
- AI explanations for session changes
- AI substitutions based on soreness, sleep, equipment, time, travel, injuries or limitations
- AI-generated motivational check-ins
- AI nutrition suggestions
- AI interpretation of progress trends
- AI plateau analysis
- AI "what to do today" assistant
- AI-generated recovery recommendations
- AI-generated final programme report
- Natural-language workout logging
- AI support for a follow-on programme after Week 9

AI should not replace the programme. It should adapt, explain and support the programme.

### V5 - Commercial product

- Stripe billing or App Store-compliant subscriptions depending on platform
- Free trial
- Multiple programme templates
- Multi-user accounts
- Coach accounts
- Admin dashboard
- Corporate cohort mode
- School, club or organisation white-labelling
- Referral system
- Analytics dashboard
- Retention and churn tracking
- Apple Health integration
- Google Fit integration
- Wearables integration
- Native iOS and Android apps
- Programme marketplace
- Content management system for workouts
- Video hosting and premium content
- In-app messaging
- Data export
- Privacy and consent management
- Terms, policies and commercial compliance

## V1 exclusions

V1 intentionally excludes payments, subscriptions, AI coach features, native iOS code, Apple Health, Google Fit, wearables, trainer marketplaces, social feeds, multi-user coaching dashboards, complex nutrition planning and complex media upload.
