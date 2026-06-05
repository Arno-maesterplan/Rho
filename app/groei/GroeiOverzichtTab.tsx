"use client";

import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { calculatePercentileWeightForLength } from "@/lib/growth-analysis";

interface Meting {
  id: string;
  date: string;
  weight_grams?: number;
  height_mm?: number;
}

interface Props {
  measurements: Meting[];
  onAddClick: () => void;
}

export function GroeiOverzichtTab({ measurements, onAddClick }: Props) {
  if (measurements.length === 0) {
    return <div className="text-[var(--rho-cream)]/40 py-8">Geen metingen beschikbaar</div>;
  }

  // Filter measurements with both weight and length
  const completeData = measurements
    .filter((m) => m.weight_grams && m.height_mm)
    .map((m) => {
      const weight = (m.weight_grams || 0) / 1000;
      const length = (m.height_mm || 0) / 10;
      const percentile = calculatePercentileWeightForLength(weight, length);
      return {
        length,
        weight,
        percentile: percentile.percentile,
        label: `${length.toFixed(1)}cm`,
      };
    });

  if (completeData.length === 0) {
    return <div className="text-[var(--rho-cream)]/40 py-8">Onvoldoende data (lengte + gewicht nodig)</div>;
  }

  const lastMeasurement = completeData[completeData.length - 1];

  return (
    <div className="space-y-4">
      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Lengte</p>
          <p className="text-[var(--rho-cream)] font-display text-lg mt-1">{lastMeasurement.length.toFixed(1)} cm</p>
        </div>

        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Gewicht</p>
          <p className="text-[var(--rho-cream)] font-display text-lg mt-1">{lastMeasurement.weight.toFixed(1)} kg</p>
        </div>

        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/15 rounded-xl p-3">
          <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">Percentiel</p>
          <p className="text-[var(--rho-gold)] font-display text-lg mt-1">{lastMeasurement.percentile}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[var(--rho-cream)]/3 border border-[var(--rho-cream)]/10 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rho-cream)/10" />
            <XAxis
              type="number"
              dataKey="length"
              name="Lengte (cm)"
              tick={{ fontSize: 12, fill: "var(--rho-cream)/40" }}
              stroke="var(--rho-cream)/20"
              domain={[40, 120]}
            />
            <YAxis
              type="number"
              dataKey="weight"
              name="Gewicht (kg)"
              tick={{ fontSize: 12, fill: "var(--rho-cream)/40" }}
              stroke="var(--rho-cream)/20"
              domain={[0, 50]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a0810",
                border: "1px solid var(--rho-gold)/30",
                borderRadius: "8px",
              }}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter
              name="Metingen"
              data={completeData}
              fill="var(--rho-gold)"
              fillOpacity={0.8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Add Button */}
      <button
        onClick={onAddClick}
        className="w-full bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl transition-colors"
      >
        + Nieuwe meting toevoegen
      </button>
    </div>
  );
}
