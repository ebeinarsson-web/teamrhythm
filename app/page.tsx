import Link from "next/link";
import { getOverviewData } from "@/lib/airtable";
import { formatDateIs } from "@/lib/date-format";

const statusLabel: Record<"green" | "yellow" | "red", string> = {
  green: "Græn",
  yellow: "Gul",
  red: "Rauð",
};

const statusToneClass: Record<"green" | "yellow" | "red", string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
};

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

      <section className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Þarfnast athygli</h2>
          <div className="mt-3 space-y-3">
            {topAttention.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Engir púlsar í gulri eða rauðri stöðu núna.
              </p>
            ) : (
              topAttention.map((pulse) => (
                <div key={pulse.id} className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">{pulse.title}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusToneClass[pulse.status]}`}
                    >
                      {statusLabel[pulse.status]}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                    {pulse.teamName} - {formatDateIs(pulse.meetingDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Nýjustu púlsar</h2>
          <div className="mt-3 space-y-3">
            {latestPulses.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">Engar púlsfærslur fundust.</p>
            ) : (
              latestPulses.map((pulse) => (
                <div key={pulse.id} className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">{pulse.title}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusToneClass[pulse.status]}`}
                    >
                      {statusLabel[pulse.status]}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                    {pulse.teamName} - {formatDateIs(pulse.meetingDate)}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
