"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { PercentileData } from "@/lib/kind-gezin-curves";
import { calculateAgeInWeeks } from "@/lib/growth-analysis";

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
  curveData: PercentileData[];
  unit: string;
}

export function GroeiPercentielChart({ measurements, type, curveData, unit }: Props) {
  try {
    // Extract birth date from first measurement
    const birthDate = measurements.length > 0 ? new Date(measurements[0].date) : new Date();
    const BIRTH_DATE = birthDate;

    // Build chart data: combine curve points + measurements
    const chartData: any[] = [];

  // Add all curve percentile points
  for (const agePoint of curveData) {
    const dataPoint: any = {
      ageWeeks: agePoint.ageWeeks,
      label: agePoint.ageWeeks === 0 ? "Birth" : `${Math.round(agePoint.ageWeeks / 4.33)}m`,
      p1: agePoint.percentiles.p1,
      p5: agePoint.percentiles.p5,
      p10: agePoint.percentiles.p10,
      p25: agePoint.percentiles.p25,
      p50: agePoint.percentiles.p50,
      p75: agePoint.percentiles.p75,
      p90: agePoint.percentiles.p90,
      p95: agePoint.percentiles.p95,
      p99: agePoint.percentiles.p99,
    };
    chartData.push(dataPoint);
  }

  // Add measurement points
  for (const m of measurements) {
    const mDate = new Date(m.date);
    const ageWeeks = Math.floor((mDate.getTime() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24 * 7));

    let value = 0;
    if (type === "weight" && m.weight_grams) value = m.weight_grams / 1000;
    if (type === "length" && m.height_mm) value = m.height_mm / 10;
    if (type === "head" && m.head_cm) value = m.head_cm;

    // Find or create data point for this age
    let existingPoint = chartData.find((p) => p.ageWeeks === ageWeeks);
    if (!existingPoint) {
      existingPoint = {
        ageWeeks,
        label: `${Math.round(ageWeeks / 4.33)}m`,
        p1: null,
        p5: null,
        p10: null,
        p25: null,
        p50: null,
        p75: null,
        p90: null,
        p95: null,
        p99: null,
      };
      chartData.push(existingPoint);
    }

    existingPoint.measurement = value;
  }

  // Sort by age
  chartData.sort((a, b) => a.ageWeeks - b.ageWeeks);

  // Color palette for percentiles (magenta to light pink)
  const colors = {
    p1: "#C8102E", // rho-red
    p5: "#D93A5C",
    p10: "#E85780",
    p25: "#F073A4",
    p50: "#F8A0C8",
    p75: "#FDB8D6",
    p90: "#FDCDE2",
    p95: "#FEE0EA",
    p99: "#FEF0F5",
  };

    return (
      <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--rho-cream)/10" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "var(--rho-cream)/40" }}
          stroke="var(--rho-cream)/20"
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--rho-cream)/40" }}
          stroke="var(--rho-cream)/20"
          label={{ value: unit, angle: -90, position: "insideLeft", fill: "var(--rho-cream)/40" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a0810",
            border: "1px solid var(--rho-gold)/30",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "var(--rho-cream)" }}
        />

        {/* Percentile lines */}
        <Line type="monotone" dataKey="p1" stroke={colors.p1} dot={false} isAnimationActive={false} strokeWidth={1.5} />
        <Line type="monotone" dataKey="p5" stroke={colors.p5} dot={false} isAnimationActive={false} strokeWidth={1} />
        <Line type="monotone" dataKey="p10" stroke={colors.p10} dot={false} isAnimationActive={false} strokeWidth={1} />
        <Line
          type="monotone"
          dataKey="p25"
          stroke={colors.p25}
          dot={false}
          isAnimationActive={false}
          strokeWidth={1}
        />
        <Line
          type="monotone"
          dataKey="p50"
          stroke={colors.p50}
          dot={false}
          isAnimationActive={false}
          strokeWidth={2}
          strokeDasharray="0"
        />
        <Line
          type="monotone"
          dataKey="p75"
          stroke={colors.p75}
          dot={false}
          isAnimationActive={false}
          strokeWidth={1}
        />
        <Line
          type="monotone"
          dataKey="p90"
          stroke={colors.p90}
          dot={false}
          isAnimationActive={false}
          strokeWidth={1}
        />
        <Line type="monotone" dataKey="p95" stroke={colors.p95} dot={false} isAnimationActive={false} strokeWidth={1} />
        <Line type="monotone" dataKey="p99" stroke={colors.p99} dot={false} isAnimationActive={false} strokeWidth={1} />

        {/* Measurement data */}
        <Line
          type="monotone"
          dataKey="measurement"
          stroke="var(--rho-gold)"
          dot={{ fill: "var(--rho-gold)", r: 5 }}
          isAnimationActive={false}
          strokeWidth={2}
          name="Meting"
        />
      </LineChart>
      </ResponsiveContainer>
    );
  } catch (err) {
    console.error("Chart render error:", err);
    return <div className="text-red-400 p-4">Error rendering chart</div>;
  }
}
