import Link from "next/link";
import { getPulses, getTeams } from "@/lib/airtable";
import { formatDateIs } from "@/lib/date-format";
import { getPulseDisplayTitle } from "@/lib/pulse-display";

export const dynamic = "force-dynamic";

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

export default async function TeymiPage() {
  const [teams, pulses] = await Promise.all([getTeams(), getPulses()]);
  const pulseCountByTeam = new Map<string, number>();
  const latestPulseByTeam = new Map<string, (typeof pulses)[number]>();

  for (const pulse of pulses) {
    pulseCountByTeam.set(pulse.teamId, (pulseCountByTeam.get(pulse.teamId) ?? 0) + 1);
    if (!latestPulseByTeam.has(pulse.teamId)) {
      latestPulseByTeam.set(pulse.teamId, pulse);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Teymi</h1>
      <p className="mt-2 text-sm text-slate-600">Yfirlit yfir teymi og stöðu þeirra.</p>

      <div className="mt-6 grid gap-4">
        {teams.length === 0 ? (
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">Engin teymi fundust í augnablikinu.</p>
          </article>
        ) : (
          teams.map((team) => {
            const latestPulse = latestPulseByTeam.get(team.id);
            return (
              <article key={team.id} className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{team.name}</h2>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ring-1 ${
                      team.isActive
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-slate-100 text-slate-700 ring-slate-200"
                    }`}
                  >
                    {team.isActive ? "Virkt" : "Óvirkt"}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Tengiliður:</span> {team.contact || "Ekki skráð"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Fundartaktur:</span>{" "}
                    {team.meetingCadence || "Ekki skráð"}
                  </p>
                </div>
                {team.notes ? (
                  <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    <span className="font-medium text-slate-900">Athugasemdir:</span> {team.notes}
                  </p>
                ) : null}
                {latestPulse ? (
                  <div className="mt-3 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Nýjasti púls</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{getPulseDisplayTitle(latestPulse)}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-xs text-slate-600">{formatDateIs(latestPulse.meetingDate)}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                          statusToneClass[latestPulse.status]
                        }`}
                      >
                        {statusLabel[latestPulse.status]}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    Enginn púls hefur verið skráður fyrir þetta teymi.
                  </p>
                )}
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
                  Skráðir púlsar: {pulseCountByTeam.get(team.id) ?? 0}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/pulsar?team=${encodeURIComponent(team.id)}`}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
                  >
                    Sjá púlsa
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
