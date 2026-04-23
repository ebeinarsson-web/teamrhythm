import Link from "next/link";
import { getOverviewData } from "@/lib/airtable";
import HomePulseSections from "@/components/HomePulseSections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { pulses, attentionPulses, statusCounts, totalPulses } = await getOverviewData();
  const latestPulses = pulses.slice(0, 5);
  const topAttention = attentionPulses.slice(0, 5);

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:space-y-10 sm:py-8">
      <section className="rounded-2xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-9">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">TEAMRHYTHM</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Regluleg stöðutaka sem skýrir stöðu, hindranir og næstu skref
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">
          TeamRhythm hjálpar teymum að halda reglulega stöðutöku í einni skýrri mynd, svo staða, hindranir og næstu
          skref verði sýnilegri.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 sm:gap-5">
        <Link
          href="/pulsar"
          className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 sm:p-5"
        >
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Púlsar</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sjá nýjustu púlsa og fá skýra mynd af stöðu teymanna.
          </p>
        </Link>
        <Link
          href="/pulsar/nyr"
          className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 sm:p-5"
        >
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Nýr púls</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Skráðu nýja stöðutöku fyrir teymi á einfaldan og samræmdan hátt.
          </p>
        </Link>
        <Link
          href="/teymi"
          className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 sm:p-5"
        >
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Teymi</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sjá yfirlit yfir teymi og nýjustu stöðutökur þeirra.
          </p>
        </Link>
        <Link
          href="/solutions/teamrhythm"
          className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 sm:p-5"
        >
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Lausnin</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Kynntu þér TeamRhythm og hvernig lausnin styður reglulega stöðutöku.
          </p>
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Heildarpúlsar</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{totalPulses}</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Græn</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{statusCounts.green}</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Gul</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{statusCounts.yellow}</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Rauð</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{statusCounts.red}</p>
        </article>
      </section>

      <HomePulseSections topAttention={topAttention} latestPulses={latestPulses} />
    </main>
  );
}
