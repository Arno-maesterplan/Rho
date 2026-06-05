import { createClient } from "@/lib/supabase/server";
import { getRhoAge, getCurrentLeap, formatDutchDate, WONDER_WEEKS, BIRTH_DATE } from "@/lib/rho";
import { differenceInDays, differenceInWeeks } from "date-fns";
import { TijdlijnClient } from "./TijdlijnClient";

type Update = {
  id: string;
  title: string | null;
  body: string;
  photo_urls: string[] | null;
  author_name: string;
  date: string | null;
  created_at: string;
  leap_number: number | null;
};

type Milestone = {
  title: string;
  emoji: string;
  date: string;
  description: string | null;
  author_name: string;
};

type TijdlijnItem =
  | { type: "wonder_week"; datum: Date; data: (typeof WONDER_WEEKS)[number]; updates: Update[] }
  | { type: "milestone"; datum: Date; data: Milestone }
  | { type: "update"; datum: Date; data: Update };

export default async function TijdlijnPage() {
  const supabase = createClient();
  const { weeks } = getRhoAge();
  const { activeLeap, isInStorm } = getCurrentLeap(weeks);
  const today = new Date();

  const [{ data: milestones }, { data: updates }] = await Promise.all([
    supabase.from("milestones").select("title, emoji, date, description, author_name").order("date", { ascending: true }),
    supabase.from("updates").select("id, title, body, photo_urls, created_at, date, author_name, leap_number").order("date", { ascending: true }),
  ]);

  // Splits updates: gelinkt aan sprong vs. vrij
  const gelinktAanSprong = new Map<number, Update[]>();
  const vrijeUpdates: Update[] = [];

  for (const u of updates ?? []) {
    if (u.leap_number) {
      const existing = gelinktAanSprong.get(u.leap_number) ?? [];
      gelinktAanSprong.set(u.leap_number, [...existing, u]);
    } else {
      vrijeUpdates.push(u);
    }
  }

  // Bouw tijdlijn
  const items: TijdlijnItem[] = [];

  for (const ww of WONDER_WEEKS) {
    items.push({
      type: "wonder_week",
      datum: new Date(ww.dateStart),
      data: ww,
      updates: gelinktAanSprong.get(ww.number) ?? [],
    });
  }

  for (const m of milestones ?? []) {
    items.push({ type: "milestone", datum: new Date(m.date), data: m });
  }

  for (const u of vrijeUpdates) {
    const d = u.date ?? u.created_at;
    items.push({ type: "update", datum: new Date(d), data: u });
  }

  items.sort((a, b) => a.datum.getTime() - b.datum.getTime());

  function weekLabel(datum: Date) {
    const w = differenceInWeeks(datum, BIRTH_DATE);
    return `Week ${w}`;
  }

  function effectieveDatum(u: Update) {
    return new Date(u.date ?? u.created_at);
  }

  return (
    <TijdlijnClient>
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
            {formatDutchDate("2026-05-13")} om 14:12
          </p>
        </div>
      </div>

      {/* Tijdlijn */}
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
              const heeftUpdates = item.updates.length > 0;

              return (
                <div
                  key={`ww-${ww.number}`}
                  className="relative pl-16 pb-4 cursor-pointer hover:opacity-80 transition-opacity"
                  data-sprong-num={ww.number}
                >
                  <div className={`absolute left-4 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] transition-all ${
                    isCurrent
                      ? "bg-[var(--rho-gold)] border-[var(--rho-gold)] scale-125 shadow-lg shadow-[var(--rho-gold)]/30"
                      : isWWPast
                      ? "bg-[var(--rho-cream)]/20 border-[var(--rho-cream)]/20"
                      : "bg-transparent border-[var(--rho-cream)]/15"
                  }`}>
                    {isWWPast && !isCurrent && <span className="text-[var(--rho-cream)]/40">✓</span>}
                  </div>

                  <div className={`rounded-xl border ${
                    isCurrent
                      ? isInStorm
                        ? "bg-gradient-to-br from-[#2a1a2e] to-[#1a0d1e] border-purple-700/40"
                        : "bg-[var(--rho-cream)]/10 border-[var(--rho-gold)]/30"
                      : isWWPast
                      ? "bg-[var(--rho-cream)]/3 border-[var(--rho-cream)]/6 opacity-60"
                      : "bg-[var(--rho-cream)]/4 border-[var(--rho-cream)]/8"
                  }`}>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{ww.emoji}</span>
                          <div className="min-w-0">
                            <p className="text-[var(--rho-cream)]/40 text-[10px] font-body">
                              Sprong {ww.number} · {weekLabel(item.datum)}
                            </p>
                            <p className="text-[var(--rho-cream)] font-display text-sm leading-snug">
                              {ww.name}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {isCurrent && (
                            <span className={`text-[10px] font-body px-1.5 py-0.5 rounded-full ${
                              isInStorm ? "bg-purple-500/20 text-purple-300" : "bg-[var(--rho-gold)]/20 text-[var(--rho-gold)]"
                            }`}>
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

                    {/* Gelinkte ervaringen */}
                    {heeftUpdates && (
                      <div className="border-t border-[var(--rho-cream)]/8 divide-y divide-[var(--rho-cream)]/5">
                        {item.updates.map((u) => (
                          <div key={u.id} className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-[var(--rho-gold)] text-[10px]">✦</span>
                              <span className="text-[var(--rho-cream)]/40 text-[10px] font-body">
                                {u.author_name} · {formatDutchDate(u.date ?? u.created_at)}
                              </span>
                            </div>
                            {u.title && (
                              <p className="text-[var(--rho-cream)] font-display text-sm ml-3.5">{u.title}</p>
                            )}
                            <p className="text-[var(--rho-cream)]/70 text-xs font-body ml-3.5 leading-relaxed line-clamp-3">
                              {u.body}
                            </p>
                          </div>
                        ))}
                      </div>
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
                      {formatDutchDate(item.datum)}{m.author_name ? ` · ${m.author_name}` : ""}
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
                        Update · {weekLabel(effectieveDatum(u))}
                      </p>
                      {u.title && (
                        <p className="text-[var(--rho-cream)] font-display text-sm mt-0.5">{u.title}</p>
                      )}
                      <p className="text-[var(--rho-cream)]/70 text-xs font-body mt-1 line-clamp-3 leading-relaxed">
                        {u.body}
                      </p>
                      <p className="text-[var(--rho-cream)]/30 text-[10px] font-body mt-1">
                        {formatDutchDate(effectieveDatum(u))}{u.author_name ? ` · ${u.author_name}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className="relative pl-16 pt-2">
        <div className="absolute left-4 top-3 w-5 h-5 rounded-full border-2 border-dashed border-[var(--rho-cream)]/15" />
        <p className="text-[var(--rho-cream)]/25 text-xs font-body italic pt-1">
          Het verhaal gaat verder...
        </p>
      </div>

      {/* Decoratieve kat rechtsonder */}
      <div className="flex justify-end pt-4 pb-2 pointer-events-none select-none opacity-30" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sprites/kat-lopend.png" alt="" className="w-24 h-auto" style={{ transform: "scaleX(-1) rotate(5deg)" }} />
      </div>
    </main>
    </TijdlijnClient>
  );
}
