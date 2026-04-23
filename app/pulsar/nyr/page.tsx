import NewPulseForm from "@/components/NewPulseForm";
import { getTeams } from "@/lib/airtable";

export default async function NyrPulsPage() {
  const teams = await getTeams();

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Nýr púls</h1>
      <p className="mt-2 text-sm text-slate-600">Skráðu stöðu, hindranir og næstu skref fyrir teymið.</p>
      <div>
        <NewPulseForm teams={teams} />
      </div>
    </main>
  );
}
