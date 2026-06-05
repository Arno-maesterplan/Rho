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
        <p className="text-[var(--rho-cream)] font-body">
          Metingen: <strong>{metingen?.length || 0}</strong>
        </p>
      </div>

      {!metingen || metingen.length === 0 ? (
        <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-8 text-center">
          <p className="text-[var(--rho-cream)]/40 font-body text-sm">
            Voeg je eerste meting toe om Rho's groei te volgen
          </p>
        </div>
      ) : (
        <div className="bg-[var(--rho-gold)]/10 border border-[var(--rho-gold)]/25 rounded-xl p-4">
          <p className="text-[var(--rho-cream)] font-body text-sm">
            ✓ {metingen.length} meting(en) gevonden!
          </p>
        </div>
      )}
    </main>
  );
}
