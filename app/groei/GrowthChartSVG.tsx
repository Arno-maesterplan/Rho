"use client";

import { lmsToPercentile, lmsPercentileValue, getLMSForWeek } from "@/lib/who-growth-standards";
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

export function GrowthChartSVG({ measurements, type, label, unit }: Props) {
  // Calculate age in weeks from birth
  const calculateAgeInWeeks = (date: string | Date): number => {
    const birth = new Date(BIRTH_DATE);
    const measurement = new Date(date);
    const diffMs = measurement.getTime() - birth.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  };

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

  if (dataPoints.length === 0) {
    return (
      <div className="h-[700px] bg-gradient-to-b from-[var(--rho-cream)]/5 to-transparent rounded-2xl flex items-center justify-center text-[var(--rho-cream)]/40">
        Geen metingen beschikbaar
      </div>
    );
  }

  // Calculate dimensions
  const maxAge = Math.max(...dataPoints.map((p) => p.ageWeeks)) + 4;
  const allValues = dataPoints.map((p) => p.value);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.2;
  const yMin = minValue - padding;
  const yMax = maxValue + padding;

  // SVG dimensions
  const width = 700;
  const height = 700;
  const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Scale functions
  const scaleX = (ageWeeks: number) => margin.left + (ageWeeks / maxAge) * chartWidth;
  const scaleY = (value: number) => margin.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;

  // Generate WHO curves
  const generateCurve = (percentile: number) => {
    const points = [];
    for (let week = 0; week <= maxAge; week += 0.5) {
      const lms = getLMSForWeek(week, type);
      const value = lmsPercentileValue(lms.L, lms.M, lms.S, percentile);
      points.push({ week, value });
    }
    return points.map((p) => `${scaleX(p.week)},${scaleY(p.value)}`).join(" ");
  };

  return (
    <div className="bg-gradient-to-b from-[var(--rho-cream)]/5 to-transparent rounded-2xl p-4 overflow-hidden">
      <svg width="100%" height="700" viewBox={`0 0 ${width} ${height}`} className="text-[var(--rho-cream)]">
        {/* Background */}
        <rect width={width} height={height} fill="none" />

        {/* Grid lines */}
        <g stroke="var(--rho-cream)" strokeOpacity="0.1" strokeWidth="1">
          {/* Vertical grid */}
          {Array.from({ length: Math.floor(maxAge) + 1 }).map((_, i) => {
            const x = scaleX(i);
            return <line key={`vgrid-${i}`} x1={x} y1={margin.top} x2={x} y2={height - margin.bottom} />;
          })}
          {/* Horizontal grid */}
          {Array.from({ length: 5 }).map((_, i) => {
            const y = margin.top + (i / 4) * chartHeight;
            return <line key={`hgrid-${i}`} x1={margin.left} y1={y} x2={width - margin.right} y2={y} />;
          })}
        </g>

        {/* WHO Percentile curves - P50 ONLY for now */}
        <polyline
          key="curve-p50"
          points={generateCurve(50)}
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Y Axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={height - margin.bottom}
          stroke="var(--rho-cream)"
          strokeOpacity="0.3"
          strokeWidth="2"
        />

        {/* X Axis */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="var(--rho-cream)"
          strokeOpacity="0.3"
          strokeWidth="2"
        />

        {/* Y Axis labels */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = yMin + (i / 4) * (yMax - yMin);
          const y = scaleY(value);
          return (
            <g key={`ylabel-${i}`}>
              <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y} stroke="var(--rho-cream)" strokeOpacity="0.5" />
              <text
                x={margin.left - 15}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="var(--rho-cream)"
                opacity="0.7"
              >
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* X Axis labels */}
        {Array.from({ length: Math.min(8, Math.floor(maxAge) + 1) }).map((_, i) => {
          const week = Math.floor((i / 7) * maxAge);
          const x = scaleX(week);
          return (
            <g key={`xlabel-${i}`}>
              <line x1={x} y1={height - margin.bottom} x2={x} y2={height - margin.bottom + 5} stroke="var(--rho-cream)" strokeOpacity="0.5" />
              <text
                x={x}
                y={height - margin.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="var(--rho-cream)"
                opacity="0.7"
              >
                {week}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={20} y={height / 2} textAnchor="middle" fontSize="14" fill="var(--rho-cream)" opacity="0.6" transform={`rotate(-90 20 ${height / 2})`}>
          {label}
        </text>
        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="14" fill="var(--rho-cream)" opacity="0.6">
          Weken oud
        </text>

        {/* Data points */}
        {dataPoints.map((point, idx) => {
          const x = scaleX(point.ageWeeks);
          const y = scaleY(point.value);
          return (
            <g key={`point-${idx}`}>
              <circle cx={x} cy={y} r="4" fill="white" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
            </g>
          );
        })}
      </svg>

      {/* Measurements list */}
      {dataPoints.length > 0 && (
        <div className="space-y-2 border-t border-[var(--rho-cream)]/10 pt-4 mt-4">
          <p className="text-[var(--rho-cream)]/40 text-xs uppercase">Metingen ({dataPoints.length})</p>
          <div className="space-y-1">
            {dataPoints.map((point) => (
              <div
                key={point.date}
                className="w-full flex justify-between items-center p-2 rounded bg-[var(--rho-cream)]/5 text-xs"
              >
                <span className="text-[var(--rho-cream)]/60">{new Date(point.date).toLocaleDateString("nl-NL")}</span>
                <span className="text-[var(--rho-cream)]">{point.value.toFixed(2)} {unit}</span>
                <span className="text-[var(--rho-gold)]">P{point.percentile}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add measurement button */}
      <a
        href="?new=1"
        className="block w-full text-center bg-[var(--rho-cream)]/10 hover:bg-[var(--rho-cream)]/15 text-[var(--rho-cream)]/70 hover:text-[var(--rho-cream)] font-body py-2.5 rounded-lg text-sm transition-colors border border-[var(--rho-cream)]/20 mt-4"
      >
        + {label} toevoegen
      </a>
    </div>
  );
}
