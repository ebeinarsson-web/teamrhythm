import NewPulseForm from "@/components/NewPulseForm";
import { getTeamsForUser } from "@/lib/airtable";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NyrPulsPage() {
  const currentUser = await getCurrentUser();
  const teams = await getTeamsForUser(currentUser?.email);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Nýr púls</h1>
      <p className="mt-2 text-sm text-slate-600">Skráðu stöðu, hindranir og næstu skref fyrir teymið.</p>
      <p className="text-xs text-slate-500">Dagsetningar birtast á íslensku, til dæmis 23.04.2026.</p>
      {teams.length === 0 ? (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Ekki er hægt að skrá nýjan púls fyrr en virkt teymi er tengt aðganginum þínum.
          </p>
        </article>
      ) : (
        <div>
          <NewPulseForm teams={teams} />
        </div>
      )}
    </main>
  );
}
