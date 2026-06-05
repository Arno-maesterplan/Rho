export const dynamic = "force-dynamic";

export default function GroeiPage() {
  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Kind en Gezin groeicurves
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Groei</h1>
      </header>

      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-6">
        <p className="text-[var(--rho-cream)] font-body text-sm">
          🚧 Groeicurves pagina in voorbereiding...
        </p>
        <p className="text-[var(--rho-cream)]/60 font-body text-xs mt-2">
          Deze pagina toont binnenkort Kind en Gezin groeicurves met percentiles.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-lg text-[var(--rho-cream)]">Komende features:</h2>
        <ul className="space-y-2 text-[var(--rho-cream)]/70 font-body text-sm">
          <li>✓ Gewicht-voor-leeftijd grafiek</li>
          <li>✓ Lengte-voor-leeftijd grafiek</li>
          <li>✓ Hoofdomtrek-voor-leeftijd grafiek</li>
          <li>✓ Gewicht-voor-lengte scatter chart</li>
          <li>✓ Kind en Gezin percentiles (P1-P99)</li>
        </ul>
      </div>

      <a
        href="/?new=1"
        className="block text-center bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl transition-colors"
      >
        Terug naar startpagina
      </a>
    </main>
  );
}
