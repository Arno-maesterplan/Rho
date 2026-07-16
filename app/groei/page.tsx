import { LeeftijdRegel } from "@/components/LeeftijdRegel";
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
    <main className="min-h-screen max-w-lg mx-auto px-5 py-6 space-y-3">
      <header className="text-center py-3">
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Growth</h1>
        <LeeftijdRegel />
      </header>

      <GrowthTabs measurements={measurements ?? []} />

      {showForm && <MetingFormulier showForm={true} />}
    </main>
  );
}
