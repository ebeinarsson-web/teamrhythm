# TeamRhythm

TeamRhythm is a simple Next.js app for regular team check-ins.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Local run

```bash
npm install
npm run dev
```

## Airtable env

Copy `.env.example` to `.env.local` and fill in values:

```bash
AIRTABLE_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_airtable_base_id
```

## Read-only integration and fallback

- The app reads Airtable server-side only (App Router server components + `lib/airtable.ts`).
- Technical Airtable table names used in code:
  - `Teymi`
  - `Puls`
- If `AIRTABLE_TOKEN` or `AIRTABLE_BASE_ID` is missing, mock data is used automatically.
- If Airtable read fails, the app falls back to mock data and continues to run.

## New pulse create flow (`/pulsar/nyr`)

- Form submit is sent to server endpoint `POST /api/pulsar` (never directly to Airtable from client).
- Server validates required fields:
  - `Teymi`
  - `Fundardagur`
  - `Staða` (`Græn`, `Gul`, `Rauð`)
- On success, a new record is created in Airtable table `Puls` with linked record in `Teymi`.
- If Airtable env is missing, submit is not performed and user gets a calm message that submission is unavailable in that run.
- If Airtable create fails, user gets a general error message and detailed error is logged server-side.

## Included pages

- `/` - yfirlit (heildarfjoldi, staduyfirlit, tharfnast athygli, nyjustu pulsar)
- `/pulsar` - listi af pulsum ur `Puls`
- `/pulsar/nyr` - einfalt form (ekki tengt submit i Airtable enn)
- `/teymi` - listi af teymum ur `Teymi`
- `/solutions/teamrhythm` - lausnasida fyrir TeamRhythm
