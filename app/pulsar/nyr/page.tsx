import NewPulseForm from "@/components/NewPulseForm";
import { getTeams } from "@/lib/airtable";

export default async function NyrPulsPage() {
  const teams = await getTeams();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Nýr púls</h1>
      <p className="mt-2 text-sm text-slate-600">
        Skráðu stöðu, hindranir og næstu skref. Ef Airtable credentials vantar keyrir þetta í mock mode.
      </p>
      <div className="mt-6">
        <NewPulseForm teams={teams} />
      </div>
    </main>
  );
}
