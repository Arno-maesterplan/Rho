"use client";

import { useState } from "react";
import { ComposedChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Scatter, ScatterChart } from "recharts";
import { calculatePercentile, calculateAgeInDays, calculateAgeInWeeks } from "@/lib/growth-analysis";
import { KG_WEIGHT, KG_LENGTH, KG_HEAD } from "@/lib/kind-gezin-curves";
import { BIRTH_DATE } from "@/lib/rho";

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

interface SelectedPoint {
  date: string;
  value: number;
  percentile: number;
  ageWeeks: number;
  ageDays: number;
  metingId: string;
}

export function GroeiTabContent({ measurements, type, label, unit }: Props) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Determine which curve data to use
  const getCurveData = () => {
    switch (type) {
      case "weight":
        return KG_WEIGHT;
      case "length":
        return KG_LENGTH;
      case "head":
        return KG_HEAD;
      default:
        return [];
    }
  };

  const curveData = getCurveData();
  const birthDate = BIRTH_DATE;

  // Transform measurements for scatter FIRST
  const scatterData = measurements
    .filter((m) => {
      if (type === "weight") return m.weight_grams;
      if (type === "length") return m.height_mm;
      if (type === "head") return m.head_cm;
      return false;
    })
    .map((m) => {
      const ageWeeks = calculateAgeInWeeks(birthDate);
      let value = 0;

      if (type === "weight") value = m.weight_grams! / 1000;
      else if (type === "length") value = m.height_mm! / 10;
      else if (type === "head") value = m.head_cm!;

      const percentileResult = calculatePercentile(value, ageWeeks, type);

      return {
        age: ageWeeks,
        value,
        percentile: percentileResult.percentile,
        date: m.date,
        metingId: m.id,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Build combined chart data - merge curves and data points
  const chartDataMap = new Map<number, any>();

  // Add curve points
  curveData.forEach((point) => {
    chartDataMap.set(point.ageWeeks, {
      age: point.ageWeeks,
      p1: point.percentiles.p1,
      p5: point.percentiles.p5,
      p10: point.percentiles.p10,
      p25: point.percentiles.p25,
      p50: point.percentiles.p50,
      p75: point.percentiles.p75,
      p90: point.percentiles.p90,
      p95: point.percentiles.p95,
      p99: point.percentiles.p99,
    });
  });

  // Add data points to map
  scatterData.forEach((point) => {
    const existing = chartDataMap.get(point.age) || { age: point.age };
    chartDataMap.set(point.age, {
      ...existing,
      value: point.value,
      metingDate: point.date,
      metingId: point.metingId,
      percentile: point.percentile,
    });
  });

  const chartData = Array.from(chartDataMap.values()).sort((a, b) => a.age - b.age);

  const handlePointClick = (data: any) => {
    const ageWeeks = calculateAgeInWeeks(birthDate);
    const ageDays = calculateAgeInDays(birthDate);

    setSelectedPoint({
      date: data.date,
      value: data.value,
      percentile: data.percentile,
      ageWeeks,
      ageDays,
      metingId: data.metingId,
    });
    setEditValue(data.value.toString());
  };

  const formatAge = (ageDays: number): string => {
    const weeks = Math.floor(ageDays / 7);
    const days = ageDays % 7;
    if (weeks === 0) return `${days}d`;
    return `${weeks}w${days}d`;
  };

  return (
    <div className="space-y-4">
      {/* Chart Container */}
      <div className="bg-[var(--rho-cream)]/3 border border-[var(--rho-cream)]/10 rounded-2xl p-4 overflow-hidden">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 60, left: 0, bottom: 40 }}
            >
              <XAxis
                dataKey="age"
                type="number"
                tick={{ fontSize: 11, fill: "var(--rho-cream)/60" }}
                stroke="var(--rho-cream)/20"
                label={{ value: "weeks", position: "insideBottomRight", offset: -10, fill: "var(--rho-cream)/40" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--rho-cream)/60" }}
                stroke="var(--rho-cream)/20"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a0810",
                  border: "1px solid var(--rho-gold)/30",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                cursor={false}
              />

              {/* Reference Curves - Percentile Lines */}
              <Line type="monotone" dataKey="p1" stroke="#FEF0F5" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p5" stroke="#FDE5F0" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p10" stroke="#FDD9E9" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p25" stroke="#FCC2DC" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p50" stroke="#F8A0C8" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p75" stroke="#F078B0" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p90" stroke="#E85780" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p95" stroke="#D93A5C" strokeWidth={1} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="p99" stroke="#C8102E" strokeWidth={1.5} dot={false} isAnimationActive={false} />

              {/* Data Points */}
              <Scatter
                dataKey="value"
                fill="#2C5AA0"
                fillOpacity={0.8}
                onClick={(state: any) => {
                  if (state && state.payload && state.payload.metingId) {
                    handlePointClick(state.payload);
                  }
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-[var(--rho-cream)]/40">
            Laden...
          </div>
        )}
      </div>

      {/* Selected Point Detail Card */}
      {selectedPoint && (
        <div className="bg-[var(--rho-cream)]/8 border border-[var(--rho-gold)]/30 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider">
                {new Date(selectedPoint.date).toLocaleDateString("nl-NL", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-[var(--rho-cream)] font-display text-2xl mt-1">
                {selectedPoint.value.toFixed(2)} {unit}
              </p>
              <p className="text-[var(--rho-gold)] text-sm font-body mt-1">
                {label} Percentiel <span className="font-display">{selectedPoint.percentile}%</span>
              </p>
              <p className="text-[var(--rho-cream)]/60 text-xs font-body mt-1">
                Leeftijd: {formatAge(selectedPoint.ageDays)}
              </p>
              <p className="text-[var(--rho-cream)]/40 text-xs font-body mt-1">
                Source: WHO
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPoint(null)}
                className="px-3 py-2 text-[var(--rho-cream)]/60 hover:text-[var(--rho-cream)] text-sm"
              >
                ✕
              </button>
              <button
                onClick={() => {
                  // Edit action - could open a modal
                  console.log("Edit meting:", selectedPoint.metingId);
                }}
                className="px-3 py-2 text-[var(--rho-gold)] hover:text-[var(--rho-gold)]/80 text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Measurement Button */}
      <a
        href="/groei?new=1"
        className="w-full block text-center bg-[var(--rho-gold)]/20 hover:bg-[var(--rho-gold)]/30 text-[var(--rho-gold)] font-body py-3 rounded-xl transition-colors"
      >
        + {label} toevoegen
      </a>

      {/* Measurements List */}
      {scatterData.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-[var(--rho-cream)]/10">
          <p className="text-[var(--rho-cream)]/40 text-xs font-body uppercase tracking-wider">
            Metingen ({scatterData.length})
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {scatterData.map((point) => (
              <div
                key={point.metingId}
                onClick={() => handlePointClick(point)}
                className="flex justify-between items-center p-2 rounded-lg bg-[var(--rho-cream)]/5 hover:bg-[var(--rho-cream)]/10 cursor-pointer transition-colors text-sm"
              >
                <span className="text-[var(--rho-cream)]/60">
                  {new Date(point.date).toLocaleDateString("nl-NL")}
                </span>
                <span className="text-[var(--rho-cream)]">
                  {point.value.toFixed(2)} {unit}
                </span>
                <span className="text-[var(--rho-gold)] text-xs">P{point.percentile}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
