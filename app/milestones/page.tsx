import { createClient } from "@/lib/supabase/server";
import { MILESTONE_TEMPLATES, CATEGORIES } from "@/lib/milestones";
import { formatDutchDate } from "@/lib/rho";
import { redirect } from "next/navigation";
import { MilestoneGrid } from "./MilestoneGrid";

export default async function MilestonesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: behaald } = await supabase
    .from("milestones")
    .select("title, date, emoji, photo_url, description")
    .order("date", { ascending: true });

  const behaaldTitels = new Set((behaald ?? []).map((m) => m.title));
  const isParent = profile?.role === "parent";

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Rho&apos;s eerste jaar
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Milestones</h1>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          {behaaldTitels.size} van {MILESTONE_TEMPLATES.length} behaald
        </p>
      </header>

      {/* Voortgangsbalk */}
      <div className="h-1.5 bg-[var(--rho-cream)]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--rho-gold)] rounded-full transition-all duration-700"
          style={{
            width: `${Math.round((behaaldTitels.size / MILESTONE_TEMPLATES.length) * 100)}%`,
          }}
        />
      </div>

      <MilestoneGrid
        templates={MILESTONE_TEMPLATES as any}
        behaald={behaald ?? []}
        isParent={isParent}
      />
    </main>
  );
}
