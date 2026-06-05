import { createClient } from "@/lib/supabase/server";
import { getRhoAge, getCurrentLeap, formatDutchDate, WONDER_WEEKS, BIRTH_DATE } from "@/lib/rho";
import { differenceInDays, differenceInWeeks } from "date-fns";

type TijdlijnItem =
  | { type: "wonder_week"; datum: Date; data: (typeof WONDER_WEEKS)[number] }
  | { type: "milestone"; datum: Date; data: { title: string; emoji: string; description: string | null; author_name: string } }
  | { type: "update"; datum: Date; data: { id: string; title: string | null; body: string; photo_urls: string[] | null; author_name: string } };

export default async function TijdlijnPage() {
  const supabase = createClient();
  const { weeks } = getRhoAge();
  const { activeLeap, isInStorm } = getCurrentLeap(weeks);
  const today = new Date();

  const [{ data: milestones }, { data: updates }] = await Promise.all([
    supabase.from("milestones").select("title, emoji, date, description, author_name").order("date", { ascending: true }),
    supabase.from("updates").select("id, title, body, photo_urls, created_at, author_name").order("created_at", { ascending: true }),
  ]);

  // Bouw gecombineerde tijdlijn
  const items: TijdlijnItem[] = [];

  // Wonder Weeks als ankerpunten
  for (const ww of WONDER_WEEKS) {
    items.push({ type: "wonder_week", datum: new Date(ww.dateStart), data: ww });
  }

  // Milestones
  for (const m of milestones ?? []) {
    items.push({ type: "milestone", datum: new Date(m.date), data: m });
  }

  // Updates
  for (const u of updates ?? []) {
    items.push({ type: "update", datum: new Date(u.created_at), data: u });
  }

  // Sorteer op datum
  items.sort((a, b) => a.datum.getTime() - b.datum.getTime());

  function weekLabel(datum: Date) {
    const w = differenceInWeeks(datum, BIRTH_DATE);
    return `Week ${w}`;
  }

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8">
      <header className="mb-8">
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1">
          Het verhaal van Rho
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Tijdlijn</h1>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          Rho is nu {weeks} weken oud
        </p>
      </header>

      {/* Geboorte */}
      <div className="relative pl-16 pb-6">
        <div className="absolute left-4 top-1.5 w-5 h-5 rounded-full bg-[var(--rho-gold)] border-2 border-[var(--rho-gold)] flex items-center justify-center shadow-lg shadow-[var(--rho-gold)]/40">
          <span className="text-[8px]">★</span>
        </div>
        <div className="absolute left-[26px] top-6 bottom-0 w-px bg-[var(--rho-cream)]/10" />
        <div className="bg-gradient-to-br from-[var(--rho-gold)]/20 to-transparent border border-[var(--rho-gold)]/30 rounded-2xl p-4">
          <p className="text-[var(--rho-gold)] text-xs font-body uppercase tracking-wider">Geboorte</p>
          <h2 className="font-display text-xl text-[var(--rho-cream)] mt-0.5">Rho is geboren! 🎉</h2>
          <p className="text-[var(--rho-cream)]/60 text-xs font-body mt-1">
            {formatDutchDate("2026-05-13")}
          </p>
        </div>
      </div>

      {/* Tijdlijn items */}
      <div className="relative">
        <div className="absolute left-[26px] top-0 bottom-0 w-px bg-[var(--rho-cream)]/10" />

        <div className="space-y-2">
          {items.map((item, i) => {
            const isPast = item.datum <= today;
            const isFuture = item.datum > today;
            const daysUntil = differenceInDays(item.datum, today);

            if (item.type === "wonder_week") {
              const ww = item.data;
              const isCurrent = activeLeap?.number === ww.number;
              const isWWPast = new Date(ww.dateEnd) < today;

              return (
                <div key={`ww-${ww.number}`} className="relative pl-16 pb-4">
                  <div className={`absolute left-4 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] transition-all ${
                    isCurrent
                      ? "bg-[var(--rho-gold)] border-[var(--rho-gold)] scale-125 shadow-lg shadow-[var(--rho-gold)]/30"
                      : isWWPast
                      ? "bg-[var(--rho-cream)]/20 border-[var(--rho-cream)]/20"
                      : "bg-transparent border-[var(--rho-cream)]/15"
                  }`}>
                    {isWWPast && !isCurrent && <span className="text-[var(--rho-cream)]/40">✓</span>}
                  </div>

                  <div className={`rounded-xl p-3 border ${
                    isCurrent
                      ? isInStorm
                        ? "bg-gradient-to-br from-[#2a1a2e] to-[#1a0d1e] border-purple-700/40"
                        : "bg-[var(--rho-cream)]/10 border-[var(--rho-gold)]/30"
                      : isWWPast
                      ? "bg-[var(--rho-cream)]/3 border-[var(--rho-cream)]/6 opacity-50"
                      : "bg-[var(--rho-cream)]/4 border-[var(--rho-cream)]/8"
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base shrink-0">{ww.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-[var(--rho-cream)]/40 text-[10px] font-body">
                            Sprong {ww.number} · {weekLabel(item.datum)}
                          </p>
                          <p className="text-[var(--rho-cream)] font-display text-sm leading-snug truncate">
                            {ww.name}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {isCurrent && (
                          <span className={`text-[10px] font-body px-1.5 py-0.5 rounded-full ${isInStorm ? "bg-purple-500/20 text-purple-300" : "bg-[var(--rho-gold)]/20 text-[var(--rho-gold)]"}`}>
                            {isInStorm ? "⛈ Storm" : "Nu"}
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-[var(--rho-cream)]/25 text-[10px] font-body">
                            over {daysUntil}d
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[var(--rho-cream)]/40 text-[10px] font-body mt-1 ml-7">
                      {formatDutchDate(ww.dateStart)}
                    </p>
                    {isCurrent && (
                      <p className="text-[var(--rho-cream)]/60 text-xs font-body mt-2 ml-7 leading-relaxed">
                        {ww.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            if (item.type === "milestone") {
              const m = item.data;
              return (
                <div key={`m-${m.title}-${i}`} className="relative pl-16 pb-4">
                  <div className="absolute left-3.5 top-1 w-6 h-6 rounded-full bg-[var(--rho-gold)]/80 border-2 border-[var(--rho-gold)] flex items-center justify-center shadow-md shadow-[var(--rho-gold)]/20">
                    <span className="text-xs">{m.emoji}</span>
                  </div>
                  <div className="bg-[var(--rho-gold)]/10 border border-[var(--rho-gold)]/25 rounded-xl p-3">
                    <p className="text-[var(--rho-gold)] text-[10px] font-body uppercase tracking-wider">
                      Milestone · {weekLabel(item.datum)}
                    </p>
                    <p className="text-[var(--rho-cream)] font-display text-sm mt-0.5">{m.title}</p>
                    {m.description && (
                      <p className="text-[var(--rho-cream)]/60 text-xs font-body mt-1">{m.description}</p>
                    )}
                    <p className="text-[var(--rho-cream)]/30 text-[10px] font-body mt-1">
                      {formatDutchDate(item.datum)} {m.author_name ? `· ${m.author_name}` : ""}
                    </p>
                  </div>
                </div>
              );
            }

            if (item.type === "update") {
              const u = item.data;
              return (
                <div key={`u-${u.id}`} className="relative pl-16 pb-4">
                  <div className="absolute left-4 top-1.5 w-5 h-5 rounded-full bg-[var(--rho-cream)]/15 border-2 border-[var(--rho-cream)]/20 flex items-center justify-center">
                    <span className="text-[8px]">✍</span>
                  </div>
                  <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl overflow-hidden">
                    {u.photo_urls && u.photo_urls.length > 0 && (
                      <img src={u.photo_urls[0]} alt="" className="w-full aspect-video object-cover" />
                    )}
                    <div className="p-3">
                      <p className="text-[var(--rho-cream)]/40 text-[10px] font-body uppercase tracking-wider">
                        Update · {weekLabel(item.datum)}
                      </p>
                      {u.title && (
                        <p className="text-[var(--rho-cream)] font-display text-sm mt-0.5">{u.title}</p>
                      )}
                      <p className="text-[var(--rho-cream)]/70 text-xs font-body mt-1 line-clamp-3 leading-relaxed">
                        {u.body}
                      </p>
                      <p className="text-[var(--rho-cream)]/30 text-[10px] font-body mt-1">
                        {formatDutchDate(item.datum)} {u.author_name ? `· ${u.author_name}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Toekomst indicator */}
      <div className="relative pl-16 pt-2">
        <div className="absolute left-4 top-3 w-5 h-5 rounded-full border-2 border-dashed border-[var(--rho-cream)]/15" />
        <p className="text-[var(--rho-cream)]/25 text-xs font-body italic pt-1">
          Het verhaal gaat verder...
        </p>
      </div>
    </main>
  );
}
