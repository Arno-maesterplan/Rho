"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Scatter, Tooltip } from "recharts";
import { calculateWeightPercentile, getWHODataForAge } from "@/lib/who-growth-standards";
import { calculateAgeInWeeks, calculateAgeInDays } from "@/lib/growth-analysis";
import { BIRTH_DATE } from "@/lib/rho";

interface Measurement {
  id: string;
  date: string;
  weight_grams?: number;
  height_mm?: number;
  head_cm?: number;
}

interface Props {
  measurements: Measurement[];
  type: "weight" | "length" | "head";
  label: string;
  unit: string;
}

interface DataPoint {
  age: number;
  ageDays: number;
  value: number;
  date: string;
  percentile: number;
  metingId: string;
}

export function GrowthChart({ measurements, type, label, unit }: Props) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  // Filter relevant measurements
  const dataPoints = measurements
    .filter((m) => {
      if (type === "weight") return m.weight_grams;
      if (type === "length") return m.height_mm;
      if (type === "head") return m.head_cm;
      return false;
    })
    .map((m) => {
      const ageWeeks = calculateAgeInWeeks(new Date(m.date));
      const ageDays = calculateAgeInDays(new Date(m.date));
      let value = 0;
      let percentile = 50;

      if (type === "weight") {
        value = m.weight_grams! / 1000;
        percentile = calculateWeightPercentile(value, ageWeeks);
      } else if (type === "length") {
        value = m.height_mm! / 10;
        // TODO: Add length percentile calculation
      } else if (type === "head") {
        value = m.head_cm!;
        // TODO: Add head percentile calculation
      }

      return {
        age: ageWeeks,
        ageDays,
        value,
        date: m.date,
        percentile,
        metingId: m.id,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Generate WHO curve data - dynamically scaled
  const maxAge = dataPoints.length > 0 ? Math.max(...dataPoints.map((p) => p.age)) + 4 : 8;
  const chartData: any[] = [];

  for (let week = 0; week <= maxAge; week += 0.5) {
    const whoData = getWHODataForAge(week);
    if (whoData && (type === "weight" || true)) {
      // TODO: Add length and head WHO data
      const p3 = typeof whoData.P3 === 'number' ? whoData.P3 : undefined;
      const p15 = typeof whoData.P15 === 'number' ? whoData.P15 : undefined;
      const p50 = typeof whoData.P50 === 'number' ? whoData.P50 : undefined;
      const p85 = typeof whoData.P85 === 'number' ? whoData.P85 : undefined;
      const p97 = typeof whoData.P97 === 'number' ? whoData.P97 : undefined;

      if (p3 !== undefined && p50 !== undefined && p97 !== undefined) {
        chartData.push({
          age: week,
          p3,
          p15,
          p50,
          p85,
          p97,
        });
      }
    }
  }

  // Calculate Y-axis range
  const allValues = [
    ...chartData.map((d) => d.p3),
    ...dataPoints.map((p) => p.value),
  ].filter(Boolean);
  const minY = Math.floor(Math.min(...allValues) * 10) / 10;
  const maxY = Math.ceil(Math.max(...allValues, dataPoints.length > 0 ? Math.max(...dataPoints.map((p) => p.value)) : 0) * 10) / 10;

  // DIAGNOSE: Log WHO data at birth (day 0)
  if (chartData.length > 0) {
    const day0Data = chartData[0];
    console.log("=== DIAGNOSIS: WHO Data at Day 0 (Birth) ===");
    console.log("P3 at day 0:", day0Data.p3, "(Expected: ~2.4)");
    console.log("P50 at day 0:", day0Data.p50, "(Expected: ~3.2)");
    console.log("P97 at day 0:", day0Data.p97, "(Expected: ~3.9)");
    console.log("Total chart data points:", chartData.length);
    console.log("Max age weeks:", maxAge);
    console.log("Chart data sample:", { week0: chartData[0], week7: chartData[Math.floor(14 / 0.5)] });
  }

  // DIAGNOSE: Log Y-axis range
  console.log("=== DIAGNOSIS: Y-Axis Range ===");
  console.log("Min Y (calculated):", minY);
  console.log("Max Y (calculated):", maxY);
  console.log("All percentile values at max age:", {
    p3: chartData[chartData.length - 1]?.p3,
    p50: chartData[chartData.length - 1]?.p50,
    p97: chartData[chartData.length - 1]?.p97,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("nl-NL");
  };

  const formatAge = (ageDays: number) => {
    const weeks = Math.floor(ageDays / 7);
    const days = ageDays % 7;
    return weeks === 0 ? `${days}d` : `${weeks}w${days}d`;
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-gradient-to-b from-[var(--rho-cream)]/5 to-transparent rounded-3xl p-6 overflow-hidden">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 80, left: 50, bottom: 50 }}>
              <XAxis
                dataKey="age"
                type="number"
                domain={[0, maxAge]}
                label={{ value: "Weken oud", position: "bottom", offset: 10, fill: "var(--rho-cream)/60" }}
                tick={{ fontSize: 11, fill: "var(--rho-cream)/70" }}
                stroke="var(--rho-cream)/20"
              />
              <YAxis
                domain={[minY - 0.5, maxY + 0.5]}
                label={{ value: label, angle: -90, position: "left", fill: "var(--rho-cream)/60" }}
                tick={{ fontSize: 11, fill: "var(--rho-cream)/70" }}
                stroke="var(--rho-cream)/20"
              />

              {/* Percentile curves */}
              <Line type="monotone" dataKey="p3" stroke="#FEE0EA" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p15" stroke="#FCC2DC" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p50" stroke="#F073A4" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p85" stroke="#E85780" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p97" stroke="#C8102E" strokeWidth={1.5} dot={false} isAnimationActive={false} />

              {/* Data points */}
              {dataPoints.map((point, idx) => (
                <circle
                  key={idx}
                  cx={0}
                  cy={0}
                  r={5}
                  fill="#2C5AA0"
                  onClick={() => setSelectedPoint(point)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-[var(--rho-cream)]/40">
            Geen metingen beschikbaar
          </div>
        )}
      </div>

      {/* Selected point detail */}
      {selectedPoint && (
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-cream)]/20 rounded-2xl p-4 space-y-2">
          <p className="text-[var(--rho-cream)]/60 text-sm font-body">{formatDate(selectedPoint.date)}</p>
          <p className="text-[var(--rho-cream)] font-display text-2xl">
            {selectedPoint.value.toFixed(2)} {unit}
          </p>
          <p className="text-[var(--rho-gold)] text-sm font-body">
            Girls Percentile <span className="font-display">{selectedPoint.percentile}%</span>
          </p>
          <p className="text-[var(--rho-cream)]/60 text-xs font-body">Age {formatAge(selectedPoint.ageDays)}</p>
          <p className="text-[var(--rho-cream)]/40 text-xs">Source: WHO</p>
          <button
            onClick={() => setSelectedPoint(null)}
            className="text-[var(--rho-cream)]/40 hover:text-[var(--rho-cream)] text-sm mt-2"
          >
            ✕ Sluiten
          </button>
        </div>
      )}

      {/* Measurements list */}
      {dataPoints.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-[var(--rho-cream)]/10">
          <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase">Metingen ({dataPoints.length})</p>
          <div className="space-y-1">
            {dataPoints.map((point) => (
              <button
                key={point.metingId}
                onClick={() => setSelectedPoint(point)}
                className="w-full flex justify-between items-center p-2 rounded-lg bg-[var(--rho-cream)]/5 hover:bg-[var(--rho-cream)]/10 text-sm transition-colors text-left"
              >
                <span className="text-[var(--rho-cream)]/60">{formatDate(point.date)}</span>
                <span className="text-[var(--rho-cream)]">{point.value.toFixed(2)} {unit}</span>
                <span className="text-[var(--rho-gold)] text-xs">P{point.percentile}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add button */}
      <a
        href="/groei?new=1"
        className="block w-full text-center bg-[var(--rho-cream)]/10 hover:bg-[var(--rho-cream)]/15 text-[var(--rho-cream)]/70 hover:text-[var(--rho-cream)] font-body py-2 rounded-xl text-sm transition-colors"
      >
        + {label} toevoegen
      </a>
    </div>
  );
}
