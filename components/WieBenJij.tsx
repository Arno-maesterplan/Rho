"use client";

import { useState, useEffect } from "react";

export function WieBenJij() {
  const [tonen, setTonen] = useState(false);
  const [naam, setNaam] = useState("");

  useEffect(() => {
    const opgeslagen = localStorage.getItem("rho_naam");
    if (!opgeslagen) setTonen(true);
  }, []);

  function opslaan() {
    const n = naam.trim();
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

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Jouw naam"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && opslaan()}
            className="flex-1 bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors"
            autoFocus
          />
          <button
            onClick={opslaan}
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
