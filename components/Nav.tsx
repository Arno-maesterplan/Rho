"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/tijdlijn", label: "Tijdlijn", emoji: "📅" },
  { href: "/fotos", label: "Foto's", emoji: "📷" },
  { href: "/groei", label: "Groei", emoji: "📈" },
  { href: "/milestones", label: "Mijlpalen", emoji: "⭐" },
  { href: "/ontwikkeling", label: "Weetjes", emoji: "💡" },
  { href: "/slaap", label: "Slaap", emoji: "🌙" },
  { href: "/updates", label: "Updates", emoji: "💬" },
];

// Welke tabel bepaalt "nieuw" voor welke pagina
const NIEUW_BRONNEN: Record<string, "updates" | "milestones"> = {
  "/updates": "updates",
  "/milestones": "milestones",
};

export function Nav() {
  const pathname = usePathname();
  const [nieuw, setNieuw] = useState<Record<string, boolean>>({});

  // Markeer huidige pagina als "gezien"
  useEffect(() => {
    if (NIEUW_BRONNEN[pathname]) {
      localStorage.setItem(`gezien:${pathname}`, new Date().toISOString());
      setNieuw((prev) => ({ ...prev, [pathname]: false }));
    }
  }, [pathname]);

  // Check op nieuwe items sinds laatste bezoek
  useEffect(() => {
    const supabase = createClient();
    async function check() {
      const resultaat: Record<string, boolean> = {};
      for (const [route, tabel] of Object.entries(NIEUW_BRONNEN)) {
        if (route === pathname) continue;
        try {
          const { data } = await supabase
            .from(tabel)
            .select("created_at")
            .order("created_at", { ascending: false })
            .limit(1);
          const laatste = data?.[0]?.created_at;
          if (!laatste) continue;
          const gezien = localStorage.getItem(`gezien:${route}`);
          resultaat[route] = !gezien || new Date(laatste) > new Date(gezien);
        } catch {
          // stil falen — badge is nice-to-have
        }
      }
      setNieuw((prev) => ({ ...prev, ...resultaat }));
    }
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--rho-red-dark)]/95 backdrop-blur-md border-t border-[var(--rho-cream)]/10">
      <div className="flex max-w-lg mx-auto">
        {links.map(({ href, label, emoji }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors relative ${
                active
                  ? "text-[var(--rho-gold)]"
                  : "text-[var(--rho-cream)]/40 hover:text-[var(--rho-cream)]/70"
              }`}
            >
              <span className="relative text-lg leading-none">
                {emoji}
                {nieuw[href] && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[var(--rho-gold)] shadow-[0_0_6px_var(--rho-gold)]" />
                )}
              </span>
              <span className="text-[9px] font-body">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
