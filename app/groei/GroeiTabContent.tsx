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

// Custom data point shape with ring
const DataPointCircle = (props: any) => {
  const { cx, cy, fill } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={fill} opacity={0.9} />
      <circle cx={cx} cy={cy} r={9} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.4} />
    </g>
  );
};

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
      const ageWeeks = calculateAgeInWeeks(new Date(m.date));
      const ageDays = calculateAgeInDays(new Date(m.date));
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
        ageDays,
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
    setSelectedPoint({
      date: data.date,
      value: data.value,
      percentile: data.percentile,
      ageWeeks: data.age,
      ageDays: data.ageDays,
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
      {/* Chart Container - Baby+ Style */}
      <div className="bg-gradient-to-b from-[var(--rho-cream)]/5 to-[var(--rho-cream)]/2 border border-[var(--rho-cream)]/10 rounded-3xl p-6 overflow-hidden">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <ComposedChart
              data={chartData}
              margin={{ top: 30, right: 80, left: 40, bottom: 50 }}
            >
              {/* Grid */}
              <defs>
                <linearGradient id="percentileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FDB8D6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F8A0C8" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              {/* Axes */}
              <XAxis
                dataKey="age"
                type="number"
                tick={{ fontSize: 12, fill: "var(--rho-cream)/70" }}
                axisLine={{ stroke: "var(--rho-cream)/20" }}
                tickLine={{ stroke: "var(--rho-cream)/20" }}
                label={{ value: "Weken oud →", position: "bottom", offset: 10, fill: "var(--rho-cream)/60", fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--rho-cream)/70" }}
                axisLine={{ stroke: "var(--rho-cream)/20" }}
                tickLine={{ stroke: "var(--rho-cream)/20" }}
                label={{ value: `← ${label} (${unit})`, angle: -90, position: "left", fill: "var(--rho-cream)/60", fontSize: 12 }}
              />

              {/* Tooltip - Baby+ style */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(26, 8, 16, 0.95)",
                  border: "2px solid var(--rho-gold)",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                }}
                cursor={{ strokeDasharray: "5 5", stroke: "var(--rho-gold)/50" }}
                formatter={(value: any) => {
                  if (typeof value === "number") {
                    return [value.toFixed(2), "Waarde"];
                  }
                  return [value || "", ""];
                }}
              />

              {/* Reference Curves - Clean percentile lines */}
              <Line type="monotone" dataKey="p99" stroke="#FEE0EA" strokeWidth={1.5} dot={false} isAnimationActive={false} name="P99" />
              <Line type="monotone" dataKey="p95" stroke="#FDD9E9" strokeWidth={1.5} dot={false} isAnimationActive={false} name="P95" />
              <Line type="monotone" dataKey="p90" stroke="#FCC2DC" strokeWidth={1.5} dot={false} isAnimationActive={false} name="P90" />
              <Line type="monotone" dataKey="p75" stroke="#F8A0C8" strokeWidth={2} dot={false} isAnimationActive={false} name="P75" />
              <Line type="monotone" dataKey="p50" stroke="#F073A4" strokeWidth={2.5} dot={false} isAnimationActive={false} name="P50" />
              <Line type="monotone" dataKey="p25" stroke="#E85780" strokeWidth={1.5} dot={false} isAnimationActive={false} name="P25" />
              <Line type="monotone" dataKey="p10" stroke="#D93A5C" strokeWidth={1.5} dot={false} isAnimationActive={false} name="P10" />
              <Line type="monotone" dataKey="p5" stroke="#C8102E" strokeWidth={1.5} dot={false} isAnimationActive={false} name="P5" />
              <Line type="monotone" dataKey="p1" stroke="#A00620" strokeWidth={1} dot={false} isAnimationActive={false} name="P1" />

              {/* Data Points - Baby+ style with rings */}
              <Scatter
                dataKey="value"
                fill="#2C5AA0"
                fillOpacity={0.9}
                onClick={(state: any) => {
                  if (state && state.payload && state.payload.metingId) {
                    handlePointClick(state.payload);
                  }
                }}
                shape={<DataPointCircle />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-[var(--rho-cream)]/40 font-body">Geen metingen beschikbaar</p>
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
