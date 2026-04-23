# TeamRhythm

Minimal runnable Next.js app for TeamRhythm.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Local run

```bash
npm install
npm run dev
```

## Included pages

- `/` - forsida / yfirlit
- `/pulsar` - listi af pulsum
- `/pulsar/nyr` - einfalt form fyrir nyjan puls
- `/teymi` - yfirlit yfir teymi
- `/solutions/teamrhythm` - TeamRhythm lausnasida

## Airtable fallback

If `AIRTABLE_BASE_ID` and `AIRTABLE_TOKEN` are not present, the app automatically uses mock data so it still runs locally.

Technical Airtable table names:

- `Teymi`
- `Puls`
