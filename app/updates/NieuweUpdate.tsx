"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useNaam } from "@/lib/useNaam";
import { WONDER_WEEKS, getRhoAge } from "@/lib/rho";

// Lees en comprimeer een foto — max 900px breed, 75% kwaliteit (~100-200KB)
function verwerkFoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Leesfout"));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Afbeeldingsfout"));
      img.onload = () => {
        const MAX = 900;
        const schaal = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * schaal);
        canvas.height = Math.round(img.height * schaal);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

interface Props {
  showForm: boolean;
}

export function NieuweUpdate({ showForm }: Props) {
  const router = useRouter();
  const naam = useNaam();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(showForm);
  const [titel, setTitel] = useState("");
  const [tekst, setTekst] = useState("");
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [gelinkteSprong, setGelinkteSprong] = useState<number | null>(null);
  const [fotoDataUrls, setFotoDataUrls] = useState<string[]>([]);
  const [fotoLoading, setFotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fotoFout, setFotoFout] = useState<string | null>(null);

  const { weeks } = getRhoAge();

  // Toon alleen sprongen die al begonnen zijn of binnenkort komen
  const relevanteSprongen = WONDER_WEEKS.filter(
    (ww) => ww.weekStart <= weeks + 4
  );

  async function onFotoKeuze(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoLoading(true);
    setFotoFout(null);
    try {
      const dataUrl = await verwerkFoto(file);
      setFotoDataUrls((prev) => [...prev, dataUrl].slice(0, 4));
    } catch (err) {
      console.error(err);
      setFotoFout("Foto kon niet worden geladen. Probeer een andere foto.");
    }
    setFotoLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function plaatsen() {
    if (!tekst.trim()) return;
    setLoading(true);

    const fotoUrls = fotoDataUrls;

    await supabase.from("updates").insert({
      title: titel.trim() || null,
      body: tekst.trim(),
      date: datum,
      photo_urls: fotoUrls.length > 0 ? fotoUrls : null,
      author_name: naam || "Onbekend",
      leap_number: gelinkteSprong,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setTitel(""); setTekst(""); setFotoDataUrls([]);
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

      {/* Datum */}
      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
          Wanneer was dit?
        </label>
        <input
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Titel */}
      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
          Titel (optioneel)
        </label>
        <input
          type="text"
          placeholder="Bijv. Eerste glimlach vanmorgen!"
          value={titel}
          onChange={(e) => setTitel(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Tekst */}
      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
          Vertel het aan de familie
        </label>
        <textarea
          placeholder="Wat wil je delen over Rho vandaag?"
          value={tekst}
          onChange={(e) => setTekst(e.target.value)}
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Link aan sprong */}
      {relevanteSprongen.length > 0 && (
        <div>
          <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
            Gaat dit over een sprong? (optioneel)
          </label>
          <div className="flex flex-wrap gap-2">
            {relevanteSprongen.map((ww) => (
              <button
                key={ww.number}
                type="button"
                onClick={() =>
                  setGelinkteSprong(gelinkteSprong === ww.number ? null : ww.number)
                }
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
          {gelinkteSprong && (
            <p className="text-[var(--rho-cream)]/40 text-xs font-body mt-1.5">
              ✦ Deze update verschijnt bij sprong {gelinkteSprong} op de tijdlijn
            </p>
          )}
        </div>
      )}

      {/* Foto's */}
      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
          Foto&apos;s (max 4)
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
          onChange={onFotoKeuze}
          className="hidden"
        />
        {/* Foto previews + toevoegen knop */}
        <div className="flex flex-wrap gap-2">
          {fotoDataUrls.map((src, i) => (
            <div key={i} className="relative w-20 h-20 shrink-0">
              <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => setFotoDataUrls(fotoDataUrls.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center leading-none"
              >×</button>
            </div>
          ))}

          {fotoDataUrls.length < 4 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={fotoLoading}
              className="w-20 h-20 shrink-0 rounded-xl border-2 border-dashed border-[var(--rho-cream)]/20 flex flex-col items-center justify-center gap-1 text-[var(--rho-cream)]/40 hover:border-[var(--rho-cream)]/40 hover:text-[var(--rho-cream)]/60 transition-colors disabled:opacity-40"
            >
              {fotoLoading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <>
                  <span className="text-xl leading-none">📷</span>
                  <span className="text-[10px] font-body">{fotoDataUrls.length === 0 ? "Foto" : "+"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {fotoFout && (
        <p className="text-red-300 text-xs font-body bg-red-900/20 rounded-lg px-3 py-2">
          {fotoFout}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)} disabled={loading}>
          Annuleer
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          loading={loading}
          onClick={plaatsen}
          disabled={!tekst.trim()}
        >
          {success ? "✓ Geplaatst!" : "Plaatsen"}
        </Button>
      </div>
    </div>
  );
}
