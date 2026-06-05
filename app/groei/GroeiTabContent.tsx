"use client";

import { GroeiPercentielChart } from "./GroeiPercentielChart";
import { calculatePercentile, calculateAgeInWeeks } from "@/lib/growth-analysis";
import { KG_WEIGHT, KG_LENGTH, KG_HEAD, PercentileData } from "@/lib/kind-gezin-curves";

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
  if (measurements.length === 0) {
    return <div className="text-[var(--rho-cream)]/40 py-8">Geen metingen beschikbaar</div>;
  }

  // Get curve data
  let curveData: PercentileData[] = [];
  let getValue = (m: Meting) => 0;

  switch (type) {
    case "weight":
      curveData = KG_WEIGHT;
      getValue = (m) => (m.weight_grams ? m.weight_grams / 1000 : 0);
      break;
    case "length":
      curveData = KG_LENGTH;
      getValue = (m) => (m.height_mm ? m.height_mm / 10 : 0);
      break;
    case "head":
      curveData = KG_HEAD;
      getValue = (m) => m.head_cm || 0;
      break;
  }

  const birthDate = measurements[0].date;
  const firstMeasurement = measurements[0];
  const lastMeasurement = measurements[measurements.length - 1];

  const firstValue = getValue(firstMeasurement);
  const lastValue = getValue(lastMeasurement);
  const difference = lastValue - firstValue;

  // Calculate percentile for latest measurement
  const lastAgeWeeks = calculateAgeInWeeks(lastMeasurement.date);
  const lastPercentile = calculatePercentile(lastValue, lastAgeWeeks, type);

  return (
    <div className="space-y-4">
      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Geboort</p>
          <p className="text-[var(--rho-cream)] font-display text-lg mt-1">
            {firstValue.toFixed(1)} {unit}
          </p>
          <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-0.5">{new Date(birthDate).toLocaleDateString("nl-NL")}</p>
        </div>

        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Huidig</p>
          <p className="text-[var(--rho-cream)] font-display text-lg mt-1">
            {lastValue.toFixed(1)} {unit}
          </p>
          <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-0.5">{new Date(lastMeasurement.date).toLocaleDateString("nl-NL")}</p>
        </div>

        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Verschil</p>
          <p className={`font-display text-lg mt-1 ${difference >= 0 ? "text-[var(--rho-gold)]" : "text-red-400"}`}>
            {difference >= 0 ? "+" : ""}{difference.toFixed(1)} {unit}
          </p>
          <p className="text-[var(--rho-cream)]/30 text-xs font-body mt-0.5">↑</p>
        </div>
      </div>

      {/* Percentile Label */}
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <p className="text-[var(--rho-cream)] font-body">
          Percentiel {label} Rho: <span className="font-display text-xl text-[var(--rho-gold)]">{lastPercentile.percentile}</span>
        </p>
        <p className="text-[var(--rho-cream)]/60 text-xs font-body mt-1">{lastPercentile.label}</p>
      </div>

      {/* Chart */}
      <div className="bg-[var(--rho-cream)]/3 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <GroeiPercentielChart measurements={measurements} type={type} curveData={curveData} unit={unit} />
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
