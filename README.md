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

## Included pages

- `/` - yfirlit (heildarfjoldi, staduyfirlit, tharfnast athygli, nyjustu pulsar)
- `/pulsar` - listi af pulsum ur `Puls`
- `/pulsar/nyr` - einfalt form (ekki tengt submit i Airtable enn)
- `/teymi` - listi af teymum ur `Teymi`
- `/solutions/teamrhythm` - lausnasida fyrir TeamRhythm
