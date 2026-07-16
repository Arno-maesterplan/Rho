"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useNaam } from "@/lib/useNaam";
import { stuurPushNaarFamilie } from "@/lib/push";

// Comprimeer naar max 1600px jpeg via canvas
function comprimeer(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const MAX = 1600;
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const schaal = Math.min(1, MAX / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(w * schaal);
        canvas.height = Math.round(h * schaal);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("geen context");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", 0.82);
      } catch {
        resolve(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

// Losse foto's toevoegen aan het album (Supabase Storage, map "album")
export function FotoUpload() {
  const router = useRouter();
  const naam = useNaam();
  const [open, setOpen] = useState(false);
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [bezig, setBezig] = useState(false);
  const [voortgang, setVoortgang] = useState("");

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setBezig(true);
    const supabase = createClient();
    let gelukt = 0;

    for (let i = 0; i < files.length; i++) {
      setVoortgang(`Bestand ${i + 1} van ${files.length} uploaden...`);
      try {
        const isVideo = files[i].type.startsWith("video/");
        if (isVideo && files[i].size > 50 * 1024 * 1024) {
          alert(`"${files[i].name}" is groter dan 50 MB en wordt overgeslagen.`);
          continue;
        }
        const blob = isVideo ? files[i] : await comprimeer(files[i]);
        const ext = isVideo ? (files[i].name.split(".").pop() || "mp4").toLowerCase() : "jpg";
        const veiligeNaam = (naam || "Onbekend").replace(/[^a-zA-Z0-9]/g, "");
        const pad = `album/${datum}_${veiligeNaam}_${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error } = await supabase.storage
          .from("photos")
          .upload(pad, blob, { contentType: isVideo ? files[i].type : "image/jpeg" });
        if (!error) gelukt++;
        else console.error("Upload mislukt:", error);
      } catch (err) {
        console.error("Foto verwerken mislukt:", err);
      }
    }

    setBezig(false);
    setVoortgang("");
    setOpen(false);

    if (gelukt > 0) {
      stuurPushNaarFamilie({
        title: `${naam || "Iemand"} deelde nieuwe beelden van Rho 📷`,
        body: gelukt === 1 ? "1 nieuw kiekje van Rho" : `${gelukt} nieuwe kiekjes van Rho`,
        url: "/fotos",
        vanNaam: naam,
      });
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-[var(--rho-cream)]/10 hover:bg-[var(--rho-cream)]/15 border border-[var(--rho-cream)]/20 text-[var(--rho-cream)]/80 font-body py-3 rounded-2xl text-sm transition-colors mb-6"
      >
        📷 Foto&apos;s of video&apos;s toevoegen
      </button>
    );
  }

  return (
    <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl p-4 space-y-3 mb-6">
      <div>
        <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
          Wanneer zijn deze beelden gemaakt?
        </label>
        <input
          type="date"
          value={datum}
          onChange={(e) => setDatum(e.target.value)}
          className="w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50"
        />
      </div>

      <div className="relative">
        <div className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--rho-cream)]/20 flex items-center justify-center gap-2 text-[var(--rho-cream)]/50 pointer-events-none">
          {bezig ? (
            <span className="text-sm font-body">{voortgang}</span>
          ) : (
            <>
              <span className="text-lg">📷</span>
              <span className="text-sm font-body">Kies foto&apos;s of video&apos;s</span>
            </>
          )}
        </div>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onFiles}
          disabled={bezig}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <button
        onClick={() => setOpen(false)}
        disabled={bezig}
        className="w-full text-[var(--rho-cream)]/50 hover:text-[var(--rho-cream)]/80 text-sm font-body py-1 transition-colors disabled:opacity-40"
      >
        Annuleer
      </button>
    </div>
  );
}
