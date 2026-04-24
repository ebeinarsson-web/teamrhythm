import Link from "next/link";
import packageJson from "@/package.json";
import { getCurrentUserLabel } from "@/lib/auth";
import { signOut } from "@/auth";

const links = [
  { href: "/", label: "Yfirlit" },
  { href: "/pulsar", label: "Púlsar" },
  { href: "/pulsar/nyr", label: "Nýr púls" },
  { href: "/teymi", label: "Teymi" },
  { href: "/teymi/nytt", label: "Nýtt teymi" },
  { href: "/solutions/teamrhythm", label: "Lausnin" },
];

export default async function SiteHeader() {
  const appVersion = `v${packageJson.version}`;
  const currentUser = await getCurrentUserLabel();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/sign-in" });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-base font-semibold tracking-tight text-slate-950">
            TeamRhythm
          </Link>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500">
            {appVersion}
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-700 sm:gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          {currentUser ? (
            <>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{currentUser}</span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Skrá út
                </button>
              </form>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
