"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

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
  unit: string;
}

export function GroeiPercentielChart({ measurements, type, unit }: Props) {
  // Mock data - Baby+ style percentile bands
  const mockData = [
    { week: 0, p1: 3, p5: 3.2, p10: 3.3, p25: 3.5, p50: 3.8, p75: 4.0, p90: 4.3, p95: 4.5, p99: 4.8 },
    { week: 4, p1: 4.5, p5: 5.0, p10: 5.3, p25: 5.8, p50: 6.5, p75: 7.2, p90: 7.8, p95: 8.2, p99: 8.8 },
    { week: 8, p1: 5.5, p5: 6.2, p10: 6.8, p25: 7.6, p50: 8.5, p75: 9.4, p90: 10.2, p95: 10.8, p99: 11.5 },
    { week: 12, p1: 6.2, p5: 7.1, p10: 7.8, p25: 8.8, p50: 10.0, p75: 11.2, p90: 12.3, p95: 13.0, p99: 14.0 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mockData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--rho-cream)/10" />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--rho-cream)/40" }} stroke="var(--rho-cream)/20" />
        <YAxis tick={{ fontSize: 12, fill: "var(--rho-cream)/40" }} stroke="var(--rho-cream)/20" />

        {/* Percentile bands - pink gradient (Baby+ style) */}
        <Line type="monotone" dataKey="p1" stroke="#C8102E" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p5" stroke="#D93A5C" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p10" stroke="#E85780" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p25" stroke="#F073A4" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p50" stroke="#F8A0C8" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p75" stroke="#FDB8D6" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p90" stroke="#FDCDE2" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p95" stroke="#FEE0EA" strokeWidth={1} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="p99" stroke="#FEF0F5" strokeWidth={1} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
