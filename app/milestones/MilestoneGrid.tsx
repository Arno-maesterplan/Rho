"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDutchDate } from "@/lib/rho";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useNaam } from "@/lib/useNaam";

type Template = { emoji: string; title: string; category: string };
type Behaald = {
  title: string;
  date: string;
  emoji: string;
  description: string | null;
  photo_url: string | null;
  photo_urls: string[] | null;
  author_name?: string;
};

interface Props {
  templates: Template[];
  behaald: Behaald[];
}

const CATEGORIES_ORDER = ["sociaal", "motorisch", "communicatie", "eten", "slapen", "speciaal"];
const CAT_LABELS: Record<string, string> = {
  sociaal: "Sociaal", motorisch: "Motorisch", communicatie: "Communicatie",
  eten: "Eten", slapen: "Slapen", speciaal: "Speciaal",
};

function comprimeerFoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    let afgerond = false;
    const timer = setTimeout(async () => {
      if (afgerond) return;
      afgerond = true;
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }, 4000);

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (afgerond) return;
      URL.revokeObjectURL(objectUrl);
      try {
        const MAX = 1000;
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const schaal = Math.min(1, MAX / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(w * schaal);
        canvas.height = Math.round(h * schaal);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("geen canvas context");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const result = canvas.toDataURL("image/jpeg", 0.78);
        clearTimeout(timer);
        afgerond = true;
        if (result.length > 5000) { resolve(result); }
        else {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }
      } catch {
        clearTimeout(timer); afgerond = true;
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    img.onerror = () => {
      if (afgerond) return;
      URL.revokeObjectURL(objectUrl); clearTimeout(timer); afgerond = true;
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    };
    img.src = objectUrl;
  });
}

export function MilestoneGrid({ templates, behaald }: Props) {
  const router = useRouter();
  const naam = useNaam();
  const supabase = createClient();

  const [activeModal, setActiveModal] = useState<Template | null>(null);
  const [editMilestone, setEditMilestone] = useState<Behaald | null>(null);
  const [viewMilestone, setViewMilestone] = useState<Behaald | null>(null);
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [nota, setNota] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [fotoLoading, setFotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bekeken, setBekeken] = useState<Behaald | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const behaaldMap = new Map(behaald.map((b) => [b.title, b]));

  // Haal alle fotos op (ondersteun zowel oud photo_url als nieuw photo_urls)
  function getFotos(b: Behaald): string[] {
    if (b.photo_urls && b.photo_urls.length > 0) return b.photo_urls;
    if (b.photo_url) return [b.photo_url];
    return [];
  }

  async function onFotoKeuze(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || fotos.length >= 4) return;
    setFotoLoading(true);
    const compressed = await comprimeerFoto(file);
    setFotos((prev) => [...prev, compressed].slice(0, 4));
    setFotoLoading(false);
  }

  async function aanvinken() {
    if (!activeModal) return;

    // Optimistic UI: show success and close immediately
    setSuccessMsg("✓ Milestone opgeslagen!");
    const toInsert = activeModal;

    setTimeout(() => {
      setActiveModal(null);
      setNota("");
      setFotos([]);
    }, 100);

    setLoading(true);
    console.log("📸 Milestone inserting:", {
      title: toInsert.title,
      fotos: fotos.length,
      datum,
    });
    const { error } = await supabase.from("milestones").insert({
      title: toInsert.title,
      emoji: toInsert.emoji,
      date: datum,
      description: nota || null,
      photo_urls: fotos.length > 0 ? fotos : null,
      photo_url: fotos.length > 0 ? fotos[0] : null,
      author_name: naam || "Onbekend",
    });
    setLoading(false);
    setSuccessMsg("");

    if (error) {
      console.error("❌ Milestone insert failed:", error);
      alert("Fout bij opslaan: " + (error.message || "Onbekend probleem"));
    } else {
      console.log("✅ Milestone opgeslagen!");
      router.refresh();
    }
  }

  async function bewerkOpslaan() {
    if (!editMilestone) return;

    // Optimistic UI: show success immediately
    setSuccessMsg("✓ Opgeslagen!");
    const toUpdate = editMilestone;

    // Close modal immediately
    setTimeout(() => {
      setEditMilestone(null);
      setNota("");
      setFotos([]);
      setBekeken(null);
    }, 100);

    setLoading(true);

    console.log("Milestone bewerken:", {
      title: toUpdate.title,
      datum,
      nota: nota || null,
      fotos: fotos.length,
    });

    const { error } = await supabase.from("milestones").update({
      date: datum,
      description: nota || null,
      photo_urls: fotos.length > 0 ? fotos : null,
      photo_url: fotos.length > 0 ? fotos[0] : null,
    }).eq("title", toUpdate.title);

    setLoading(false);
    setSuccessMsg("");

    if (error) {
      console.error("Milestone opslaan fout:", error);
    } else {
      console.log("✓ Milestone opgeslagen");
      router.refresh();
    }
  }

  async function deleteJaMilestone() {
    if (!editMilestone || !window.confirm("Milestone verwijderen? Dit kan niet ongedaan gemaakt worden.")) return;

    // Optimistic UI: close modal immediately
    const toDelete = editMilestone;
    setEditMilestone(null);
    setLoading(true);

    const { error } = await supabase.from("milestones").delete().eq("title", toDelete.title);
    setLoading(false);

    if (error) {
      console.error("Delete fout:", error);
      alert("Fout bij verwijderen - milestone is niet verwijderd");
    } else {
      console.log("✓ Milestone verwijderd");
      setEditMilestone(null);
      router.refresh();
    }
  }

  const inputClass = "w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors";
  const grouped = CATEGORIES_ORDER.map((cat) => ({ cat, items: templates.filter((t) => t.category === cat) }));

  return (
    <>
      <div className="space-y-6">
        {grouped.map(({ cat, items }) => (
          <div key={cat}>
            <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider mb-3">{CAT_LABELS[cat]}</p>
            <div className="grid grid-cols-2 gap-2">
              {items.map((t) => {
                const gedaan = behaaldMap.get(t.title);
                const fotolijst = gedaan ? getFotos(gedaan) : [];
                return (
                  <button
                    key={t.title}
                    onClick={() => {
                      if (gedaan) {
                        setViewMilestone(gedaan);
                      } else {
                        setActiveModal(t);
                        setDatum(new Date().toISOString().split("T")[0]);
                        setNota("");
                        setFotos([]);
                      }
                    }}
                    className={`text-left rounded-xl border transition-all overflow-hidden cursor-pointer ${
                      gedaan ? "bg-[var(--rho-gold)]/15 border-[var(--rho-gold)]/30 hover:bg-[var(--rho-gold)]/25" : "bg-[var(--rho-cream)]/5 border-[var(--rho-cream)]/10 hover:bg-[var(--rho-cream)]/10"
                    }`}
                  >
                    {fotolijst.length > 0 && (
                      <div className="relative">
                        <img src={fotolijst[0]} alt="" className="w-full aspect-video object-cover" />
                        {fotolijst.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] font-body px-1.5 py-0.5 rounded-full">+{fotolijst.length - 1}</span>
                        )}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xl shrink-0">{t.emoji}</span>
                        <div className="min-w-0">
                          <p className={`text-xs font-body leading-snug ${gedaan ? "text-[var(--rho-cream)]" : "text-[var(--rho-cream)]/60"}`}>{t.title}</p>
                          {gedaan && <p className="text-[var(--rho-gold)] text-[10px] font-body mt-0.5">✓ {formatDutchDate(gedaan.date)}</p>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: nieuwe milestone */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeModal.emoji}</span>
              <h3 className="font-display text-lg text-[var(--rho-cream)] leading-snug">{activeModal.title}</h3>
            </div>

            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Wanneer was dit?</label>
              <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Notitie (optioneel)</label>
              <textarea placeholder="Vertel er iets over..." value={nota} onChange={(e) => setNota(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            </div>

            {/* Foto's — max 4 */}
            <div className="space-y-2">
              <p className="text-[var(--rho-cream)]/60 text-xs font-body">Foto&apos;s ({fotos.length}/4)</p>
              {fotos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fotos.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 shrink-0">
                      <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                      <button type="button" onClick={() => setFotos((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center shadow-md">×</button>
                    </div>
                  ))}
                </div>
              )}
              {fotos.length < 4 && (
                <div className="relative">
                  <div className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--rho-cream)]/20 flex items-center justify-center gap-2 text-[var(--rho-cream)]/40 pointer-events-none">
                    {fotoLoading ? (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <>
                        <span className="text-lg">📷</span>
                        <span className="text-sm font-body">{fotos.length === 0 ? "Foto toevoegen" : `Nog ${4 - fotos.length} foto${4 - fotos.length > 1 ? "'s" : ""}`}</span>
                      </>
                    )}
                  </div>
                  <input key={fotos.length} type="file" accept="image/*" onChange={onFotoKeuze}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={fotoLoading} />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setActiveModal(null)} disabled={loading}>Annuleer</Button>
              <Button variant="gold" className="flex-1" loading={loading} onClick={aanvinken}>
                {successMsg || "Milestone behaald!"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: milestone weergeven (read-only) */}
      {viewMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6" onClick={(e) => e.target === e.currentTarget && setViewMilestone(null)}>
          <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{viewMilestone.emoji}</span>
              <h3 className="font-display text-lg text-[var(--rho-cream)] leading-snug">{viewMilestone.title}</h3>
            </div>

            <p className="text-[var(--rho-cream)]/70 text-sm">✓ {formatDutchDate(viewMilestone.date)}</p>

            {viewMilestone.description && <p className="text-[var(--rho-cream)]/60 text-sm">{viewMilestone.description}</p>}

            {/* Fotos read-only */}
            {getFotos(viewMilestone).length > 0 && (
              <div className="space-y-2">
                <p className="text-[var(--rho-cream)]/60 text-xs font-body">Foto&apos;s ({getFotos(viewMilestone).length})</p>
                <div className="flex flex-wrap gap-2">
                  {getFotos(viewMilestone).map((src, i) => (
                    <div key={i} className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-[var(--rho-cream)]/10">
              <Button variant="ghost" className="flex-1" onClick={() => setViewMilestone(null)}>Sluiten</Button>
              {/* Edit knop: only if viewer is creator or parent */}
              {(viewMilestone.author_name === naam || naam === "Mama" || naam === "Papa") && (
                <Button variant="gold" className="flex-1" onClick={() => {
                  setViewMilestone(null);
                  setEditMilestone(viewMilestone);
                  setDatum(viewMilestone.date);
                  setNota(viewMilestone.description || "");
                  setFotos(getFotos(viewMilestone));
                }}>Bewerk</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: milestone bewerken */}
      {editMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6" onClick={(e) => e.target === e.currentTarget && setEditMilestone(null)}>
          <div className="w-full max-w-sm bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="overflow-y-auto flex-1 space-y-4 pr-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{editMilestone.emoji}</span>
                <h3 className="font-display text-lg text-[var(--rho-cream)] leading-snug">{editMilestone.title}</h3>
              </div>

              <div>
                <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Datum</label>
                <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Notitie</label>
                <textarea placeholder="Notities..." value={nota} onChange={(e) => setNota(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              </div>

              <div className="space-y-2">
                <p className="text-[var(--rho-cream)]/60 text-xs font-body">Foto&apos;s ({fotos.length}/4)</p>
                {fotos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {fotos.map((src, i) => (
                      <div key={i} className="relative w-20 h-20 shrink-0">
                        <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                        <button type="button" onClick={() => setFotos((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center shadow-md">×</button>
                      </div>
                    ))}
                  </div>
                )}
                {fotos.length < 4 && (
                  <div className="relative">
                    <div className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--rho-cream)]/20 flex items-center justify-center gap-2 text-[var(--rho-cream)]/40 pointer-events-none">
                      {fotoLoading ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <>
                          <span className="text-lg">📷</span>
                          <span className="text-sm font-body">{fotos.length === 0 ? "Foto toevoegen" : `Nog ${4 - fotos.length} foto${4 - fotos.length > 1 ? "'s" : ""}`}</span>
                        </>
                      )}
                    </div>
                    <input key={fotos.length} type="file" accept="image/*" onChange={onFotoKeuze}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={fotoLoading} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-col-reverse border-t border-[var(--rho-cream)]/10 pt-4 mt-4">
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setEditMilestone(null)} disabled={loading}>Annuleer</Button>
                <Button variant="gold" className="flex-1" loading={loading} onClick={bewerkOpslaan}>
                  {successMsg || "Opslaan"}
                </Button>
              </div>
              <Button variant="ghost" className="w-full !text-red-400 hover:!text-red-300 text-sm py-2" onClick={deleteJaMilestone} disabled={loading}>
                🗑️ Milestone verwijderen
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
