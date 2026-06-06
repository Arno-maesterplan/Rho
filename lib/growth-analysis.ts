/**
 * Growth analysis utilities for calculating percentiles
 */

import { KG_WEIGHT, KG_LENGTH, KG_HEAD, KG_WEIGHT_FOR_LENGTH, PercentileData } from "./kind-gezin-curves";

export interface PercentileResult {
  percentile: number; // 1-99
  band: string; // "P1-P5", "P50", etc.
  label: string; // "Very low", "Average", etc.
}

/**
 * Linear interpolation between two points
 */
function interpolate(x: number, x1: number, y1: number, x2: number, y2: number): number {
  if (x2 === x1) return y1;
  return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
}

/**
 * Find the percentile rank for a given value
 * Returns which percentile (1-99) the value falls into
 */
function findPercentileRank(value: number, ageData: PercentileData): number {
  const p = ageData.percentiles;

  // Build percentile points array (value, percentile)
  const points: [number, number][] = [
    [p.p1, 1],
    [p.p5, 5],
    [p.p10, 10],
    [p.p25, 25],
    [p.p50, 50],
    [p.p75, 75],
    [p.p90, 90],
    [p.p95, 95],
    [p.p99, 99],
  ];

  // Find where value fits
  if (value <= points[0][0]) return 1;
  if (value >= points[points.length - 1][0]) return 99;

  // Find surrounding points and interpolate
  for (let i = 0; i < points.length - 1; i++) {
    if (value >= points[i][0] && value <= points[i + 1][0]) {
      const [v1, p1] = points[i];
      const [v2, p2] = points[i + 1];
      return interpolate(value, v1, p1, v2, p2);
    }
  }

  return 50; // Fallback
}

/**
 * Get closest age data point (with interpolation if needed)
 */
function getAgeData(ageWeeks: number, curveData: PercentileData[]): PercentileData {
  if (ageWeeks <= curveData[0].ageWeeks) return curveData[0];
  if (ageWeeks >= curveData[curveData.length - 1].ageWeeks) return curveData[curveData.length - 1];

  // Find surrounding data points
  for (let i = 0; i < curveData.length - 1; i++) {
    const current = curveData[i];
    const next = curveData[i + 1];

    if (ageWeeks >= current.ageWeeks && ageWeeks < next.ageWeeks) {
      // Interpolate percentiles between these two points
      const ratio = (ageWeeks - current.ageWeeks) / (next.ageWeeks - current.ageWeeks);

      return {
        ageWeeks,
        percentiles: {
          p1: current.percentiles.p1 + ratio * (next.percentiles.p1 - current.percentiles.p1),
          p5: current.percentiles.p5 + ratio * (next.percentiles.p5 - current.percentiles.p5),
          p10: current.percentiles.p10 + ratio * (next.percentiles.p10 - current.percentiles.p10),
          p25: current.percentiles.p25 + ratio * (next.percentiles.p25 - current.percentiles.p25),
          p50: current.percentiles.p50 + ratio * (next.percentiles.p50 - current.percentiles.p50),
          p75: current.percentiles.p75 + ratio * (next.percentiles.p75 - current.percentiles.p75),
          p90: current.percentiles.p90 + ratio * (next.percentiles.p90 - current.percentiles.p90),
          p95: current.percentiles.p95 + ratio * (next.percentiles.p95 - current.percentiles.p95),
          p99: current.percentiles.p99 + ratio * (next.percentiles.p99 - current.percentiles.p99),
        },
      };
    }
  }

  return curveData[curveData.length - 1];
}

/**
 * Calculate percentile for a weight/length/head measurement at given age
 */
export function calculatePercentile(
  value: number,
  ageWeeks: number,
  measurementType: "weight" | "length" | "head"
): PercentileResult {
  try {
    // Validate inputs
    if (!value || value <= 0 || !isFinite(value)) {
      return { percentile: 50, band: "P50", label: "Unable to calculate" };
    }

    if (!isFinite(ageWeeks) || ageWeeks < 0) {
      return { percentile: 50, band: "P50", label: "Invalid age" };
    }

    let curveData: PercentileData[];

    switch (measurementType) {
      case "weight":
        curveData = KG_WEIGHT;
        break;
      case "length":
        curveData = KG_LENGTH;
        break;
      case "head":
        curveData = KG_HEAD;
        break;
      default:
        return { percentile: 50, band: "P50", label: "Unknown measurement type" };
    }

    if (!curveData || curveData.length === 0) {
      return { percentile: 50, band: "P50", label: "No curve data" };
    }

    const ageData = getAgeData(ageWeeks, curveData);
    const percentile = Math.round(findPercentileRank(value, ageData));

    return {
      percentile: Math.max(1, Math.min(99, percentile)),
      band: getPercentileBand(percentile),
      label: getPercentileLabel(percentile),
    };
  } catch (err) {
    console.error("Error calculating percentile:", err);
    return { percentile: 50, band: "P50", label: "Calculation error" };
  }
}

/**
 * Calculate percentile for weight-for-length
 */
export function calculatePercentileWeightForLength(value: number, lengthCm: number): PercentileResult {
  if (lengthCm < 45 || lengthCm > 120) {
    return {
      percentile: 50,
      band: "Out of range",
      label: "Unable to calculate",
    };
  }

  let closestData = KG_WEIGHT_FOR_LENGTH[0];
  let minDiff = Math.abs(lengthCm - closestData.lengthCm);

  for (const data of KG_WEIGHT_FOR_LENGTH) {
    const diff = Math.abs(lengthCm - data.lengthCm);
    if (diff < minDiff) {
      minDiff = diff;
      closestData = data;
    }
  }

  const percentile = Math.round(findPercentileRank(value, closestData as any));

  return {
    percentile,
    band: getPercentileBand(percentile),
    label: getPercentileLabel(percentile),
  };
}

/**
 * Get percentile band label (P1, P5-P10, etc.)
 */
function getPercentileBand(percentile: number): string {
  if (percentile <= 1) return "P1";
  if (percentile <= 5) return "P1-P5";
  if (percentile <= 10) return "P5-P10";
  if (percentile <= 25) return "P10-P25";
  if (percentile <= 50) return "P25-P50";
  if (percentile <= 75) return "P50-P75";
  if (percentile <= 90) return "P75-P90";
  if (percentile <= 95) return "P90-P95";
  if (percentile <= 99) return "P95-P99";
  return "P99";
}

/**
 * Get clinical assessment label
 */
function getPercentileLabel(percentile: number): string {
  if (percentile <= 5) return "Very low";
  if (percentile <= 10) return "Low";
  if (percentile <= 25) return "Below average";
  if (percentile <= 50) return "Average";
  if (percentile <= 75) return "Above average";
  if (percentile <= 90) return "High";
  if (percentile <= 95) return "Very high";
  return "Extreme";
}

/**
 * Calculate age in weeks from birth date
 */
export function calculateAgeInWeeks(birthDate: string | Date): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
}

/**
 * Calculate age in days from birth date
 */
export function calculateAgeInDays(birthDate: string | Date): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
