import { getPulses, getTeams } from "@/lib/airtable";

export default async function TeymiPage() {
  const [teams, pulses] = await Promise.all([getTeams(), getPulses()]);
  const pulseCountByTeam = new Map<string, number>();

  for (const pulse of pulses) {
    pulseCountByTeam.set(pulse.teamId, (pulseCountByTeam.get(pulse.teamId) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Teymi</h1>
      <p className="mt-2 text-sm text-slate-600">Yfirlit yfir teymi í Airtable töflunni `Teymi`.</p>

      <div className="mt-6 grid gap-4">
        {teams.length === 0 ? (
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-600">Engin teymi fundust.</p>
          </article>
        ) : (
          teams.map((team) => (
            <article key={team.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-medium">{team.name}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {team.isActive ? "Virkt" : "Ovirkt"}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">Tengilidur: {team.contact || "Ekki skrad"}</p>
              <p className="mt-1 text-sm text-slate-700">Fundartaktur: {team.meetingCadence || "Ekki skrad"}</p>
              {team.notes ? <p className="mt-1 text-sm text-slate-700">Athugasemdir: {team.notes}</p> : null}
              <p className="mt-2 text-sm text-slate-600">Skradir pulsar: {pulseCountByTeam.get(team.id) ?? 0}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
