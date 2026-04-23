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
        {pulses.length === 0 ? (
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-600">Engar pulsfaerslur fundust.</p>
          </article>
        ) : (
          pulses.map((pulse) => (
            <article key={pulse.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-medium">{pulse.title}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-sm text-slate-700">
                  {statusLabel[pulse.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {teamById.get(pulse.teamId) ?? pulse.teamName} - {pulse.meetingDate}
              </p>
              <p className="mt-3 text-sm text-slate-700">
                <strong>Helstu markmid:</strong> {pulse.goals || "Ekki skrad"}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                <strong>Hvad tefur framvindu:</strong> {pulse.blockers || "Ekki skrad"}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                <strong>Naestu skref:</strong> {pulse.nextSteps || "Ekki skrad"}
              </p>
              <p className="mt-2 text-sm text-slate-700">
                <strong>Sent inn af:</strong> {pulse.submittedBy || "Ekki skrad"}
              </p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
