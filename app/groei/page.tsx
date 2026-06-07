import { createClient } from "@/lib/supabase/server";
import { GrowthTabs } from "./GrowthTabs";
import { MetingFormulier } from "./MetingFormulier";

export const dynamic = "force-dynamic";

export default async function GroeiPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const supabase = createClient();

  const { data: measurements } = await supabase
    .from("measurements")
    .select("*")
    .order("date", { ascending: true });

  const params = await searchParams;
  const showForm = params.new === "1";

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-4 space-y-2">
      <header className="text-center py-2">
        <h1 className="font-display text-3xl text-[var(--rho-cream)]">Growth</h1>
        <p className="text-[var(--rho-gold)] text-xs mt-0.5">Rho</p>
      </header>

      <GrowthTabs measurements={measurements ?? []} />

      {showForm && <MetingFormulier showForm={true} />}
    </main>
  );
}
