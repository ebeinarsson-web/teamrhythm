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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          TeamRhythm
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
