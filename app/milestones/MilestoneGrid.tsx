"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDutchDate } from "@/lib/rho";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type Template = { emoji: string; title: string; category: string };
type Behaald = { title: string; date: string; emoji: string; photo_url: string | null; description: string | null };

interface Props {
  templates: Template[];
  behaald: Behaald[];
  isParent: boolean;
}

const CATEGORIES_ORDER = ["sociaal", "motorisch", "communicatie", "eten", "slapen", "speciaal"];
const CAT_LABELS: Record<string, string> = {
  sociaal: "Sociaal",
  motorisch: "Motorisch",
  communicatie: "Communicatie",
  eten: "Eten",
  slapen: "Slapen",
  speciaal: "Speciaal",
};

export function MilestoneGrid({ templates, behaald, isParent }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [activeModal, setActiveModal] = useState<Template | null>(null);
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [nota, setNota] = useState("");
  const [loading, setLoading] = useState(false);

  const behaaldMap = new Map(behaald.map((b) => [b.title, b]));

  async function aanvinken() {
    if (!activeModal) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("milestones").insert({
      title: activeModal.title,
      emoji: activeModal.emoji,
      date: datum,
      description: nota || null,
      created_by: user?.id,
    });
    setLoading(false);
    setActiveModal(null);
    setNota("");
    router.refresh();
  }

  const grouped = CATEGORIES_ORDER.map((cat) => ({
    cat,
    items: templates.filter((t) => t.category === cat),
  }));

  return (
    <>
      <div className="space-y-6">
        {grouped.map(({ cat, items }) => (
          <div key={cat}>
            <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-3">
              {CAT_LABELS[cat]}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {items.map((t) => {
                const gedaan = behaaldMap.get(t.title);
                return (
                  <button
                    key={t.title}
                    onClick={() => {
                      if (!gedaan && isParent) {
                        setActiveModal(t);
                        setDatum(new Date().toISOString().split("T")[0]);
                      }
                    }}
                    disabled={!!gedaan || !isParent}
                    className={`text-left rounded-xl p-3 border transition-all ${
                      gedaan
                        ? "bg-[var(--rho-gold)]/15 border-[var(--rho-gold)]/30"
                        : isParent
                        ? "bg-[var(--rho-cream)]/5 border-[var(--rho-cream)]/10 hover:bg-[var(--rho-cream)]/10 cursor-pointer"
                        : "bg-[var(--rho-cream)]/5 border-[var(--rho-cream)]/10 cursor-default"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl shrink-0">{t.emoji}</span>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-body leading-snug ${
                            gedaan ? "text-[var(--rho-cream)]" : "text-[var(--rho-cream)]/60"
                          }`}
                        >
                          {t.title}
                        </p>
                        {gedaan && (
                          <p className="text-[var(--rho-gold)] text-[10px] font-body mt-0.5">
                            ✓ {formatDutchDate(gedaan.date)}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 pb-6"
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeModal.emoji}</span>
              <h3 className="font-display text-lg text-[var(--rho-cream)] leading-snug">
                {activeModal.title}
              </h3>
            </div>

            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
                Wanneer was dit?
              </label>
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                className="w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
                Notitie (optioneel)
              </label>
              <textarea
                placeholder="Vertel er iets over..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={2}
                className="w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setActiveModal(null)}>
                Annuleer
              </Button>
              <Button variant="gold" className="flex-1" loading={loading} onClick={aanvinken}>
                Milestone behaald!
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
