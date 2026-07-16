"use client";

import { useEffect, useState } from "react";

// Globale foto-lightbox: klik op eender welke foto in de app om ze groot
// te bekijken en op te slaan. Kleine afbeeldingen (avatars, icoontjes) en
// afbeeldingen binnen knoppen/links worden overgeslagen.
export function Lightbox() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLImageElement)) return;

      // Sla afbeeldingen over die al eigen klikgedrag hebben
      if (target.closest("button, summary, a, nav, [data-no-lightbox]")) return;

      // Sla kleine afbeeldingen over (avatars, icoontjes, decoratie)
      const rect = target.getBoundingClientRect();
      if (rect.width < 80 || rect.height < 80) return;

      e.preventDefault();
      e.stopPropagation();
      setSrc(target.currentSrc || target.src);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!src) return;
    // Blokkeer scrollen van de pagina achter de lightbox
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSrc(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [src]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col"
      onClick={() => setSrc(null)}
    >
      {/* Topbalk */}
      <div className="flex justify-between items-center p-4 shrink-0">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            try {
              // Via blob zodat opslaan ook werkt voor foto's op storage (cross-origin)
              const blob = await (await fetch(src)).blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `rho-${Date.now()}.jpg`;
              a.click();
              URL.revokeObjectURL(url);
            } catch {
              window.open(src, "_blank");
            }
          }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-body px-4 py-2 rounded-full transition-colors"
        >
          ⬇ Opslaan
        </button>
        <button
          onClick={() => setSrc(null)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
          aria-label="Sluiten"
        >
          ×
        </button>
      </div>

      {/* Foto */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8 min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <p className="text-white/40 text-xs font-body text-center pb-4 shrink-0">
        Tik naast de foto om te sluiten · hou de foto ingedrukt om te delen
      </p>
    </div>
  );
}
