import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = (searchParams ? await searchParams : undefined) ?? {};
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/";

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: nextPath });
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:py-16">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">TeamRhythm</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Skrá inn</h1>
        <p className="mt-2 text-sm text-slate-600">Skráðu þig inn með Google til að opna TeamRhythm.</p>

        <form action={signInWithGoogle} className="mt-5">
          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Skrá inn með Google
          </button>
        </form>
      </section>
    </main>
  );
}
