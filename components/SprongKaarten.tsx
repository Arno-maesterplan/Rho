"use client";

import { useState } from "react";
import { SprongModal } from "./SprongModal";

interface Props {
  activeLeap: any;
  isInStorm: boolean;
  nextLeap: any | null;
  daysUntilNext: number | null;
}

export function SprongKaarten({ activeLeap, isInStorm, nextLeap, daysUntilNext }: Props) {
  const [selectedSprong, setSelectedSprong] = useState<number | null>(null);
  const [showRustig, setShowRustig] = useState(false);

  return (
    <>
      {/* Weer-kaart */}
      <button
        onClick={() => {
          if (activeLeap) {
            setSelectedSprong(activeLeap.number);
          } else {
            setShowRustig(true);
          }
        }}
        className={`relative overflow-hidden rounded-2xl p-6 w-full text-left cursor-pointer transition-opacity hover:opacity-90 ${
          isInStorm
            ? "bg-gradient-to-br from-[#2a1a2e] to-[#1a0d1e] border border-purple-900/40"
            : activeLeap
            ? "bg-gradient-to-br from-[#7a1a28] to-[var(--rho-red-dark)] border border-[var(--rho-cream)]/10"
            : "bg-gradient-to-br from-[#9B3a15] to-[#C8701E] border border-[var(--rho-gold)]/20"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          {isInStorm ? (
            <>
              <span className="absolute top-3 right-6 text-purple-300/20 text-2xl">⚡</span>
              <span className="absolute bottom-4 left-4 text-purple-300/10 text-4xl">☁️</span>
            </>
          ) : activeLeap ? (
            <span className="absolute top-2 right-4 text-[var(--rho-cream)]/10 text-5xl">🌙</span>
          ) : (
            <span className="absolute top-2 right-4 text-yellow-200/20 text-5xl">☀️</span>
          )}
        </div>

        {activeLeap ? (
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{isInStorm ? "⛈️" : activeLeap.emoji}</span>
              <span
                className={`text-xs font-body uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isInStorm
                    ? "bg-purple-500/20 text-purple-200"
                    : "bg-[var(--rho-cream)]/10 text-[var(--rho-cream)]/70"
                }`}
              >
                {isInStorm ? "Storm" : "Sprong in zicht"}
              </span>
            </div>
            <h2 className="font-display text-xl text-[var(--rho-cream)] leading-snug">
              Sprong {activeLeap.number}: {activeLeap.name}
            </h2>
            <p className="text-[var(--rho-cream)]/70 text-sm font-body leading-relaxed">
              {activeLeap.description}
            </p>
            {isInStorm && (
              <div className="mt-3 pt-3 border-t border-[var(--rho-cream)]/10 space-y-1">
                {activeLeap.tips.slice(0, 3).map((tip: string, i: number) => (
                  <p key={i} className="text-[var(--rho-gold)] text-sm font-body">
                    ✦ {tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☀️</span>
              <span className="text-xs font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--rho-gold)]/20 text-[var(--rho-gold)]">
                Zonneschijn
              </span>
            </div>
            <h2 className="font-display text-xl text-[var(--rho-cream)]">Rustige periode</h2>
            <p className="text-[var(--rho-cream)]/70 text-sm font-body">
              Rho zit tussen twee sprongen in. Geniet van de zonneschijn!
            </p>
          </div>
        )}
      </button>

      {/* Volgende sprong */}
      {nextLeap && daysUntilNext !== null && (
        <button
          onClick={() => setSelectedSprong(nextLeap.number)}
          className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl px-5 py-4 flex items-center gap-4 hover:bg-[var(--rho-cream)]/12 transition-colors w-full text-left cursor-pointer"
        >
          <span className="text-2xl">{nextLeap.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">
              Volgende sprong
            </p>
            <p className="text-[var(--rho-cream)] font-display text-base leading-snug truncate">
              {nextLeap.name}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-2xl text-[var(--rho-gold)]">
              {daysUntilNext > 0 ? daysUntilNext : 0}
            </p>
            <p className="text-[var(--rho-cream)]/40 text-xs font-body">
              {daysUntilNext === 1 ? "dag" : "dagen"}
            </p>
          </div>
        </button>
      )}

      <SprongModal sprongNum={selectedSprong} isOpen={!!selectedSprong} onClose={() => setSelectedSprong(null)} />

      {/* Rustige periode modal */}
      {showRustig && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6"
          onClick={(e) => e.target === e.currentTarget && setShowRustig(false)}
        >
          <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[var(--rho-gold)] text-xs font-body uppercase tracking-wider mb-2">Rustige periode</p>
              <h2 className="font-display text-2xl text-[var(--rho-cream)] leading-tight">Genieten! ☀️</h2>
            </div>

            <div className="space-y-3">
              <p className="text-[var(--rho-cream)]/80 font-body text-sm leading-relaxed">
                Rho zit momenteel tussen twee sprongen in. Dit is een rustige periode waarin je van je baby kunt genieten zonder de chaotische veranderingen van een sprong.
              </p>

              {nextLeap && daysUntilNext !== null && (
                <div className="bg-[var(--rho-gold)]/10 border border-[var(--rho-gold)]/20 rounded-xl p-4 space-y-2">
                  <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider">Volgende sprong:</p>
                  <p className="font-display text-lg text-[var(--rho-cream)]">{nextLeap.name}</p>
                  <p className="text-[var(--rho-gold)] text-sm font-body">
                    {daysUntilNext > 0 ? `Over ${daysUntilNext} ${daysUntilNext === 1 ? "dag" : "dagen"}` : "Binnenkort!"}
                  </p>
                </div>
              )}

              <p className="text-[var(--rho-cream)]/70 text-sm font-body">
                ✨ Maak foto's, geniet van de momenten, en zorg goed voor jezelf ook!
              </p>
            </div>

            <button
              onClick={() => setShowRustig(false)}
              className="w-full px-4 py-3 bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body text-sm rounded-xl transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </>
  );
}
