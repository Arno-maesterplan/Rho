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

// Lees bestand als data URL via FileReader (altijd betrouwbaar)
function leesDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Comprimeer via canvas, met timeout + FileReader als fallback
function comprimeerFoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    let afgerond = false;

    // Fallback: na 4 seconden gewoon de raw data URL gebruiken
    const timer = setTimeout(async () => {
      if (afgerond) return;
      afgerond = true;
      resolve(await leesDataUrl(file));
    }, 4000);

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      if (afgerond) return;
      URL.revokeObjectURL(objectUrl);
      try {
        const MAX = 1000;
        const w = img.naturalWidth  || img.width;
        const h = img.naturalHeight || img.height;
        const schaal = Math.min(1, MAX / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(w * schaal);
        canvas.height = Math.round(h * schaal);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("geen canvas context");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const result = canvas.toDataURL("image/jpeg", 0.78);
        clearTimeout(timer);
        afgerond = true;
        // Controleer of canvas iets heeft geproduceerd (niet leeg)
        resolve(result.length > 5000 ? result : leesDataUrl(file) as any);
      } catch {
        clearTimeout(timer);
        afgerond = true;
        leesDataUrl(file).then(resolve);
      }
    };

    img.onerror = () => {
      if (afgerond) return;
      URL.revokeObjectURL(objectUrl);
      clearTimeout(timer);
      afgerond = true;
      leesDataUrl(file).then(resolve);
    };

    img.src = objectUrl;
  });
}

export function NieuweUpdate({ showForm }: Props) {
  const router = useRouter();
  const naam = useNaam();
  const supabase = createClient();

  const [open, setOpen] = useState(showForm);
  const [titel, setTitel] = useState("");
  const [tekst, setTekst] = useState("");
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [gelinkteSprong, setGelinkteSprong] = useState<number | null>(null);

  const [fotos, setFotos] = useState<string[]>([]); // base64 data URLs
  const [fotoLoading, setFotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const { weeks } = getRhoAge();
  const relevanteSprongen = WONDER_WEEKS.filter((ww) => ww.weekStart <= weeks + 4);

  async function onFotoKeuze(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || fotos.length >= 4) return;
    setFotoLoading(true);
    setFout(null);
    try {
      const compressed = await comprimeerFoto(file);
      setFotos((prev) => [...prev, compressed].slice(0, 4));
    } catch (err) {
      setFout("Foto kon niet worden geladen.");
      console.error(err);
    }
    setFotoLoading(false);
  }

  async function plaatsen() {
    if (!tekst.trim()) return;
    setLoading(true);
    setFout(null);

    const { error } = await supabase.from("updates").insert({
      title: titel.trim() || null,
      body: tekst.trim(),
      date: datum,
      photo_urls: fotos.length > 0 ? fotos : null,
      author_name: naam || "Onbekend",
      leap_number: gelinkteSprong,
    });

    setLoading(false);

    if (error) {
      setFout(`Kon niet opslaan: ${error.message}`);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setTitel(""); setTekst(""); setFotos([]);
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
        {naam && <span className="text-[var(--rho-cream)]/40 font-body text-sm font-normal">als {naam}</span>}
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
              <button key={ww.number} type="button"
                onClick={() => setGelinkteSprong(gelinkteSprong === ww.number ? null : ww.number)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                  gelinkteSprong === ww.number
                    ? "bg-[var(--rho-gold)] text-[var(--rho-red-dark)] border-[var(--rho-gold)]"
                    : "border-[var(--rho-cream)]/20 text-[var(--rho-cream)]/60 hover:border-[var(--rho-cream)]/40"
                }`}>
                <span>{ww.emoji}</span><span>Sprong {ww.number}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Foto's */}
      <div className="space-y-2">
        <p className="text-[var(--rho-cream)]/60 text-xs font-body">Foto&apos;s ({fotos.length}/4)</p>

        {fotos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fotos.map((src, i) => (
              <div key={i} className="relative w-24 h-24 shrink-0">
                <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
                <button type="button" onClick={() => setFotos((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm flex items-center justify-center shadow-md">×</button>
              </div>
            ))}
          </div>
        )}

        {fotos.length < 4 && (
          <div className="relative">
            <div className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--rho-cream)]/25 flex items-center justify-center gap-2 text-[var(--rho-cream)]/50 pointer-events-none">
              {fotoLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <>
                  <span className="text-xl">📷</span>
                  <span className="text-sm font-body">
                    {fotos.length === 0 ? "Foto toevoegen" : `Nog ${4 - fotos.length} foto${4 - fotos.length > 1 ? "'s" : ""} toevoegen`}
                  </span>
                </>
              )}
            </div>
            <input key={fotos.length} type="file" accept="image/*" onChange={onFotoKeuze}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={fotoLoading} />
          </div>
        )}
      </div>

      {fout && (
        <p className="text-red-300 text-xs font-body bg-red-900/20 rounded-lg px-3 py-2">{fout}</p>
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
