"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

// WHO P50 referentiewaarden voor meisjes 0-12 maanden (gewicht in gram)
const WHO_WEIGHT_P50 = [
  3300, 4200, 5100, 5800, 6400, 6900, 7300, 7600, 7900, 8200, 8500, 8700, 8900,
];
const WHO_WEIGHT_P3 = [
  2400, 3200, 4000, 4600, 5100, 5500, 5800, 6100, 6300, 6600, 6800, 7000, 7100,
];
const WHO_WEIGHT_P97 = [
  4300, 5400, 6600, 7600, 8300, 8900, 9500, 9900, 10400, 10800, 11200, 11500, 11800,
];

type Meting = {
  id: string;
  date: string;
  weight_grams: number | null;
  height_mm: number | null;
  head_cm: number | null;
};

interface Props {
  metingen: Meting[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a0810] border border-[var(--rho-cream)]/20 rounded-xl px-3 py-2 text-xs font-body">
      <p className="text-[var(--rho-cream)]/60 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function GroeiGrafiek({ metingen }: Props) {
  const data = metingen
    .filter((m) => m.weight_grams)
    .map((m) => ({
      datum: format(new Date(m.date), "d MMM", { locale: nl }),
      gewicht: Math.round((m.weight_grams! / 1000) * 100) / 100,
    }));

  if (data.length < 2) return null;

  return (
    <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-4">
      <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider mb-4">
        Gewicht (kg)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="datum"
            tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10, fontFamily: "var(--font-lora)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10, fontFamily: "var(--font-lora)" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="gewicht"
            name="Rho"
            stroke="var(--rho-gold)"
            strokeWidth={2.5}
            dot={{ fill: "var(--rho-gold)", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "var(--rho-gold)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
