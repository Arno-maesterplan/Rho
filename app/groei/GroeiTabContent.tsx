"use client";

interface Meting {
  id: string;
  date: string;
  weight_grams?: number;
  height_mm?: number;
  head_cm?: number;
}

interface Props {
  measurements: Meting[];
  type: "weight" | "length" | "head";
  label: string;
  unit: string;
  onAddClick: () => void;
}

export function GroeiTabContent({ measurements, type, label, unit, onAddClick }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <p className="text-[var(--rho-cream)] font-body text-sm">
          {label} curve ({unit})
        </p>
        <p className="text-[var(--rho-cream)]/60 font-body text-xs mt-2">
          Metingen: {measurements?.length || 0}
        </p>
      </div>

      {measurements && measurements.length === 0 && (
        <div className="bg-[var(--rho-gold)]/10 border border-[var(--rho-gold)]/25 rounded-xl p-4">
          <p className="text-[var(--rho-cream)]/80 font-body text-sm">
            📊 Kind en Gezin referentiecurve voor {label.toLowerCase()}
          </p>
          <p className="text-[var(--rho-cream)]/60 font-body text-xs mt-2">
            Curves tonen percentiles P1-P99. Voeg metingen toe om je baby op de curve te zien.
          </p>
        </div>
      )}

      <button
        onClick={onAddClick}
        className="w-full bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl transition-colors"
      >
        + {label} toevoegen
      </button>
    </div>
  );
}
