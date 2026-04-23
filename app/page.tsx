import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">TEAMRHYTHM</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Regluleg stöðutaka sem skýrir stöðu, hindranir og næstu skref
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          TeamRhythm er einfalt vefapp fyrir reglulega stöðutöku teymis. Þetta er minimal keyranleg grunnútgáfa með
          mock fallback fyrir Airtable.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/pulsar" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <h2 className="text-lg font-medium">Púlsar</h2>
          <p className="mt-2 text-sm text-slate-600">Sjá nýjustu púlsa eftir teymum.</p>
        </Link>
        <Link href="/pulsar/nyr" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <h2 className="text-lg font-medium">Nýr púls</h2>
          <p className="mt-2 text-sm text-slate-600">Skráðu nýja stöðutöku fyrir teymi.</p>
        </Link>
        <Link href="/teymi" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <h2 className="text-lg font-medium">Teymi</h2>
          <p className="mt-2 text-sm text-slate-600">Yfirlit yfir teymi og ábyrgðaraðila.</p>
        </Link>
        <Link href="/solutions/teamrhythm" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <h2 className="text-lg font-medium">Lausnasíða TeamRhythm</h2>
          <p className="mt-2 text-sm text-slate-600">Sérstök kynningarsíða fyrir lausnina.</p>
        </Link>
      </section>
    </main>
  );
}
