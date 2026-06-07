"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/Avatar";
import { formatDutchDate } from "@/lib/rho";
import { useRouter } from "next/navigation";
import { useNaam } from "@/lib/useNaam";
import { WONDER_WEEKS, getRhoAge } from "@/lib/rho";
import { Button } from "@/components/Button";
import { CommentSection } from "@/app/components/CommentSection";

function leesDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function comprimeerFoto(file: File): Promise<string> {
  return new Promise((resolve) => {
    let afgerond = false;
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

type Reactie = { id: string; message: string; created_at: string; author_name: string };
type Update = {
  id: string;
  title: string | null;
  body: string;
  photo_urls: string[] | null;
  created_at: string;
  date: string | null;
  author_name: string;
  leap_number: number | null;
  reactions: Reactie[];
};

export function UpdateFeed({ updates }: { updates: Update[] }) {
  return (
    <div className="space-y-6">
      {updates.map((u) => <UpdateKaart key={u.id} update={u} />)}
    </div>
  );
}

function UpdateKaart({ update }: { update: Update }) {
  const router = useRouter();
  const naam = useNaam();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [reactie, setReactie] = useState("");
  const [reactieLoading, setReactieLoading] = useState(false);
  const [showReacties, setShowReacties] = useState(false);

  const [bewerkModus, setBewerkModus] = useState(false);
  const [bewerkTitel, setBewerkTitel] = useState(update.title ?? "");
  const [bewerkTekst, setBewerkTekst] = useState(update.body);
  const [bewerkDatum, setBewerkDatum] = useState(update.date ?? update.created_at.split("T")[0]);
  const [bewerkSprong, setBewerkSprong] = useState<number | null>(update.leap_number);
  const [bewerkFotos, setBewerkFotos] = useState<string[]>(update.photo_urls ?? []);
  const [nieuwefotos, setNieuwefotos] = useState<File[]>([]);
  const [nieuwePreviews, setNieuwePreviews] = useState<string[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveBericht, setSaveBericht] = useState<string | null>(null);

  const { weeks } = getRhoAge();
  const relevanteSprongen = WONDER_WEEKS.filter((ww) => ww.weekStart <= weeks + 4);

  const isOuder = naam === "Arno" || naam === "Céline";
  const isEigenUpdate = !update.author_name || update.author_name === naam || isOuder;
  const magVerwijderen = isOuder || update.author_name === naam;

  const [verwijderBevestig, setVerwijderBevestig] = useState(false);
  const [verwijderLoading, setVerwijderLoading] = useState(false);

  async function verwijderen() {
    setVerwijderLoading(true);
    await supabase.from("updates").delete().eq("id", update.id);
    setVerwijderLoading(false);
    setVerwijderBevestig(false);
    router.refresh();
  }

  async function onNieuweFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await comprimeerFoto(file);
      setNieuwefotos((prev) => [...prev, file]);
      setNieuwePreviews((prev) => [...prev, dataUrl]);
    } catch {
      console.error("Foto laden mislukt");
    }
  }

  function fotoVerwijderen(url: string) {
    setBewerkFotos(bewerkFotos.filter((u) => u !== url));
  }

  async function opslaan() {
    setSaveLoading(true);

    const geuploadUrls: string[] = [];
    for (const foto of nieuwefotos) {
      try {
        const dataUrl = await comprimeerFoto(foto);
        geuploadUrls.push(dataUrl);
      } catch (e) {
        console.error("Foto laden mislukt:", e);
      }
    }

    const allefotos = [...bewerkFotos, ...geuploadUrls];

    console.log("Update verzenden:", {
      id: update.id,
      title: bewerkTitel.trim() || null,
      body: bewerkTekst.trim(),
      date: bewerkDatum,
      fotos: allefotos.length,
    });

    const { error } = await supabase.from("updates").update({
      title: bewerkTitel.trim() || null,
      body: bewerkTekst.trim(),
      date: bewerkDatum,
      photo_urls: allefotos.length > 0 ? allefotos : null,
      leap_number: bewerkSprong,
    }).eq("id", update.id);

    setSaveLoading(false);

    if (error) {
      console.error("Supabase fout:", error);
      setSaveBericht("Fout bij opslaan!");
      setTimeout(() => setSaveBericht(null), 3000);
    } else {
      // Sluit bewerk modus en reset alles
      setSaveBericht("✓ Opgeslagen!");
      setTimeout(() => setSaveBericht(null), 2000);
      setTimeout(() => {
        setBewerkModus(false);
        setNieuwefotos([]);
        setNieuwePreviews([]);
        router.refresh();
      }, 500);
    }
  }

  async function stuurReactie() {
    if (!reactie.trim()) return;
    setReactieLoading(true);
    await supabase.from("reactions").insert({
      update_id: update.id,
      message: reactie.trim(),
      author_name: naam || "Onbekend",
    });
    setReactie("");
    setReactieLoading(false);
    router.refresh();
  }

  const inputClass =
    "w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors";

  // --- Bewerkmodus ---
  if (bewerkModus) {
    return (
      <article className="bg-[var(--rho-cream)]/8 border border-[var(--rho-gold)]/30 rounded-2xl p-5 space-y-4">
        <h3 className="font-display text-lg text-[var(--rho-cream)]">Update bewerken</h3>

        <div>
          <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Datum</label>
          <input type="date" value={bewerkDatum} onChange={(e) => setBewerkDatum(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Titel (optioneel)</label>
          <input type="text" value={bewerkTitel} onChange={(e) => setBewerkTitel(e.target.value)} placeholder="Titel..." className={inputClass} />
        </div>

        <div>
          <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Tekst</label>
          <textarea value={bewerkTekst} onChange={(e) => setBewerkTekst(e.target.value)} rows={5} className={`${inputClass} resize-none`} />
        </div>

        {/* Sprong koppeling */}
        {relevanteSprongen.length > 0 && (
          <div>
            <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Gaat dit over een sprong?</label>
            <div className="flex flex-wrap gap-2">
              {relevanteSprongen.map((ww) => (
                <button
                  key={ww.number}
                  type="button"
                  onClick={() => setBewerkSprong(bewerkSprong === ww.number ? null : ww.number)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                    bewerkSprong === ww.number
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

        {/* Huidige foto's */}
        {bewerkFotos.length > 0 && (
          <div>
            <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">Huidige foto&apos;s</label>
            <div className="grid grid-cols-4 gap-2">
              {bewerkFotos.map((url) => (
                <div key={url} className="relative">
                  <img src={url} alt="" className="aspect-square object-cover rounded-lg" />
                  <button
                    onClick={() => fotoVerwijderen(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nieuwe foto's toevoegen */}
        {bewerkFotos.length + nieuwefotos.length < 4 && (
          <div>
            <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
              Foto&apos;s toevoegen {bewerkFotos.length > 0 ? `(nog ${4 - bewerkFotos.length} mogelijk)` : ""}
            </label>
            {nieuwePreviews.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {nieuwePreviews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg" />
                ))}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-lg border-2 border-dashed border-[var(--rho-cream)]/20 flex items-center justify-center text-[var(--rho-cream)]/40 pointer-events-none">+</div>
                  <input key={nieuwePreviews.length} type="file" accept="image/*" onChange={onNieuweFoto} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-full border border-dashed border-[var(--rho-cream)]/20 rounded-xl py-4 flex items-center justify-center gap-2 text-[var(--rho-cream)]/30 pointer-events-none text-sm font-body">
                  <span>📷</span> Foto&apos;s toevoegen
                </div>
                <input key={nieuwePreviews.length} type="file" accept="image/*" onChange={onNieuweFoto} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            )}
          </div>
        )}

        {saveBericht && (
          <div className={`text-center text-sm font-body py-2 px-3 rounded-lg ${
            saveBericht.includes("Fout")
              ? "bg-red-900/20 text-red-300"
              : "bg-[var(--rho-gold)]/20 text-[var(--rho-gold)]"
          }`}>
            {saveBericht}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => { setBewerkModus(false); setNieuwefotos([]); setNieuwePreviews([]); }}>
            Annuleer
          </Button>
          <Button variant="primary" className="flex-1" loading={saveLoading} onClick={opslaan} disabled={!bewerkTekst.trim()}>
            Opslaan
          </Button>
        </div>
      </article>
    );
  }

  // --- Normale weergave ---
  return (
    <article className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl overflow-hidden">
      {update.photo_urls && update.photo_urls.length > 0 && (
        <div className={`grid gap-0.5 ${update.photo_urls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {update.photo_urls.slice(0, 4).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className={`w-full object-cover ${update.photo_urls!.length === 1 ? "aspect-[4/3]" : "aspect-square"} ${update.photo_urls!.length === 3 && i === 0 ? "col-span-2" : ""}`}
            />
          ))}
        </div>
      )}

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={update.author_name ?? "?"} size="sm" />
            <div>
              <p className="text-[var(--rho-cream)] text-sm font-body font-medium">{update.author_name ?? "Onbekend"}</p>
              <p className="text-[var(--rho-cream)]/40 text-xs font-body">{formatDutchDate(update.date ?? update.created_at)}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {isEigenUpdate && (
              <button
                onClick={() => setBewerkModus(true)}
                className="text-[var(--rho-cream)]/25 hover:text-[var(--rho-cream)]/60 text-xs font-body transition-colors px-2 py-1 rounded-lg hover:bg-[var(--rho-cream)]/5"
              >
                ✏️
              </button>
            )}
            {magVerwijderen && !verwijderBevestig && (
              <button
                onClick={() => setVerwijderBevestig(true)}
                className="text-[var(--rho-cream)]/25 hover:text-red-400 text-xs font-body transition-colors px-2 py-1 rounded-lg hover:bg-red-900/20"
              >
                🗑️
              </button>
            )}
            {verwijderBevestig && (
              <div className="flex items-center gap-1">
                <span className="text-[var(--rho-cream)]/50 text-xs font-body">Zeker?</span>
                <button
                  onClick={verwijderen}
                  disabled={verwijderLoading}
                  className="text-red-400 text-xs font-body px-2 py-1 rounded-lg bg-red-900/20 hover:bg-red-900/40 transition-colors"
                >
                  {verwijderLoading ? "..." : "Ja"}
                </button>
                <button
                  onClick={() => setVerwijderBevestig(false)}
                  className="text-[var(--rho-cream)]/40 text-xs font-body px-2 py-1"
                >
                  Nee
                </button>
              </div>
            )}
          </div>
        </div>

        {update.title && (
          <h3 className="font-display text-lg text-[var(--rho-cream)] leading-snug">{update.title}</h3>
        )}
        <p className="text-[var(--rho-cream)]/80 text-sm font-body leading-relaxed whitespace-pre-wrap">{update.body}</p>

        {update.leap_number && (
          <p className="text-[var(--rho-cream)]/30 text-xs font-body">
            {WONDER_WEEKS.find(w => w.number === update.leap_number)?.emoji} Sprong {update.leap_number}
          </p>
        )}

        {update.reactions.length > 0 && (
          <div>
            <button
              onClick={() => setShowReacties(!showReacties)}
              className="text-[var(--rho-cream)]/40 text-xs font-body hover:text-[var(--rho-cream)]/60 transition-colors"
            >
              {showReacties ? "Verberg" : "Toon"} {update.reactions.length} reactie{update.reactions.length !== 1 ? "s" : ""}
            </button>
            {showReacties && (
              <div className="mt-3 space-y-2">
                {update.reactions.map((r) => (
                  <div key={r.id} className="flex gap-2">
                    <Avatar name={r.author_name ?? "?"} size="sm" />
                    <div className="bg-[var(--rho-cream)]/8 rounded-xl px-3 py-2 flex-1">
                      <p className="text-[var(--rho-cream)] text-xs font-body font-medium">{r.author_name}</p>
                      <p className="text-[var(--rho-cream)]/70 text-sm font-body">{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments section */}
        {naam && (
          <CommentSection
            itemId={update.id}
            itemType="update"
            currentUserName={naam}
          />
        )}

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            placeholder={naam ? `Reageer als ${naam}...` : "Reageer..."}
            value={reactie}
            onChange={(e) => setReactie(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && stuurReactie()}
            className="flex-1 bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/15 rounded-full px-4 py-2 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/40 transition-colors"
          />
          <button
            onClick={stuurReactie}
            disabled={!reactie.trim() || reactieLoading}
            className="w-9 h-9 rounded-full bg-[var(--rho-gold)] text-[var(--rho-red-dark)] flex items-center justify-center text-sm disabled:opacity-30 transition-opacity hover:opacity-90"
          >
            ↑
          </button>
        </div>
      </div>
    </article>
  );
}
