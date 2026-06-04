import { createClient } from "@/lib/supabase/server";
import { formatDutchDate } from "@/lib/rho";
import { redirect } from "next/navigation";
import { UpdateFeed } from "./UpdateFeed";
import { NieuweUpdate } from "./NieuweUpdate";

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .single();

  const { data: updates } = await supabase
    .from("updates")
    .select(
      `
      id, title, body, photo_urls, created_at,
      profiles!updates_created_by_fkey(name, avatar_url),
      reactions(id, message, created_at, profiles!reactions_author_id_fkey(name, avatar_url))
    `
    )
    .order("created_at", { ascending: false });

  const isParent = profile?.role === "parent";
  const params = await searchParams;
  const showForm = isParent && params.new === "1";

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
            Familie dagboek
          </p>
          <h1 className="font-display text-4xl text-[var(--rho-cream)]">Updates</h1>
        </div>
      </header>

      {isParent && <NieuweUpdate showForm={showForm} />}

      {(!updates || updates.length === 0) && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✍️</p>
          <p className="text-[var(--rho-cream)]/40 font-body text-sm">
            Nog geen updates. Schrijf de eerste!
          </p>
        </div>
      )}

      {updates && updates.length > 0 && (
        <UpdateFeed updates={updates as any} currentUserId={user.id} />
      )}
    </main>
  );
}
