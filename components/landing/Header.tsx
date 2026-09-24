import Link from "next/link";
import { businessConfig } from "@/config/business";

const navItems = [
  { href: "#bemutatkozas", label: "Bemutatkozás" },
  { href: "#szolgaltatasok", label: "Szolgáltatások" },
  { href: "#galeria", label: "Galéria" },
  { href: "#velemenyek", label: "Vélemények" },
  { href: "#kapcsolat", label: "Kapcsolat" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink-line/60 bg-ink/80 backdrop-blur-md">
      <div className="section flex h-16 items-center justify-between md:h-20">
        <Link href="#top" className="font-display text-lg tracking-tight text-paper">
          {businessConfig.meta.logoText}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-paper-muted transition-colors hover:text-paper"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/foglalas"
          className="rounded-full border border-brass/50 px-5 py-2 text-sm text-brass-light transition-colors hover:border-brass hover:bg-brass/10"
        >
          Időpontfoglalás
        </Link>
      </div>
    </header>
  );
}
