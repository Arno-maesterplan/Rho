"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useNaam } from "@/lib/useNaam";
import { WONDER_WEEKS, getRhoAge } from "@/lib/rho";

interface Props {
  showForm: boolean;
}

// Preview via objectURL (werkt op alle browsers voor display)
// Upload via Supabase Storage
export function NieuweUpdate({ showForm }: Props) {
  const router = useRouter();
  const naam = useNaam();
  const supabase = createClient();

  const [open, setOpen] = useState(showForm);
  const [titel, setTitel] = useState("");
  const [tekst, setTekst] = useState("");
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [gelinkteSprong, setGelinkteSprong] = useState<number | null>(null);

  // Bewaar File objecten + preview URLs apart
  const [fotoFiles, setFotoFiles] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);

  const [fotoLoading, setFotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const { weeks } = getRhoAge();
  const relevanteSprongen = WONDER_WEEKS.filter((ww) => ww.weekStart <= weeks + 4);

  function onFotoKeuze(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fotoFiles.length >= 4) return;

    // Preview via objectURL — werkt altijd, ook voor HEIC op iOS
    const preview = URL.createObjectURL(file);
    setFotoFiles((prev) => [...prev, file]);
    setFotoPreviews((prev) => [...prev, preview]);
  }

  function fotoVerwijderen(i: number) {
    URL.revokeObjectURL(fotoPreviews[i]);
    setFotoFiles((prev) => prev.filter((_, j) => j !== i));
    setFotoPreviews((prev) => prev.filter((_, j) => j !== i));
  }

  async function plaatsen() {
    if (!tekst.trim()) return;
    setLoading(true);
    setFout(null);

    // Upload foto's naar Supabase Storage
    const fotoUrls: string[] = [];
    for (const file of fotoFiles) {
      const pad = `updates/${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(pad, file, { upsert: false });

      if (error) {
        // Storage werkt niet — sla op zonder foto's en toon melding
        setFout(`Foto's konden niet worden opgeslagen (${error.message}). Update wordt zonder foto's geplaatst.`);
        break;
      }
      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(data.path);
      fotoUrls.push(urlData.publicUrl);
    }

    const { error: insertError } = await supabase.from("updates").insert({
      title: titel.trim() || null,
      body: tekst.trim(),
      date: datum,
      photo_urls: fotoUrls.length > 0 ? fotoUrls : null,
      author_name: naam || "Onbekend",
      leap_number: gelinkteSprong,
    });

    setLoading(false);

    if (insertError) {
      setFout("Kon de update niet opslaan. Probeer opnieuw.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setTitel(""); setTekst("");
      setFotoFiles([]); setFotoPreviews([]);
      setDatum(new Date().toISOString().split("T")[0]);
      setGelinkteSprong(null);
      router.refresh();
    }, 1200);
  }

  const inputClass =
    "w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors";

  if (!open) {
    return (
      <Button variant="primary" className="w-full" onClick={() => setOpen(true)}>
        ✏️ Nieuwe update schrijven
      </Button>
    );
  }

  return (
    <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl p-5 space-y-4">
      <h2 className="font-display text-lg text-[var(--rho-cream)]">
        Nieuwe update{" "}
        {naam && (
          <span className="text-[var(--rho-cream)]/40 font-body text-sm font-normal">
            als {naam}
          </span>
        )}
      </h2>

      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Wanneer was dit?</label>
        <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Titel (optioneel)</label>
        <input type="text" placeholder="Bijv. Eerste glimlach vanmorgen!" value={titel} onChange={(e) => setTitel(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Vertel het aan de familie</label>
        <textarea placeholder="Wat wil je delen over Rho vandaag?" value={tekst} onChange={(e) => setTekst(e.target.value)} rows={4} className={`${inputClass} resize-none`} />
      </div>

      {relevanteSprongen.length > 0 && (
        <div>
          <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Gaat dit over een sprong? (optioneel)</label>
          <div className="flex flex-wrap gap-2">
            {relevanteSprongen.map((ww) => (
              <button
                key={ww.number}
                type="button"
                onClick={() => setGelinkteSprong(gelinkteSprong === ww.number ? null : ww.number)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                  gelinkteSprong === ww.number
                    ? "bg-[var(--rho-gold)] text-[var(--rho-red-dark)] border-[var(--rho-gold)]"
                    : "border-[var(--rho-cream)]/20 text-[var(--rho-cream)]/60 hover:border-[var(--rho-cream)]/40"
                }`}
              >
                <span>{ww.emoji}</span>
                <span>Sprong {ww.number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Foto's */}
      <div>
        <p className="text-[var(--rho-cream)]/60 text-xs font-body mb-2">Foto&apos;s (max 4)</p>
        <div className="flex flex-wrap gap-2">
          {fotoPreviews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 shrink-0">
              <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => fotoVerwijderen(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
              >×</button>
            </div>
          ))}

          {fotoFiles.length < 4 && (
            <label className="w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-[var(--rho-cream)]/20 flex flex-col items-center justify-center gap-1 text-[var(--rho-cream)]/40 cursor-pointer active:bg-[var(--rho-cream)]/5 transition-colors">
              <span className="text-xl leading-none">📷</span>
              <span className="text-[10px] font-body">{fotoFiles.length === 0 ? "Foto" : "+"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFotoKeuze}
                className="sr-only"
              />
            </label>
          )}
        </div>
      </div>

      {fout && (
        <p className="text-orange-300 text-xs font-body bg-orange-900/20 rounded-lg px-3 py-2">{fout}</p>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)} disabled={loading}>Annuleer</Button>
        <Button variant="primary" className="flex-1" loading={loading} onClick={plaatsen} disabled={!tekst.trim()}>
          {success ? "✓ Geplaatst!" : "Plaatsen"}
        </Button>
      </div>
    </div>
  );
}
