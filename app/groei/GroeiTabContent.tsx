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
}

export function GroeiTabContent({ measurements, type, label, unit }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <p className="text-[var(--rho-cream)] font-body text-sm">
          📊 {label} grafiek met {measurements?.length || 0} meting(en)
        </p>
      </div>
      <a
        href="/groei?new=1"
        className="w-full block text-center bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl"
      >
        + {label} toevoegen
      </a>
    </div>
  );
}
