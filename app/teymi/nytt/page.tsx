import Link from "next/link";
import NewTeamForm from "@/components/NewTeamForm";

export const dynamic = "force-dynamic";

export default function TeymiNyttPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:space-y-6 sm:py-8">
      <div>
        <Link href="/teymi" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
          ← Til baka í teymi
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Nýtt teymi</h1>
        <p className="mt-2 text-sm text-slate-600">Stofnaðu teymi til að byrja að skrá púlsa.</p>
      </div>
      <NewTeamForm />
    </main>
  );
}
