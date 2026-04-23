import { getPulses, getTeams } from "@/lib/airtable";

const statusLabel: Record<string, string> = {
  green: "Grænt",
  yellow: "Gult",
  red: "Rautt",
};

const statusToneClass: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default async function PulsarPage() {
  const [pulses, teams] = await Promise.all([getPulses(), getTeams()]);
  const teamById = new Map(teams.map((team) => [team.id, team.name]));

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Púlsar</h1>
      <p className="mt-2 text-sm text-slate-600">Einn púls = ein stöðutaka / fundarfærsla fyrir teymi.</p>

      <div className="mt-6 space-y-4">
        {pulses.length === 0 ? (
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">Engar púlsfærslur fundust.</p>
          </article>
        ) : (
          pulses.map((pulse) => (
            <article key={pulse.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                  {pulse.title}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 sm:text-sm ${statusToneClass[pulse.status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
                >
                  {statusLabel[pulse.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {teamById.get(pulse.teamId) ?? pulse.teamName} - {pulse.meetingDate}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="text-sm text-slate-700">
                  <strong>Helstu markmið:</strong>{" "}
                  <span className="line-clamp-2 align-top">{pulse.goals || "Ekki skráð"}</span>
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Hvað tefur framvindu:</strong>{" "}
                  <span className="line-clamp-2 align-top">{pulse.blockers || "Ekki skráð"}</span>
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                <strong>Næstu skref:</strong>{" "}
                <span className="line-clamp-2 align-top">{pulse.nextSteps || "Ekki skráð"}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                <strong>Sent inn af:</strong> {pulse.submittedBy || "Ekki skráð"}
              </p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
