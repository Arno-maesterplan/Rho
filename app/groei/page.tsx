import { createClient } from "@/lib/supabase/server";
import { formatDutchDate } from "@/lib/rho";
import { redirect } from "next/navigation";
import { GroeiGrafiek } from "./GroeiGrafiek";
import { MetingFormulier } from "./MetingFormulier";

export default async function GroeiPage({
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
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: metingen } = await supabase
    .from("measurements")
    .select("*")
    .order("date", { ascending: true });

  const isParent = profile?.role === "parent";
  const params = await searchParams;
  const showForm = isParent && params.new === "1";

  const laatste = metingen && metingen.length > 0 ? metingen[metingen.length - 1] : null;

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-6">
      <header>
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          WHO groeicurves
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Groei</h1>
      </header>

      {/* Laatste meting samenvatting */}
      {laatste && (
        <div className="grid grid-cols-3 gap-3">
          {laatste.weight_grams && (
            <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-[var(--rho-cream)]">
                {(laatste.weight_grams / 1000).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-[var(--rho-cream)]/40 text-xs font-body">kg</p>
            </div>
          )}
          {laatste.height_mm && (
            <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-[var(--rho-cream)]">
                {(laatste.height_mm / 10).toFixed(1).replace(".", ",")}
              </p>
              <p className="text-[var(--rho-cream)]/40 text-xs font-body">cm</p>
            </div>
          )}
          {laatste.head_cm && (
            <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-4 text-center">
              <p className="font-display text-2xl text-[var(--rho-cream)]">
                {Number(laatste.head_cm).toFixed(1).replace(".", ",")}
              </p>
              <p className="text-[var(--rho-cream)]/40 text-xs font-body">cm hoofd</p>
            </div>
          )}
        </div>
      )}

      {/* Grafiek */}
      {metingen && metingen.length > 1 && (
        <GroeiGrafiek metingen={metingen} />
      )}

      {metingen && metingen.length <= 1 && (
        <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-8 text-center">
          <p className="text-[var(--rho-cream)]/40 font-body text-sm">
            Voeg metingen toe om de groeicurve te zien.
          </p>
        </div>
      )}

      {/* Formulier voor ouders */}
      {isParent && <MetingFormulier showForm={showForm} />}

      {/* Tabel van laatste metingen */}
      {metingen && metingen.length > 0 && (
        <div>
          <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-3">
            Alle metingen
          </p>
          <div className="space-y-2">
            {[...metingen].reverse().slice(0, 10).map((m) => (
              <div
                key={m.id}
                className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <p className="text-[var(--rho-cream)]/60 text-sm font-body">
                  {formatDutchDate(m.date)}
                </p>
                <div className="flex gap-4 text-right">
                  {m.weight_grams && (
                    <div>
                      <p className="text-[var(--rho-cream)] text-sm font-body">
                        {(m.weight_grams / 1000).toFixed(2).replace(".", ",")} kg
                      </p>
                    </div>
                  )}
                  {m.height_mm && (
                    <div>
                      <p className="text-[var(--rho-cream)] text-sm font-body">
                        {(m.height_mm / 10).toFixed(1).replace(".", ",")} cm
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
