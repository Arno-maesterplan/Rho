"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/tijdlijn", label: "Tijdlijn", emoji: "📅" },
  { href: "/groei", label: "Groei", emoji: "📈" },
  { href: "/milestones", label: "Mijlpalen", emoji: "⭐" },
  { href: "/ontwikkeling", label: "Weetjes", emoji: "💡" },
  { href: "/slaap", label: "Slaap", emoji: "🌙" },
  { href: "/updates", label: "Updates", emoji: "💬" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--rho-red-dark)]/95 backdrop-blur-md border-t border-[var(--rho-cream)]/10">
      <div className="flex max-w-lg mx-auto">
        {links.map(({ href, label, emoji }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
                active
                  ? "text-[var(--rho-gold)]"
                  : "text-[var(--rho-cream)]/40 hover:text-[var(--rho-cream)]/70"
              }`}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span className="text-[10px] font-body">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
