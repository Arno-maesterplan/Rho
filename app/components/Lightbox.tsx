"use client";

import { useEffect, useRef, useState } from "react";

type MediaItem = { src: string; isVideo: boolean };

// Globale media-lightbox: klik op eender welke foto of video in de app om ze
// groot te bekijken. Swipe (of pijltjes) om door alle media op de pagina te
// bladeren. Kleine afbeeldingen (avatars, icoontjes) en media binnen
// knoppen/links worden overgeslagen.
export function Lightbox() {
  const [galerij, setGalerij] = useState<MediaItem[]>([]);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const huidige = open ? galerij[index] : undefined;

  function isGeschikt(el: Element): el is HTMLImageElement | HTMLVideoElement {
    if (!(el instanceof HTMLImageElement) && !(el instanceof HTMLVideoElement)) return false;
    if (el.closest("button, summary, a, nav, [data-no-lightbox]")) return false;
    const rect = el.getBoundingClientRect();
    return rect.width >= 80 && rect.height >= 80;
  }

  function mediaSrc(el: HTMLImageElement | HTMLVideoElement) {
    return el instanceof HTMLImageElement ? el.currentSrc || el.src : el.src;
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!isGeschikt(target)) return;

      e.preventDefault();
      e.stopPropagation();

      // Verzamel alle zichtbare media op de pagina, in volgorde
      const alles = Array.from(document.querySelectorAll("img, video")).filter(isGeschikt);
      const lijst = alles.map((el) => ({
        src: mediaSrc(el as HTMLImageElement | HTMLVideoElement),
        isVideo: el instanceof HTMLVideoElement,
      }));
      const klikIndex = alles.indexOf(target as HTMLImageElement | HTMLVideoElement);

      setGalerij(lijst);
      setIndex(Math.max(0, klikIndex));
      setOpen(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, galerij.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, galerij.length]);

  if (!open || !huidige) return null;

  const heeftVorige = index > 0;
  const heeftVolgende = index < galerij.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col"
      onClick={() => setOpen(false)}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (dx < -50 && heeftVolgende) setIndex(index + 1);
        if (dx > 50 && heeftVorige) setIndex(index - 1);
      }}
    >
      {/* Topbalk */}
      <div className="flex justify-between items-center p-4 shrink-0">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            try {
              // Via blob zodat opslaan ook werkt voor media op storage (cross-origin)
              const blob = await (await fetch(huidige.src)).blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `rho-${Date.now()}.${huidige.isVideo ? "mp4" : "jpg"}`;
              a.click();
              URL.revokeObjectURL(url);
            } catch {
              window.open(huidige.src, "_blank");
            }
          }}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-body px-4 py-2 rounded-full transition-colors"
        >
          ⬇ Opslaan
        </button>

        {galerij.length > 1 && (
          <p className="text-white/50 text-xs font-body">
            {index + 1} / {galerij.length}
          </p>
        )}

        <button
          onClick={() => setOpen(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl flex items-center justify-center transition-colors"
          aria-label="Sluiten"
        >
          ×
        </button>
      </div>

      {/* Media */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8 min-h-0 relative">
        {huidige.isVideo ? (
          <video
            key={huidige.src}
            src={huidige.src}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={huidige.src}
            src={huidige.src}
            alt=""
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Bladerpijlen */}
        {heeftVorige && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index - 1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center transition-colors"
            aria-label="Vorige"
          >
            ‹
          </button>
        )}
        {heeftVolgende && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex(index + 1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl flex items-center justify-center transition-colors"
            aria-label="Volgende"
          >
            ›
          </button>
        )}
      </div>

      <p className="text-white/40 text-xs font-body text-center pb-4 shrink-0">
        Swipe voor volgende · tik ernaast om te sluiten
      </p>
    </div>
  );
}
