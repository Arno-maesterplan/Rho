import { createClient } from "@/lib/supabase/server";
import { getRhoAge, getCurrentLeap, formatDutchDate } from "@/lib/rho";
import { Card } from "@/components/Card";
import { redirect } from "next/navigation";

export default async function Dashboard() {
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

  const { weeks, days } = getRhoAge();
  const { activeLeap, nextLeap, isInStorm } = getCurrentLeap(weeks);

  const maanden = Math.floor(weeks / 4);
  const restWeken = weeks % 4;

  return (
    <main className="min-h-screen px-6 py-10 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1 pt-4">
        <p className="text-[var(--rho-gold)] text-xs tracking-widest uppercase font-body">
          Welkom, {profile?.name ?? user.email}
        </p>
        <h1 className="font-display text-4xl text-[var(--rho-cream)]">Rho</h1>
        <p className="text-[var(--rho-cream)]/60 text-xs font-body">
          Geboren op {formatDutchDate("2025-05-13")}
        </p>
      </div>

      {/* Leeftijd */}
      <Card>
        <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider mb-2">
          Hoe oud is Rho?
        </p>
        <p className="font-display text-3xl text-[var(--rho-cream)]">
          {maanden > 0 ? `${maanden} maand${maanden > 1 ? "en" : ""}` : ""}{" "}
          {restWeken > 0 ? `${restWeken} week${restWeken > 1 ? "en" : ""}` : ""}
          {maanden === 0 && restWeken === 0 ? `${days} dag${days > 1 ? "en" : ""}` : ""}
        </p>
        <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
          Week {weeks} — {days} dag{days !== 1 ? "en" : ""} in deze week
        </p>
      </Card>

      {/* Huidige sprong */}
      {activeLeap ? (
        <Card className={isInStorm ? "border-[var(--rho-gold)]/40" : ""}>
          <div className="flex items-start gap-4">
            <span className="text-3xl">{isInStorm ? "⛈️" : activeLeap.emoji}</span>
            <div className="space-y-1">
              <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider">
                {isInStorm ? "Nu in storm" : "Sprong in zicht"}
              </p>
              <h2 className="font-display text-lg text-[var(--rho-cream)]">
                Sprong {activeLeap.number}: {activeLeap.name}
              </h2>
              <p className="text-[var(--rho-cream)]/70 text-sm font-body leading-relaxed">
                {activeLeap.description}
              </p>
              {isInStorm && (
                <div className="mt-3 space-y-1">
                  {activeLeap.tips.slice(0, 2).map((tip, i) => (
                    <p key={i} className="text-[var(--rho-gold)] text-xs font-body">
                      ✦ {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex items-start gap-4">
            <span className="text-3xl">✨</span>
            <div>
              <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider">
                Rustige periode
              </p>
              <p className="text-[var(--rho-cream)]/80 text-sm font-body mt-1">
                Rho zit momenteel tussen twee sprongen in. Geniet van de zonneschijn!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Volgende sprong */}
      {nextLeap && (
        <Card>
          <p className="text-[var(--rho-cream)]/60 text-xs font-body uppercase tracking-wider mb-2">
            Volgende sprong
          </p>
          <p className="font-display text-lg text-[var(--rho-cream)]">
            {nextLeap.emoji} Sprong {nextLeap.number}: {nextLeap.name}
          </p>
          <p className="text-[var(--rho-cream)]/50 text-sm font-body mt-1">
            Verwacht vanaf week {nextLeap.weekStart} — {formatDutchDate(nextLeap.dateStart)}
          </p>
        </Card>
      )}

      {/* Navigatie */}
      <nav className="grid grid-cols-2 gap-3 pt-2">
        {[
          { href: "/tijdlijn", label: "Tijdlijn", emoji: "📅" },
          { href: "/groei", label: "Groei", emoji: "📈" },
          { href: "/milestones", label: "Milestones", emoji: "⭐" },
          { href: "/updates", label: "Updates", emoji: "💬" },
        ].map(({ href, label, emoji }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl p-4 hover:bg-[var(--rho-cream)]/15 transition-colors"
          >
            <span className="text-xl">{emoji}</span>
            <span className="font-body text-sm text-[var(--rho-cream)]">{label}</span>
          </a>
        ))}
      </nav>

      {/* Uitloggen */}
      <form action="/api/auth/signout" method="post" className="text-center pt-2">
        <button
          type="submit"
          className="text-[var(--rho-cream)]/30 text-xs font-body hover:text-[var(--rho-cream)]/60 transition-colors"
        >
          Uitloggen
        </button>
      </form>
    </main>
  );
}
