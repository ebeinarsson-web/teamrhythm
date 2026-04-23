import Link from "next/link";
import { TEAMRHYTHM_APP_URL } from "@/lib/solution-config";
import { teamRhythmTranslations } from "@/lib/teamrhythm-translations";

export default function TeamRhythmSolutionPage() {
  const t = teamRhythmTranslations.is;

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.hero.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t.hero.title}</h1>
        <p className="mt-3 text-slate-700">{t.hero.intro}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.introCard1.eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold">{t.introCard1.title}</h2>
          <p className="mt-2 text-slate-700">{t.introCard1.body}</p>
          <p className="mt-3 text-sm text-slate-500">{t.introCard1.productNote}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-900 p-5 text-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.introCard2.eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold">{t.introCard2.title}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
            {t.introCard2.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.darkCard1.eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold">{t.darkCard1.title}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-200">
            {t.darkCard1.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.darkCard2.eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold">{t.darkCard2.title}</h2>
          <p className="mt-3 text-sm text-slate-200">{t.darkCard2.body}</p>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.cta.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold">{t.cta.title}</h2>
        <p className="mt-3 text-slate-700">{t.cta.body}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={TEAMRHYTHM_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            {t.cta.primary}
          </a>
          <Link href="/pulsar" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            {t.cta.secondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
