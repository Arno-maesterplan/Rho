"use client";

import { GroeiPercentielChart } from "./GroeiPercentielChart";
import { KG_WEIGHT, KG_LENGTH, KG_HEAD } from "@/lib/kind-gezin-curves";

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
  const safeMetings = measurements || [];

  let getValue = (m: Meting) => 0;
  let curveData = KG_WEIGHT;

  switch (type) {
    case "weight":
      getValue = (m) => (m.weight_grams ? m.weight_grams / 1000 : 0);
      curveData = KG_WEIGHT;
      break;
    case "length":
      getValue = (m) => (m.height_mm ? m.height_mm / 10 : 0);
      curveData = KG_LENGTH;
      break;
    case "head":
      getValue = (m) => m.head_cm || 0;
      curveData = KG_HEAD;
      break;
  }

  const firstValue = safeMetings.length > 0 ? getValue(safeMetings[0]) : null;
  const lastValue = safeMetings.length > 0 ? getValue(safeMetings[safeMetings.length - 1]) : null;
  const difference = firstValue && lastValue ? lastValue - firstValue : null;

  return (
    <div className="space-y-4">
      {/* Info Cards - Baby+ style */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Geboort</p>
          <p className="text-[var(--rho-cream)] font-display text-lg mt-1">
            {firstValue ? firstValue.toFixed(1) : "—"} {unit}
          </p>
          {safeMetings.length > 0 && (
            <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-0.5">
              {new Date(safeMetings[0].date).toLocaleDateString("nl-NL")}
            </p>
          )}
        </div>

        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Huidig</p>
          <p className="text-[var(--rho-cream)] font-display text-lg mt-1">
            {lastValue ? lastValue.toFixed(1) : "—"} {unit}
          </p>
          {safeMetings.length > 0 && (
            <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-0.5">
              {new Date(safeMetings[safeMetings.length - 1].date).toLocaleDateString("nl-NL")}
            </p>
          )}
        </div>

        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-2xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Verschil</p>
          <p className={`font-display text-lg mt-1 ${difference && difference >= 0 ? "text-[var(--rho-gold)]" : "text-red-400"}`}>
            {difference ? (difference >= 0 ? "+" : "") + difference.toFixed(1) : "—"} {unit}
          </p>
          <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-0.5">↑</p>
        </div>
      </div>

      {/* Percentiel Label */}
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <p className="text-[var(--rho-cream)] font-body">
          Percentiel {label} Rho: <span className="font-display text-xl text-[var(--rho-gold)]">50</span>
        </p>
      </div>

      {/* Chart */}
      <div className="bg-[var(--rho-cream)]/3 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <GroeiPercentielChart measurements={safeMetings} type={type} unit={unit} />
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="w-full bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl transition-colors"
      >
        + {label} toevoegen
      </button>
    </div>
  );
}
