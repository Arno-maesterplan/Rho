"use client";

import { useEffect, useState } from "react";
import { useNaam } from "@/lib/useNaam";
import { VAPID_PUBLIC_KEY } from "@/lib/push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// Banner op de homepage: zet meldingen aan zodat familie een berichtje
// krijgt bij nieuwe updates en milestones
export function MeldingenBanner() {
  const naam = useNaam();
  const [status, setStatus] = useState<"laden" | "kan-niet" | "vraag" | "aan" | "geweigerd">("laden");
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    async function check() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("kan-niet");
        return;
      }
      // Service worker alvast registreren
      const reg = await navigator.serviceWorker.register("/sw.js").catch(() => null);
      if (!reg) {
        setStatus("kan-niet");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("geweigerd");
        return;
      }
      const sub = await reg.pushManager.getSubscription();
      setStatus(sub ? "aan" : "vraag");
    }
    check();
  }, []);

  async function zetAan() {
    setBezig(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("geweigerd");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, name: naam }),
      });
      setStatus("aan");
    } catch (err) {
      console.error("Meldingen aanzetten mislukt:", err);
    } finally {
      setBezig(false);
    }
  }

  if (status === "laden" || status === "kan-niet" || status === "aan") return null;

  if (status === "geweigerd") {
    return (
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-4 text-[var(--rho-cream)]/50 text-xs font-body">
        🔕 Meldingen staan uit in je browserinstellingen. Zet ze daar aan om niets van Rho te missen.
      </div>
    );
  }

  return (
    <button
      onClick={zetAan}
      disabled={bezig}
      className="w-full bg-[var(--rho-gold)]/15 hover:bg-[var(--rho-gold)]/25 border border-[var(--rho-gold)]/30 rounded-2xl p-4 flex items-center gap-3 transition-colors text-left disabled:opacity-50"
    >
      <span className="text-2xl">🔔</span>
      <div>
        <p className="text-[var(--rho-cream)] text-sm font-body font-medium">
          {bezig ? "Bezig..." : "Zet meldingen aan"}
        </p>
        <p className="text-[var(--rho-cream)]/50 text-xs font-body mt-0.5">
          Krijg een berichtje bij nieuwe foto&apos;s, updates en milestones van Rho
        </p>
      </div>
    </button>
  );
}
