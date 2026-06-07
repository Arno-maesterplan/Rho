"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  WHO_WEIGHT_LMS,
  WHO_LENGTH_LMS,
  WHO_HEAD_LMS,
  lmsToPercentile,
  lmsPercentileValue,
  getLMSForWeek,
} from "@/lib/who-growth-standards";
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
  ageWeeks: number;
  value: number;
  percentile: number;
  date: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload as DataPoint;
  const date = new Date(data.date).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-black/90 border border-white/30 rounded-lg px-3 py-2 text-xs">
      <p className="text-white/70">{date}</p>
      <p className="text-white font-semibold">{data.value.toFixed(2)}</p>
      <p className="text-amber-300">Percentiel: P{data.percentile}</p>
    </div>
  );
}

export function GrowthChart({ measurements, type, label, unit }: Props) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  // Calculate age in weeks from birth
  const calculateAgeInWeeks = (date: string | Date): number => {
    const birth = new Date(BIRTH_DATE);
    const measurement = new Date(date);
    const diffMs = measurement.getTime() - birth.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get LMS data array for this type
  const getLMSArray = () => {
    if (type === "weight") return WHO_WEIGHT_LMS;
    if (type === "length") return WHO_LENGTH_LMS;
    return WHO_HEAD_LMS;
  };

  const lmsArray = getLMSArray();

  // Convert measurement value to correct unit
  const convertValue = (m: Measurement): number => {
    if (type === "weight" && m.weight_grams) return m.weight_grams / 1000;
    if (type === "length" && m.height_mm) return m.height_mm / 10;
    if (type === "head" && m.head_cm) return m.head_cm;
    return 0;
  };

  // Get data points from measurements
  const dataPoints = measurements
    .filter((m) => {
      if (type === "weight") return m.weight_grams;
      if (type === "length") return m.height_mm;
      if (type === "head") return m.head_cm;
      return false;
    })
    .map((m) => {
      const ageWeeks = calculateAgeInWeeks(m.date);
      const value = convertValue(m);
      const lms = getLMSForWeek(ageWeeks, type);
      const percentile = Math.round(lmsToPercentile(value, lms.L, lms.M, lms.S));

      return {
        ageWeeks,
        value,
        percentile: Math.max(1, Math.min(99, percentile)),
        date: m.date,
      };
    })
    .sort((a, b) => a.ageWeeks - b.ageWeeks);

  // Calculate max age (last measurement + 4 weeks)
  const maxAge =
    dataPoints.length > 0 ? Math.max(...dataPoints.map((p) => p.ageWeeks)) + 4 : 6;

  // Generate percentile curve data
  const percentileValues = {
    p3: [] as Array<{ ageWeeks: number; value: number }>,
    p15: [] as Array<{ ageWeeks: number; value: number }>,
    p50: [] as Array<{ ageWeeks: number; value: number }>,
    p85: [] as Array<{ ageWeeks: number; value: number }>,
    p97: [] as Array<{ ageWeeks: number; value: number }>,
  };

  for (let week = 0; week <= maxAge; week += 0.25) {
    const lms = getLMSForWeek(week, type);
    percentileValues.p3.push({ ageWeeks: week, value: lmsPercentileValue(lms.L, lms.M, lms.S, 3) });
    percentileValues.p15.push({ ageWeeks: week, value: lmsPercentileValue(lms.L, lms.M, lms.S, 15) });
    percentileValues.p50.push({ ageWeeks: week, value: lmsPercentileValue(lms.L, lms.M, lms.S, 50) });
    percentileValues.p85.push({ ageWeeks: week, value: lmsPercentileValue(lms.L, lms.M, lms.S, 85) });
    percentileValues.p97.push({ ageWeeks: week, value: lmsPercentileValue(lms.L, lms.M, lms.S, 97) });
  }

  // Calculate Y-axis range
  const p3_week0 = lmsPercentileValue(lmsArray[0].L, lmsArray[0].M, lmsArray[0].S, 3);
  const p97_maxweek = lmsPercentileValue(
    getLMSForWeek(maxAge, type).L,
    getLMSForWeek(maxAge, type).M,
    getLMSForWeek(maxAge, type).S,
    97
  );
  const allValues = [p3_week0 - 0.5, p97_maxweek, ...dataPoints.map((p) => p.value)];
  const minY = Math.floor(Math.min(...allValues) * 2) / 2;
  const maxY = Math.ceil(Math.max(...allValues) * 2) / 2;

  // X-axis ticks - max 6-7 labels, whole weeks only
  const xAxisTicks = Array.from({ length: Math.min(8, Math.floor(maxAge) + 1) }, (_, i) =>
    Math.floor((i * maxAge) / 7)
  ).filter((v, i, arr) => i === 0 || v > arr[i - 1]);

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-gradient-to-b from-[var(--rho-cream)]/5 to-transparent rounded-2xl p-6 overflow-hidden">
        {dataPoints.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--rho-cream)/10" />
              <XAxis
                type="number"
                dataKey="ageWeeks"
                domain={[0, maxAge]}
                ticks={xAxisTicks}
                label={{ value: "Weken oud", position: "bottom", offset: 10 }}
                tick={{ fontSize: 11, fill: "var(--rho-cream)/70" }}
              />
              <YAxis
                domain={[minY, maxY]}
                label={{ value: label, angle: -90, position: "left", offset: 10 }}
                tick={{ fontSize: 11, fill: "var(--rho-cream)/70" }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255, 255, 255, 0.2)" }} />

              {/* Percentile lines */}
              <Line
                data={percentileValues.p3}
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                name="P3"
              />
              <Line
                data={percentileValues.p15}
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                name="P15"
              />
              <Line
                data={percentileValues.p50}
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.7)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
                name="P50"
              />
              <Line
                data={percentileValues.p85}
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.35)"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                name="P85"
              />
              <Line
                data={percentileValues.p97}
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
                name="P97"
              />

              {/* Data points - larger white circles with prominent ring */}
              <Line
                data={dataPoints}
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={2}
                dot={{
                  fill: "white",
                  r: 7,
                  stroke: "rgba(255, 255, 255, 0.6)",
                  strokeWidth: 3,
                }}
                isAnimationActive={false}
                onClick={(e: any) => {
                  if (e.payload) setSelectedPoint(e.payload);
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center text-[var(--rho-cream)]/40">
            Geen metingen beschikbaar
          </div>
        )}
      </div>

      {/* Inline tooltip - compact */}
      {selectedPoint && (
        <div className="bg-[var(--rho-cream)]/10 border border-[var(--rho-cream)]/20 rounded-lg p-3 space-y-1 text-sm">
          <p className="text-[var(--rho-cream)]/60">{formatDate(selectedPoint.date)}</p>
          <p className="text-[var(--rho-cream)] font-semibold">
            {selectedPoint.value.toFixed(2)} {unit}
          </p>
          <p className="text-[var(--rho-gold)]">Percentiel: P{selectedPoint.percentile}</p>
        </div>
      )}

      {/* Measurements list - compact */}
      {dataPoints.length > 0 && (
        <div className="space-y-2 border-t border-[var(--rho-cream)]/10 pt-4">
          <p className="text-[var(--rho-cream)]/40 text-xs uppercase">Metingen ({dataPoints.length})</p>
          <div className="space-y-1">
            {dataPoints.map((point) => (
              <button
                key={point.date}
                onClick={() => setSelectedPoint(point)}
                className="w-full flex justify-between items-center p-2 rounded bg-[var(--rho-cream)]/5 hover:bg-[var(--rho-cream)]/10 text-xs transition-colors"
              >
                <span className="text-[var(--rho-cream)]/60">{formatDate(point.date)}</span>
                <span className="text-[var(--rho-cream)]">{point.value.toFixed(2)} {unit}</span>
                <span className="text-[var(--rho-gold)]">P{point.percentile}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add measurement button */}
      <a
        href="?new=1"
        className="block w-full text-center bg-[var(--rho-cream)]/10 hover:bg-[var(--rho-cream)]/15 text-[var(--rho-cream)]/70 hover:text-[var(--rho-cream)] font-body py-2.5 rounded-lg text-sm transition-colors border border-[var(--rho-cream)]/20"
      >
        + {label} toevoegen
      </a>
    </div>
  );
}
