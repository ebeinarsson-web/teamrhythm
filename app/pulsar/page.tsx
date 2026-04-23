import { getPulses, getTeams } from "@/lib/airtable";
import { formatDateIs } from "@/lib/date-format";
import { getPulseDisplayTitle } from "@/lib/pulse-display";

const statusLabel: Record<string, string> = {
  green: "Græn",
  yellow: "Gul",
  red: "Rauð",
};

const statusToneClass: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
};

export const dynamic = "force-dynamic";

export default async function PulsarPage({
  searchParams,
}: {
  searchParams?: Promise<{ saved?: string; team?: string; status?: string; q?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const showSavedMessage = resolvedSearchParams?.saved === "1";
  const selectedTeam = resolvedSearchParams?.team ?? "";
  const selectedStatus = resolvedSearchParams?.status ?? "";
  const searchQuery = (resolvedSearchParams?.q ?? "").trim().toLowerCase();
  const [pulses, teams] = await Promise.all([getPulses(), getTeams()]);
  const teamById = new Map(teams.map((team) => [team.id, team.name]));
  const visiblePulses = pulses.filter((pulse) => {
    const teamMatches = !selectedTeam || pulse.teamId === selectedTeam;
    const statusMatches = !selectedStatus || pulse.status === selectedStatus;
    const searchableContent = [
      getPulseDisplayTitle(pulse),
      teamById.get(pulse.teamId) ?? pulse.teamName,
      pulse.goals,
      pulse.nextSteps,
    ]
      .join(" ")
      .toLowerCase();
    const searchMatches = !searchQuery || searchableContent.includes(searchQuery);
    return teamMatches && statusMatches && searchMatches;
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Púlsar</h1>
      <p className="mt-2 text-sm text-slate-600">Einn púls = ein stöðutaka / fundarfærsla fyrir teymi.</p>
      {showSavedMessage ? (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Púls var vistaður.
        </p>
      ) : null}

      <form
        method="get"
        className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label htmlFor="q" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Leita
          </label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={resolvedSearchParams?.q ?? ""}
            placeholder="Leita í púlsum, teymi, markmiðum eða næstu skrefum"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          />
        </div>
        <div>
          <label htmlFor="team" className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Teymi
          </label>
          <select
            id="team"
            name="team"
            defaultValue={selectedTeam}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          >
            <option value="">Öll teymi</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500"
          >
            Staða
          </label>
          <select
            id="status"
            name="status"
            defaultValue={selectedStatus}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          >
            <option value="">Allar stöður</option>
            <option value="green">Græn</option>
            <option value="yellow">Gul</option>
            <option value="red">Rauð</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Uppfæra lista
            </button>
            <a
              href="/pulsar"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Hreinsa síur
            </a>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-4">
        {visiblePulses.length === 0 ? (
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-600">
              {selectedTeam || selectedStatus
                ? "Engar púlsfærslur fundust fyrir valda síu."
                : "Engar púlsfærslur fundust."}
            </p>
          </article>
        ) : (
          visiblePulses.map((pulse) => (
            <article key={pulse.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                  {getPulseDisplayTitle(pulse)}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 sm:text-sm ${statusToneClass[pulse.status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
                >
                  {statusLabel[pulse.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {teamById.get(pulse.teamId) ?? pulse.teamName} - {formatDateIs(pulse.meetingDate)}
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
