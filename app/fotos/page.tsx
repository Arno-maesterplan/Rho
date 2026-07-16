import { createClient } from "@/lib/supabase/server";
import { formatDutchDate } from "@/lib/rho";
import { LeeftijdRegel } from "@/components/LeeftijdRegel";
import { FotoUpload } from "./FotoUpload";

export const dynamic = "force-dynamic";

type Foto = {
  src: string;
  datum: string;
  label: string;
  auteur?: string;
};

export default async function FotosPage() {
  const supabase = createClient();

  const [{ data: updates }, { data: milestones }, { data: albumFiles }] = await Promise.all([
    supabase.from("updates").select("title, photo_urls, date, created_at, author_name"),
    supabase.from("milestones").select("title, photo_url, photo_urls, date, author_name"),
    supabase.storage.from("photos").list("album", { limit: 1000 }),
  ]);

  const fotos: Foto[] = [];

  // Losse albumfoto's — datum en naam zitten in de bestandsnaam
  for (const f of albumFiles ?? []) {
    const m = f.name.match(/^(\d{4}-\d{2}-\d{2})_([a-zA-Z0-9]*)_/);
    const { data: pub } = supabase.storage.from("photos").getPublicUrl(`album/${f.name}`);
    fotos.push({
      src: pub.publicUrl,
      datum: m?.[1] ?? f.created_at ?? new Date().toISOString(),
      label: "Foto",
      auteur: m?.[2] || undefined,
    });
  }

  for (const u of updates ?? []) {
    for (const src of u.photo_urls ?? []) {
      fotos.push({
        src,
        datum: u.date ?? u.created_at,
        label: u.title ?? "Update",
        auteur: u.author_name,
      });
    }
  }

  for (const m of milestones ?? []) {
    const lijst = m.photo_urls && m.photo_urls.length > 0 ? m.photo_urls : m.photo_url ? [m.photo_url] : [];
    for (const src of lijst) {
      fotos.push({ src, datum: m.date, label: m.title, auteur: m.author_name });
    }
  }

  // Nieuwste eerst
  fotos.sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());

  // Groepeer per datum
  const perDatum = new Map<string, Foto[]>();
  for (const f of fotos) {
    const dag = f.datum.split("T")[0];
    perDatum.set(dag, [...(perDatum.get(dag) ?? []), f]);
  }

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 pb-32">
      <header className="mb-8">
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Alle mooie momenten
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Foto&apos;s</h1>
        <LeeftijdRegel />
        <p className="text-[var(--rho-cream)]/40 text-xs font-body mt-1">
          {fotos.length} foto&apos;s · tik op een foto om ze groot te zien en op te slaan
        </p>
      </header>

      <FotoUpload />

      {fotos.length === 0 ? (
        <div className="text-center py-16 text-[var(--rho-cream)]/40 font-body">
          <p className="text-3xl mb-3">📷</p>
          <p>Nog geen foto&apos;s — voeg ze toe via updates of milestones!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(perDatum.entries()).map(([dag, dagFotos]) => (
            <section key={dag}>
              <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-2">
                {formatDutchDate(dag)}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {dagFotos.map((f, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={`${dag}-${i}`}
                    src={f.src}
                    alt={f.label}
                    title={`${f.label}${f.auteur ? ` · ${f.auteur}` : ""}`}
                    loading="lazy"
                    className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
