import { getRhoAge } from "@/lib/rho";
import { SLAAP_FASES, getHuidigeSlaapFase } from "@/lib/slaap";

export const dynamic = "force-dynamic";

export default function SlaapPage() {
  const { weeks } = getRhoAge();
  const huidigeFase = getHuidigeSlaapFase(weeks);

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8">
      <header className="mb-8">
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Slaap kindje slaap
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Slaap</h1>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          Wat Rho nu nodig heeft om goed te slapen
        </p>
      </header>

      <div className="space-y-4">
        {SLAAP_FASES.map((fase) => {
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
              </summary>

              <div className="px-4 pb-4 space-y-3 border-t border-[var(--rho-cream)]/8 pt-3">
                {/* Kerncijfers */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[var(--rho-cream)]/5 rounded-xl p-3">
                    <p className="text-[var(--rho-gold)]/80 text-[10px] font-body uppercase tracking-wider">😴 Totaal</p>
                    <p className="text-[var(--rho-cream)] text-sm font-body mt-0.5">{fase.totaalSlaap}</p>
                  </div>
                  <div className="bg-[var(--rho-cream)]/5 rounded-xl p-3">
                    <p className="text-[var(--rho-gold)]/80 text-[10px] font-body uppercase tracking-wider">🌙 Nacht</p>
                    <p className="text-[var(--rho-cream)] text-sm font-body mt-0.5">{fase.nachtSlaap}</p>
                  </div>
                  <div className="bg-[var(--rho-cream)]/5 rounded-xl p-3">
                    <p className="text-[var(--rho-gold)]/80 text-[10px] font-body uppercase tracking-wider">☀️ Dutjes</p>
                    <p className="text-[var(--rho-cream)] text-sm font-body mt-0.5">{fase.dutjes}</p>
                  </div>
                  <div className="bg-[var(--rho-cream)]/5 rounded-xl p-3">
                    <p className="text-[var(--rho-gold)]/80 text-[10px] font-body uppercase tracking-wider">⏰ Wakkertijd</p>
                    <p className="text-[var(--rho-cream)] text-sm font-body mt-0.5">{fase.wakkerTijd}</p>
                  </div>
                </div>

                <p className="text-[var(--rho-cream)]/70 text-sm font-body leading-relaxed">
                  {fase.uitleg}
                </p>

                <div className="space-y-1.5">
                  <p className="text-[var(--rho-gold)]/80 text-[10px] font-body uppercase tracking-wider">Tips</p>
                  {fase.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2 text-sm font-body text-[var(--rho-cream)]/80 leading-relaxed">
                      <span className="text-[var(--rho-gold)] shrink-0">✦</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <p className="text-[var(--rho-cream)]/25 text-xs font-body italic mt-8 text-center">
        Richtlijnen, geen regels — Rho bepaalt zelf haar tempo. 💛
      </p>
    </main>
  );
}
