import { createClient } from "@/lib/supabase/server";
import { UpdateFeed } from "./UpdateFeed";
import { LeeftijdRegel } from "@/components/LeeftijdRegel";
import { NieuweUpdate } from "./NieuweUpdate";

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const supabase = createClient();

  const { data: updates } = await supabase
    .from("updates")
    .select(`id, title, body, photo_urls, created_at, date, author_name, leap_number, reactions(id, message, created_at, author_name)`)
    .order("created_at", { ascending: false });

  const params = await searchParams;
  const showForm = params.new === "1";

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Familie dagboek
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Updates</h1>
        <LeeftijdRegel />
      </header>

      <NieuweUpdate showForm={showForm} />

      {(!updates || updates.length === 0) && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-[var(--rho-cream)]/40 font-body text-sm">
            Nog geen updates. Schrijf de eerste!
          </p>
        </div>
      )}

      {updates && updates.length > 0 && <UpdateFeed updates={updates as any} />}
    </main>
  );
}
