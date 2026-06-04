"use client";

import { useState, useEffect } from "react";

const BEKENDE_NAMEN = ["Arno", "Céline", "Oma Rita", "Opa Jef", "Oma Marie", "Opa Frank", "Delfien", "Thomas"];

export function WieBenJij() {
  const [tonen, setTonen] = useState(false);
  const [naam, setNaam] = useState("");

  useEffect(() => {
    const opgeslagen = localStorage.getItem("rho_naam");
    if (!opgeslagen) setTonen(true);
  }, []);

  function opslaan(gekozenNaam: string) {
    const n = gekozenNaam.trim();
    if (!n) return;
    localStorage.setItem("rho_naam", n);
    setTonen(false);
    window.dispatchEvent(new Event("rho_naam_gewijzigd"));
  }

  if (!tonen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-4xl">👋</p>
          <h2 className="font-display text-2xl text-[var(--rho-cream)]">Wie ben jij?</h2>
          <p className="text-[var(--rho-cream)]/60 text-sm font-body">
            Zo weten we wie wat heeft gepost.
          </p>
        </div>

        {/* Snelle keuze */}
        <div className="flex flex-wrap gap-2 justify-center">
          {BEKENDE_NAMEN.map((n) => (
            <button
              key={n}
              onClick={() => opslaan(n)}
              className="px-3 py-1.5 rounded-full border border-[var(--rho-cream)]/20 text-[var(--rho-cream)]/70 text-sm font-body hover:bg-[var(--rho-cream)]/10 hover:text-[var(--rho-cream)] transition-colors"
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--rho-cream)]/10" />
          <span className="text-[var(--rho-cream)]/30 text-xs font-body">of typ je naam</span>
          <div className="flex-1 h-px bg-[var(--rho-cream)]/10" />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Jouw naam"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && opslaan(naam)}
            className="flex-1 bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors"
            autoFocus
          />
          <button
            onClick={() => opslaan(naam)}
            disabled={!naam.trim()}
            className="w-12 h-12 rounded-xl bg-[var(--rho-gold)] text-[var(--rho-red-dark)] font-body font-bold disabled:opacity-30 hover:opacity-90 transition-opacity"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
