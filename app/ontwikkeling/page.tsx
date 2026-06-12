import { getRhoAge } from "@/lib/rho";
import { ONTWIKKELING, CATEGORIE_INFO, getHuidigeFase } from "@/lib/ontwikkeling";

export const dynamic = "force-dynamic";

export default function OntwikkelingPage() {
  const { weeks } = getRhoAge();
  const huidigeFase = getHuidigeFase(weeks);

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8">
      <header className="mb-8">
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Rho beter begrijpen
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Ontwikkeling</h1>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          Wat Rho nu ziet, hoort, voelt en leert — week per week
        </p>
      </header>

      <div className="space-y-4">
        {ONTWIKKELING.map((fase) => {
          const isNu = huidigeFase?.weekStart === fase.weekStart;
          const isVoorbij = weeks > fase.weekEnd;

          return (
            <details
              key={fase.weekStart}
              open={isNu}
              className={`rounded-2xl border overflow-hidden ${
                isNu
                  ? "bg-[var(--rho-gold)]/10 border-[var(--rho-gold)]/40"
                  : isVoorbij
                  ? "bg-[var(--rho-cream)]/3 border-[var(--rho-cream)]/8 opacity-70"
                  : "bg-[var(--rho-cream)]/5 border-[var(--rho-cream)]/10"
              }`}
            >
              <summary className="cursor-pointer list-none p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">{fase.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[var(--rho-cream)]/40 text-[10px] font-body uppercase tracking-wider">
                        Week {fase.weekStart}–{fase.weekEnd}
                      </p>
                      {isNu && (
                        <span className="bg-[var(--rho-gold)]/20 text-[var(--rho-gold)] text-[10px] font-body px-1.5 py-0.5 rounded-full">
                          Nu bij Rho
                        </span>
                      )}
                      {isVoorbij && (
                        <span className="text-[var(--rho-cream)]/30 text-[10px] font-body">✓</span>
                      )}
                    </div>
                    <p className="text-[var(--rho-cream)] font-display text-lg leading-snug">
                      {fase.titel}
                    </p>
                  </div>
                </div>
                <p className="text-[var(--rho-cream)]/60 text-sm font-body mt-2 leading-relaxed">
                  {fase.intro}
                </p>
              </summary>

              <div className="px-4 pb-4 space-y-2 border-t border-[var(--rho-cream)]/8 pt-3">
                {fase.weetjes.map((w, i) => {
                  const cat = CATEGORIE_INFO[w.categorie];
                  return (
                    <div
                      key={i}
                      className="flex gap-3 bg-[var(--rho-cream)]/5 rounded-xl p-3"
                    >
                      <span className="text-base shrink-0">{cat.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-[var(--rho-gold)]/80 text-[10px] font-body uppercase tracking-wider">
                          {cat.label}
                        </p>
                        <p className="text-[var(--rho-cream)]/80 text-sm font-body leading-relaxed mt-0.5">
                          {w.tekst}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>

      <p className="text-[var(--rho-cream)]/25 text-xs font-body italic mt-8 text-center">
        Elk kindje ontwikkelt op haar eigen tempo — deze weetjes zijn gemiddelden, geen deadlines. 💛
      </p>
    </main>
  );
}
