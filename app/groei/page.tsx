import { createClient } from "@/lib/supabase/server";
import { GroeiTabs } from "./GroeiTabs";
import { MetingenTabel } from "./MetingenTabel";
import { MetingFormulier } from "./MetingFormulier";

export const dynamic = "force-dynamic";

export default async function GroeiPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const supabase = createClient();

  const { data: metingen } = await supabase
    .from("measurements")
    .select("*")
    .order("date", { ascending: true });

  const params = await searchParams;
  const showForm = params.new === "1";

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Groeicurves
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Groei</h1>
      </header>

      {metingen && metingen.length > 0 && (
        <div>
          <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-2">
            Alle metingen
          </p>
          <MetingenTabel measurements={metingen} />
        </div>
      )}

      <GroeiTabs measurements={metingen ?? []} onAddClick={() => {}} />

      {(!metingen || metingen.length === 0) && (
        <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-8 text-center">
          <p className="text-[var(--rho-cream)]/40 font-body text-sm">
            👇 Voeg je eerste meting toe om Rho op de groeicurves te zien
          </p>
        </div>
      )}

      <MetingFormulier showForm={showForm} />

      <div className="flex justify-end pt-6 pointer-events-none select-none opacity-25" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sprites/huisje.png" alt="" className="w-24 h-auto" style={{ transform: "rotate(-8deg)" }} />
      </div>
    </main>
  );
}
