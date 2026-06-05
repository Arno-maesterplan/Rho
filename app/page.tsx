import { createClient } from "@/lib/supabase/server";
import { getRhoAge, getCurrentLeap, formatDutchDate } from "@/lib/rho";
import { differenceInDays } from "date-fns";
import { NaamWeergave } from "@/components/NaamWeergave";

export default async function Dashboard() {
  const supabase = createClient();

  const { weeks, days } = getRhoAge();
  const { activeLeap, nextLeap, isInStorm } = getCurrentLeap(weeks);

  const maanden = Math.floor(weeks / 4.33);
  const leeftijdLabel =
    maanden >= 2
      ? `${maanden} maanden oud`
      : maanden === 1
      ? `1 maand oud`
      : `${weeks} weken oud`;

  const daysUntilNext = nextLeap
    ? differenceInDays(new Date(nextLeap.dateStart), new Date())
    : null;

  const [{ data: lastMilestone }, { data: lastUpdate }] = await Promise.all([
    supabase
      .from("milestones")
      .select("title, emoji, date")
      .order("date", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("updates")
      .select("title, body, created_at, photo_urls")
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return (
    <main className="min-h-screen max-w-lg mx-auto px-5 py-8 space-y-5">
      {/* Header met krans */}
      <header className="relative text-center pt-8 pb-4 flex flex-col items-center">
        {/* Krans achtergrond */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/krans.png"
          alt=""
          aria-hidden="true"
          className="krans-animatie absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
          style={{ opacity: 0.15 }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body mb-1 fade-in-up fade-in-up-1">
            {formatDutchDate("2026-05-13")}
          </p>
          <h1 className="font-display text-6xl text-[var(--rho-cream)] leading-tight fade-in-up fade-in-up-2">Rho</h1>
          <p className="text-[var(--rho-cream)]/60 font-body text-sm mt-1 fade-in-up fade-in-up-3">
            {leeftijdLabel} — week {weeks}, dag {days}
          </p>
          <NaamWeergave />
        </div>
      </header>

      {/* Weer-kaart */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 ${
          isInStorm
            ? "bg-gradient-to-br from-[#2a1a2e] to-[#1a0d1e] border border-purple-900/40"
            : activeLeap
            ? "bg-gradient-to-br from-[#7a1a28] to-[var(--rho-red-dark)] border border-[var(--rho-cream)]/10"
            : "bg-gradient-to-br from-[#9B3a15] to-[#C8701E] border border-[var(--rho-gold)]/20"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          {isInStorm ? (
            <>
              <span className="absolute top-3 right-6 text-purple-300/20 text-2xl">⚡</span>
              <span className="absolute bottom-4 left-4 text-purple-300/10 text-4xl">☁️</span>
            </>
          ) : activeLeap ? (
            <span className="absolute top-2 right-4 text-[var(--rho-cream)]/10 text-5xl">🌙</span>
          ) : (
            <span className="absolute top-2 right-4 text-yellow-200/20 text-5xl">☀️</span>
          )}
        </div>

        {activeLeap ? (
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{isInStorm ? "⛈️" : activeLeap.emoji}</span>
              <span
                className={`text-xs font-body uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isInStorm
                    ? "bg-purple-500/20 text-purple-200"
                    : "bg-[var(--rho-cream)]/10 text-[var(--rho-cream)]/70"
                }`}
              >
                {isInStorm ? "Storm" : "Sprong in zicht"}
              </span>
            </div>
            <h2 className="font-display text-xl text-[var(--rho-cream)] leading-snug">
              Sprong {activeLeap.number}: {activeLeap.name}
            </h2>
            <p className="text-[var(--rho-cream)]/70 text-sm font-body leading-relaxed">
              {activeLeap.description}
            </p>
            {isInStorm && (
              <div className="mt-3 pt-3 border-t border-[var(--rho-cream)]/10 space-y-1">
                {activeLeap.tips.slice(0, 3).map((tip, i) => (
                  <p key={i} className="text-[var(--rho-gold)] text-sm font-body">✦ {tip}</p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">☀️</span>
              <span className="text-xs font-body uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--rho-gold)]/20 text-[var(--rho-gold)]">
                Zonneschijn
              </span>
            </div>
            <h2 className="font-display text-xl text-[var(--rho-cream)]">Rustige periode</h2>
            <p className="text-[var(--rho-cream)]/70 text-sm font-body">
              Rho zit tussen twee sprongen in. Geniet van de zonneschijn!
            </p>
          </div>
        )}
      </div>

      {/* Volgende sprong */}
      {nextLeap && daysUntilNext !== null && (
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl px-5 py-4 flex items-center gap-4">
          <span className="text-2xl">{nextLeap.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">
              Volgende sprong
            </p>
            <p className="text-[var(--rho-cream)] font-display text-base leading-snug truncate">
              {nextLeap.name}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-2xl text-[var(--rho-gold)]">
              {daysUntilNext > 0 ? daysUntilNext : 0}
            </p>
            <p className="text-[var(--rho-cream)]/40 text-xs font-body">
              {daysUntilNext === 1 ? "dag" : "dagen"}
            </p>
          </div>
        </div>
      )}

      {/* Laatste milestone */}
      {lastMilestone && (
        <a
          href="/milestones"
          className="flex items-center gap-3 bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl px-5 py-4 hover:bg-[var(--rho-cream)]/12 transition-colors"
        >
          <span className="text-2xl">{lastMilestone.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">
              Laatste milestone
            </p>
            <p className="text-[var(--rho-cream)] font-body text-sm font-medium truncate">
              {lastMilestone.title}
            </p>
            <p className="text-[var(--rho-cream)]/40 text-xs font-body">
              {formatDutchDate(lastMilestone.date)}
            </p>
          </div>
          <p className="text-[var(--rho-gold)] text-xs font-body shrink-0">→</p>
        </a>
      )}

      {/* Laatste update */}
      {lastUpdate && (
        <a
          href="/updates"
          className="block bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl overflow-hidden hover:bg-[var(--rho-cream)]/12 transition-colors"
        >
          {/* Foto bovenaan als die er is */}
          {lastUpdate.photo_urls && lastUpdate.photo_urls.length > 0 && (
            <div className="relative">
              <img
                src={lastUpdate.photo_urls[0]}
                alt=""
                className="w-full aspect-video object-cover"
              />
              {lastUpdate.photo_urls.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-body px-2 py-0.5 rounded-full">
                  +{lastUpdate.photo_urls.length - 1}
                </span>
              )}
            </div>
          )}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">
                Laatste update
              </p>
              <p className="text-[var(--rho-gold)] text-xs font-body">Lees meer →</p>
            </div>
            {lastUpdate.title && (
              <p className="text-[var(--rho-cream)] font-display text-base mb-1">{lastUpdate.title}</p>
            )}
            <p className="text-[var(--rho-cream)]/70 text-sm font-body line-clamp-2">{lastUpdate.body}</p>
            <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-2">
              {formatDutchDate(lastUpdate.created_at)}
            </p>
          </div>
        </a>
      )}

      {/* Snelle acties */}
      <div className="pt-2">
        <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-3">
          Snel toevoegen
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { href: "/updates?new=1", label: "Update", emoji: "✏️" },
            { href: "/milestones?new=1", label: "Milestone", emoji: "⭐" },
            { href: "/groei?new=1", label: "Meting", emoji: "📏" },
          ].map(({ href, label, emoji }) => (
            <a
              key={href}
              href={href}
              className="flex flex-col items-center gap-1.5 bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl py-4 hover:bg-[var(--rho-cream)]/12 transition-colors"
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-[var(--rho-cream)]/60 text-xs font-body">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
