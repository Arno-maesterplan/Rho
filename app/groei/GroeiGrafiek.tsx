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
import { WHO_WEIGHT, WHO_LENGTH, WHO_HEAD } from "@/lib/who-curves";
import { getRhoAge } from "@/lib/rho";

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
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
}

export function GroeiGrafiek({ metingen }: Props) {
  const { weeks: currentWeeks } = getRhoAge();

  // Gewicht: voeg WHO curve en metingen samen
  const metingenGewicht = metingen
    .filter((m) => m.weight_grams)
    .map((m) => {
      const date = new Date(m.date);
      const birthDate = new Date("2026-05-13T14:12:00");
      const weeks = Math.floor((date.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return {
        week: weeks,
        datum: format(date, "d MMM", { locale: nl }),
        rho: Math.round((m.weight_grams! / 1000) * 100) / 100,
        who: undefined as any,
      };
    });
  const gewichtData = [
    ...WHO_WEIGHT.map((who) => ({ week: who.weeks, datum: `W${who.weeks}`, who: who.kg, rho: undefined as any })),
    ...metingenGewicht,
  ];

  // Lengte: WHO curve en metingen
  const metingenLengte = metingen
    .filter((m) => m.height_mm)
    .map((m) => {
      const date = new Date(m.date);
      const birthDate = new Date("2026-05-13T14:12:00");
      const weeks = Math.floor((date.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return {
        week: weeks,
        datum: format(date, "d MMM", { locale: nl }),
        rho: Math.round((m.height_mm! / 10) * 10) / 10,
        who: undefined as any,
      };
    });
  const lengteData = [
    ...WHO_LENGTH.map((who) => ({ week: who.weeks, datum: `W${who.weeks}`, who: who.cm, rho: undefined as any })),
    ...metingenLengte,
  ];

  // Hoofd: WHO curve en metingen
  const metingenHoofd = metingen
    .filter((m) => m.head_cm)
    .map((m) => {
      const date = new Date(m.date);
      const birthDate = new Date("2026-05-13T14:12:00");
      const weeks = Math.floor((date.getTime() - birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return {
        week: weeks,
        datum: format(date, "d MMM", { locale: nl }),
        rho: Math.round(m.head_cm! * 10) / 10,
        who: undefined as any,
      };
    });
  const hoofdData = [
    ...WHO_HEAD.map((who) => ({ week: who.weeks, datum: `W${who.weeks}`, who: who.cm, rho: undefined as any })),
    ...metingenHoofd,
  ];

  const Grafieken = () => (
    <div className="space-y-6">
      {/* Gewicht */}
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-4">
        <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider mb-4">
          Gewicht (kg)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={gewichtData.sort((a, b) => a.week - b.week)}>
            <XAxis dataKey="datum" tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="who" name="WHO (P50)" stroke="rgba(212,168,83,0.3)" strokeWidth={2} dot={false} />
            {metingen.some((m) => m.weight_grams) && (
              <Line type="monotone" dataKey="rho" name="Rho" stroke="var(--rho-gold)" strokeWidth={2.5} dot={{ fill: "var(--rho-gold)", r: 4 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lengte */}
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-4">
        <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider mb-4">
          Lengte (cm)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lengteData.sort((a, b) => a.week - b.week)}>
            <XAxis dataKey="datum" tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="who" name="WHO (P50)" stroke="rgba(212,168,83,0.3)" strokeWidth={2} dot={false} />
            {metingen.some((m) => m.height_mm) && (
              <Line type="monotone" dataKey="rho" name="Rho" stroke="var(--rho-gold)" strokeWidth={2.5} dot={{ fill: "var(--rho-gold)", r: 4 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hoofd */}
      <div className="bg-[var(--rho-cream)]/5 border border-[var(--rho-cream)]/10 rounded-2xl p-4">
        <p className="text-[var(--rho-cream)]/50 text-xs font-body uppercase tracking-wider mb-4">
          Hoofdomtrek (cm)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={hoofdData.sort((a, b) => a.week - b.week)}>
            <XAxis dataKey="datum" tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(245,236,215,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="who" name="WHO (P50)" stroke="rgba(212,168,83,0.3)" strokeWidth={2} dot={false} />
            {metingen.some((m) => m.head_cm) && (
              <Line type="monotone" dataKey="rho" name="Rho" stroke="var(--rho-gold)" strokeWidth={2.5} dot={{ fill: "var(--rho-gold)", r: 4 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return <Grafieken />;
}
