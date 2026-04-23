import Link from "next/link";
import { getOverviewData } from "@/lib/airtable";

const statusLabel: Record<"green" | "yellow" | "red", string> = {
  green: "Graen",
  yellow: "Gul",
  red: "Raud",
};

export default async function HomePage() {
  const { pulses, attentionPulses, statusCounts, totalPulses } = await getOverviewData();
  const latestPulses = pulses.slice(0, 5);
  const topAttention = attentionPulses.slice(0, 5);

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

      <section className="grid gap-4 sm:grid-cols-4 sm:gap-5">
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Heildarpulsar</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{totalPulses}</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Graen</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{statusCounts.green}</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Gul</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{statusCounts.yellow}</p>
        </article>
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Raud</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{statusCounts.red}</p>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Tharfnast athygli</h2>
          <div className="mt-3 space-y-3">
            {topAttention.length === 0 ? (
              <p className="text-sm text-slate-600">Engir pulsar i gulri eða raudri stodu nuna.</p>
            ) : (
              topAttention.map((pulse) => (
                <div key={pulse.id} className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2">
                  <p className="text-sm font-medium text-slate-900">{pulse.title}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {pulse.teamName} - {pulse.meetingDate} - {statusLabel[pulse.status]}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Nyjustu pulsar</h2>
          <div className="mt-3 space-y-3">
            {latestPulses.length === 0 ? (
              <p className="text-sm text-slate-600">Engar pulsfaerslur fundust.</p>
            ) : (
              latestPulses.map((pulse) => (
                <div key={pulse.id} className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2">
                  <p className="text-sm font-medium text-slate-900">{pulse.title}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {pulse.teamName} - {pulse.meetingDate} - {statusLabel[pulse.status]}
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
