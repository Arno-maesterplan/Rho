import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GroeiPage() {
  try {
    const supabase = createClient();

    const { data: metingen, error } = await supabase
      .from("measurements")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      throw error;
    }

    return (
      <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
        <header>
          <h1 className="font-display text-4xl text-[var(--rho-cream)]">Groei</h1>
        </header>

        <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-4">
          <p className="text-[var(--rho-cream)] font-body">
            Metingen in database: <strong>{metingen?.length || 0}</strong>
          </p>
        </div>

        {metingen && metingen.length === 0 && (
          <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-8 text-center">
            <p className="text-[var(--rho-cream)]/40 font-body text-sm">
              Geen metingen. Voeg je eerste meting toe!
            </p>
          </div>
        )}

        {metingen && metingen.length > 0 && (
          <div className="bg-[var(--rho-gold)]/10 border border-[var(--rho-gold)]/25 rounded-xl p-4">
            <p className="text-[var(--rho-cream)] font-body text-sm">
              ✓ {metingen.length} meting(en) gevonden!
            </p>
          </div>
        )}
      </main>
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return (
      <main className="min-h-screen max-w-lg mx-auto px-5 py-8">
        <h1 className="font-display text-4xl text-[var(--rho-cream)] mb-4">Groei</h1>
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6">
          <p className="text-red-300 font-body text-sm mb-2">❌ Error:</p>
          <p className="text-red-200 font-mono text-xs break-words">{errorMsg}</p>
        </div>
      </main>
    );
  }
}
