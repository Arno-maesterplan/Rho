import { createClient } from "@/lib/supabase/server";
import { getRhoAge, getCurrentLeap, formatDutchDate, WONDER_WEEKS } from "@/lib/rho";
import { redirect } from "next/navigation";
import { differenceInDays } from "date-fns";

export default async function TijdlijnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { weeks } = getRhoAge();
  const { activeLeap, isInStorm } = getCurrentLeap(weeks);
  const today = new Date();

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8">
      <header className="mb-8">
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          De 10 sprongen
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Tijdlijn</h1>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          Rho is nu in week {weeks}
        </p>
      </header>

      <div className="relative">
        {/* Verticale lijn */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--rho-cream)]/10" />

        <div className="space-y-1">
          {WONDER_WEEKS.map((leap) => {
            const start = new Date(leap.dateStart);
            const end = new Date(leap.dateEnd);
            const isPast = end < today;
            const isCurrent =
              activeLeap?.number === leap.number;
            const isFuture = start > today;
            const daysUntil = differenceInDays(start, today);

            return (
              <div key={leap.number} className="relative pl-16 pb-6">
                {/* Cirkel op de lijn */}
                <div
                  className={`absolute left-4 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all ${
                    isCurrent
                      ? "bg-[var(--rho-gold)] border-[var(--rho-gold)] scale-125 shadow-lg shadow-[var(--rho-gold)]/30"
                      : isPast
                      ? "bg-[var(--rho-cream)]/30 border-[var(--rho-cream)]/30"
                      : "bg-transparent border-[var(--rho-cream)]/20"
                  }`}
                >
                  {isPast && !isCurrent && (
                    <span className="text-[var(--rho-cream)]/60 text-[8px]">✓</span>
                  )}
                </div>

                {/* Inhoud */}
                <div
                  className={`rounded-2xl p-4 border transition-all ${
                    isCurrent
                      ? isInStorm
                        ? "bg-gradient-to-br from-[#2a1a2e] to-[#1a0d1e] border-purple-700/40"
                        : "bg-[var(--rho-cream)]/12 border-[var(--rho-gold)]/30"
                      : isPast
                      ? "bg-[var(--rho-cream)]/5 border-[var(--rho-cream)]/8 opacity-60"
                      : "bg-[var(--rho-cream)]/5 border-[var(--rho-cream)]/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl shrink-0">{leap.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-[var(--rho-cream)]/40 text-xs font-body">
                          Sprong {leap.number} · week {leap.weekStart}–{leap.weekEnd}
                        </p>
                        <h3 className="font-display text-base text-[var(--rho-cream)] leading-snug">
                          {leap.name}
                        </h3>
                      </div>
                    </div>

                    {isCurrent && (
                      <span
                        className={`text-xs font-body px-2 py-0.5 rounded-full shrink-0 ${
                          isInStorm
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-[var(--rho-gold)]/20 text-[var(--rho-gold)]"
                        }`}
                      >
                        {isInStorm ? "Storm" : "Nu"}
                      </span>
                    )}

                    {isFuture && daysUntil > 0 && (
                      <span className="text-xs font-body text-[var(--rho-cream)]/30 shrink-0">
                        over {daysUntil}d
                      </span>
                    )}

                    {isPast && !isCurrent && (
                      <span className="text-xs font-body text-[var(--rho-cream)]/25 shrink-0">
                        Voorbij
                      </span>
                    )}
                  </div>

                  <p className="text-[var(--rho-cream)]/60 text-xs font-body mt-2">
                    {formatDutchDate(leap.dateStart)} – {formatDutchDate(leap.dateEnd)}
                  </p>

                  {isCurrent && (
                    <p className="text-[var(--rho-cream)]/70 text-sm font-body mt-2 leading-relaxed">
                      {leap.description}
                    </p>
                  )}

                  {isCurrent && leap.symptoms.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--rho-cream)]/10">
                      <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-1.5">
                        Wat je kan merken
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {leap.symptoms.map((s, i) => (
                          <span
                            key={i}
                            className="text-xs font-body bg-[var(--rho-cream)]/10 text-[var(--rho-cream)]/70 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
