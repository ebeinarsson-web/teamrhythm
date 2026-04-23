import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:space-y-12 sm:py-12">
      <section className="rounded-2xl border border-slate-200/80 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">TEAMRHYTHM</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Regluleg stöðutaka sem skýrir stöðu, hindranir og næstu skref
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          TeamRhythm hjálpar teymum að halda reglulega stöðutöku í einni skýrri mynd, svo staða, hindranir og næstu
          skref verði sýnilegri.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <Link
          href="/pulsar"
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
        >
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Púlsar</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sjá nýjustu púlsa og fá skýra mynd af stöðu teymanna.
          </p>
        </Link>
        <Link
          href="/pulsar/nyr"
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
        >
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Nýr púls</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Skráðu nýja stöðutöku fyrir teymi á einfaldan og samræmdan hátt.
          </p>
        </Link>
        <Link
          href="/teymi"
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
        >
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Teymi</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sjá yfirlit yfir teymi og nýjustu stöðutökur þeirra.
          </p>
        </Link>
        <Link
          href="/solutions/teamrhythm"
          className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors hover:bg-slate-50"
        >
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Lausnin</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Kynntu þér TeamRhythm og hvernig lausnin styður reglulega stöðutöku.
          </p>
        </Link>
      </section>
    </main>
  );
}
