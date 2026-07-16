"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Houdt de data vers zonder dat oma moet herladen:
// - ververst wanneer de app weer in beeld komt (visibilitychange/focus)
// - ververst elke 60s zolang de app zichtbaar is
// - pull-to-refresh: naar beneden trekken bovenaan de pagina
export function VerseData() {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const [bezig, setBezig] = useState(false);
  const startY = useRef<number | null>(null);

  // Verversen bij terugkeren naar de app + elke minuut
  useEffect(() => {
    function refresh() {
      if (document.visibilityState === "visible") router.refresh();
    }
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    const interval = setInterval(refresh, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      clearInterval(interval);
    };
  }, [router]);

  // Pull-to-refresh
  useEffect(() => {
    function onStart(e: TouchEvent) {
      if (window.scrollY <= 0) startY.current = e.touches[0].clientY;
      else startY.current = null;
    }
    function onMove(e: TouchEvent) {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        setPull(Math.min(delta * 0.4, 80));
      }
    }
    function onEnd() {
      if (startY.current === null) return;
      setPull((huidige) => {
        if (huidige > 55) {
          setBezig(true);
          router.refresh();
          setTimeout(() => setBezig(false), 800);
        }
        return 0;
      });
      startY.current = null;
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [router]);

  if (pull === 0 && !bezig) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[90] flex justify-center pointer-events-none"
      style={{ transform: `translateY(${bezig ? 16 : pull - 40}px)`, transition: pull === 0 ? "transform 0.3s" : "none" }}
    >
      <div className="bg-[var(--rho-cream)] text-[var(--rho-red-dark)] rounded-full w-9 h-9 flex items-center justify-center shadow-lg text-lg">
        <span className={bezig ? "animate-spin inline-block" : ""}>↻</span>
      </div>
    </div>
  );
}
