import { LeeftijdRegel } from "@/components/LeeftijdRegel";
import { createClient } from "@/lib/supabase/server";
import { MILESTONE_TEMPLATES } from "@/lib/milestones";
import { MilestoneGrid } from "./MilestoneGrid";

export const dynamic = "force-dynamic";

export default async function MilestonesPage() {
  const supabase = createClient();

  const { data: behaald } = await supabase
    .from("milestones")
    .select("id, title, date, emoji, description, photo_url, photo_urls, author_name")
    .order("date", { ascending: true });

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6 pb-32">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Rho&apos;s eerste jaar
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Milestones</h1>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          {(behaald ?? []).length} van {MILESTONE_TEMPLATES.length} behaald
        </p>
        <LeeftijdRegel />
      </header>

      <div className="h-1.5 bg-[var(--rho-cream)]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--rho-gold)] rounded-full transition-all duration-700"
          style={{ width: `${Math.round(((behaald ?? []).length / MILESTONE_TEMPLATES.length) * 100)}%` }}
        />
      </div>

      <MilestoneGrid templates={MILESTONE_TEMPLATES as any} behaald={behaald ?? []} />
    </main>
  );
}
