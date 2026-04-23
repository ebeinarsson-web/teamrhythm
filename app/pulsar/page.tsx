import { getPulses, getTeams } from "@/lib/airtable";

const statusLabel: Record<string, string> = {
  green: "Grænt",
  yellow: "Gult",
  red: "Rautt",
};

export default async function PulsarPage() {
  const [pulses, teams] = await Promise.all([getPulses(), getTeams()]);
  const teamById = new Map(teams.map((team) => [team.id, team.name]));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Púlsar</h1>
      <p className="mt-2 text-sm text-slate-600">Einn púls = ein stöðutaka / fundarfærsla fyrir teymi.</p>

      <div className="mt-6 space-y-4">
        {pulses.map((pulse) => (
          <article key={pulse.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-medium">{teamById.get(pulse.teamId) ?? "Óþekkt teymi"}</h2>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>{pulse.date}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1">{statusLabel[pulse.status]}</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Samantekt:</strong> {pulse.summary}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Hindranir:</strong> {pulse.blockers}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Næstu skref:</strong> {pulse.nextSteps}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
