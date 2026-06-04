"use client";

import { useNaam } from "@/lib/useNaam";

export function NaamWeergave() {
  const naam = useNaam();

  function wijzigen() {
    localStorage.removeItem("rho_naam");
    window.dispatchEvent(new Event("rho_naam_gewijzigd"));
    window.location.reload();
  }

  if (!naam) return null;

  return (
    <button
      onClick={wijzigen}
      className="mt-2 text-[var(--rho-cream)]/30 text-xs font-body hover:text-[var(--rho-cream)]/60 transition-colors"
    >
      Ingelogd als {naam} · wijzigen
    </button>
  );
}
