"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

interface Props {
  showForm: boolean;
}

export function MetingFormulier({ showForm }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(showForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [gewicht, setGewicht] = useState("");
  const [lengte, setLengte] = useState("");
  const [hoofd, setHoofd] = useState("");
  const [nota, setNota] = useState("");

  async function opslaan() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("measurements").insert({
      date: datum,
      weight_grams: gewicht ? Math.round(parseFloat(gewicht.replace(",", ".")) * 1000) : null,
      height_mm: lengte ? Math.round(parseFloat(lengte.replace(",", ".")) * 10) : null,
      head_cm: hoofd ? parseFloat(hoofd.replace(",", ".")) : null,
      note: nota || null,
    });
    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(false);
        router.refresh();
      }, 1500);
    }
  }

  const inputClass =
    "w-full bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-xl px-4 py-3 text-[var(--rho-cream)] placeholder:text-[var(--rho-cream)]/25 text-sm font-body focus:outline-none focus:border-[var(--rho-gold)]/50 transition-colors";

  return (
    <div>
      {!open ? (
        <Button variant="ghost" className="w-full" onClick={() => setOpen(true)}>
          + Nieuwe meting toevoegen
        </Button>
      ) : (
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl p-5 space-y-4">
          <h2 className="font-display text-lg text-[var(--rho-cream)]">Nieuwe meting</h2>

          <div>
            <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
              Datum
            </label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
                Gewicht (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="4,25"
                value={gewicht}
                onChange={(e) => setGewicht(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
                Lengte (cm)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="54,5"
                value={lengte}
                onChange={(e) => setLengte(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
                Hoofd (cm)
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="36,0"
                value={hoofd}
                onChange={(e) => setHoofd(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--rho-cream)]/60 text-xs font-body mb-1.5">
              Nota (optioneel)
            </label>
            <textarea
              placeholder="Bijv. 6-weekse consultatie"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuleer
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              loading={loading}
              onClick={opslaan}
              disabled={!gewicht && !lengte && !hoofd}
            >
              {success ? "✓ Opgeslagen!" : "Opslaan"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
