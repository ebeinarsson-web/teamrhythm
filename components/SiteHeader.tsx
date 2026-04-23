import Link from "next/link";

const links = [
  { href: "/", label: "Yfirlit" },
  { href: "/pulsar", label: "Púlsar" },
  { href: "/pulsar/nyr", label: "Nýr púls" },
  { href: "/teymi", label: "Teymi" },
  { href: "/solutions/teamrhythm", label: "Lausnin" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-base font-semibold tracking-tight text-slate-950">
          TeamRhythm
        </Link>
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
        </nav>
      </div>
    </header>
  );
}
