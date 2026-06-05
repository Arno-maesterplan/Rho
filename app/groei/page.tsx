import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GroeiPage() {
  const supabase = createClient();

  const { data: metingen } = await supabase
    .from("measurements")
    .select("*")
    .order("date", { ascending: true });

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Kind en Gezin groeicurves
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Groei</h1>
      </header>

      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-6">
        <div className="space-y-3">
          <button className="w-full px-4 py-3 font-body text-sm transition-colors whitespace-nowrap text-[var(--rho-gold)] border-b-2 border-[var(--rho-gold)]">
            Gewicht
          </button>
          <button className="w-full px-4 py-3 font-body text-sm transition-colors whitespace-nowrap text-[var(--rho-cream)]/60">
            Lengte
          </button>
          <button className="w-full px-4 py-3 font-body text-sm transition-colors whitespace-nowrap text-[var(--rho-cream)]/60">
            Hoofd
          </button>
          <button className="w-full px-4 py-3 font-body text-sm transition-colors whitespace-nowrap text-[var(--rho-cream)]/60">
            Overzicht
          </button>
        </div>

        <div className="mt-6 p-4 bg-[var(--rho-gold)]/10 border border-[var(--rho-gold)]/25 rounded-xl">
          <p className="text-[var(--rho-cream)]/80 font-body text-sm">
            📊 Kind en Gezin referentiecurve
          </p>
          <p className="text-[var(--rho-cream)]/60 font-body text-xs mt-2">
            Metingen in database: <strong>{metingen?.length || 0}</strong>
          </p>
        </div>

        <button className="w-full mt-4 bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl transition-colors">
          + Meting toevoegen
        </button>
      </div>
    </main>
  );
}
