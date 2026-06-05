/**
 * Kind en Gezin Growth Curves for Girls (0-5 years)
 * Based on WHO/Flemish growth standards
 * Data structure: percentiles P1, P5, P10, P25, P50, P75, P90, P95, P99
 */

export interface PercentileData {
  ageWeeks: number;
  percentiles: {
    p1: number;
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export interface WeightForLengthData {
  lengthCm: number;
  percentiles: {
    p1: number;
    p5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

/**
 * Weight-for-Age (kg) - Girls 0-260 weeks
 */
export const KG_WEIGHT: PercentileData[] = [
  { ageWeeks: 0, percentiles: { p1: 2.5, p5: 2.8, p10: 3.0, p25: 3.2, p50: 3.4, p75: 3.6, p90: 3.8, p95: 4.0, p99: 4.3 } },
  { ageWeeks: 1, percentiles: { p1: 2.8, p5: 3.1, p10: 3.3, p25: 3.5, p50: 3.8, p75: 4.0, p90: 4.3, p95: 4.5, p99: 4.9 } },
  { ageWeeks: 2, percentiles: { p1: 3.1, p5: 3.4, p10: 3.6, p25: 3.9, p50: 4.2, p75: 4.5, p90: 4.8, p95: 5.0, p99: 5.5 } },
  { ageWeeks: 4, percentiles: { p1: 3.7, p5: 4.1, p10: 4.3, p25: 4.7, p50: 5.1, p75: 5.5, p90: 5.9, p95: 6.2, p99: 6.8 } },
  { ageWeeks: 8, percentiles: { p1: 4.8, p5: 5.3, p10: 5.6, p25: 6.2, p50: 6.8, p75: 7.4, p90: 8.0, p95: 8.4, p99: 9.2 } },
  { ageWeeks: 12, percentiles: { p1: 5.6, p5: 6.1, p10: 6.5, p25: 7.2, p50: 8.0, p75: 8.7, p90: 9.5, p95: 10.0, p99: 11.0 } },
  { ageWeeks: 16, percentiles: { p1: 6.2, p5: 6.8, p10: 7.3, p25: 8.1, p50: 9.0, p75: 9.8, p90: 10.7, p95: 11.3, p99: 12.5 } },
  { ageWeeks: 20, percentiles: { p1: 6.8, p5: 7.4, p10: 8.0, p25: 8.9, p50: 9.9, p75: 10.8, p90: 11.8, p95: 12.5, p99: 13.8 } },
  { ageWeeks: 24, percentiles: { p1: 7.3, p5: 8.0, p10: 8.6, p25: 9.6, p50: 10.7, p75: 11.7, p90: 12.8, p95: 13.5, p99: 15.0 } },
  { ageWeeks: 26, percentiles: { p1: 7.5, p5: 8.3, p10: 8.9, p25: 9.9, p50: 11.1, p75: 12.1, p90: 13.2, p95: 14.0, p99: 15.5 } },
  { ageWeeks: 30, percentiles: { p1: 8.0, p5: 8.8, p10: 9.5, p25: 10.6, p50: 11.8, p75: 12.9, p90: 14.1, p95: 14.9, p99: 16.6 } },
  { ageWeeks: 34, percentiles: { p1: 8.4, p5: 9.3, p10: 10.0, p25: 11.2, p50: 12.5, p75: 13.7, p90: 15.0, p95: 15.9, p99: 17.7 } },
  { ageWeeks: 38, percentiles: { p1: 8.8, p5: 9.7, p10: 10.5, p25: 11.7, p50: 13.1, p75: 14.4, p90: 15.8, p95: 16.8, p99: 18.7 } },
  { ageWeeks: 42, percentiles: { p1: 9.1, p5: 10.1, p10: 10.9, p25: 12.2, p50: 13.6, p75: 15.0, p90: 16.5, p95: 17.5, p99: 19.6 } },
  { ageWeeks: 52, percentiles: { p1: 9.8, p5: 10.9, p10: 11.8, p25: 13.2, p50: 14.8, p75: 16.3, p90: 17.9, p95: 19.0, p99: 21.2 } },
  { ageWeeks: 65, percentiles: { p1: 10.7, p5: 11.9, p10: 12.9, p25: 14.5, p50: 16.3, p75: 18.1, p90: 20.0, p95: 21.2, p99: 23.6 } },
  { ageWeeks: 78, percentiles: { p1: 11.6, p5: 12.9, p10: 14.0, p25: 15.8, p50: 17.8, p75: 19.8, p90: 21.9, p95: 23.3, p99: 26.0 } },
  { ageWeeks: 104, percentiles: { p1: 13.3, p5: 14.8, p10: 16.1, p25: 18.2, p50: 20.6, p75: 23.0, p90: 25.6, p95: 27.2, p99: 30.2 } },
  { ageWeeks: 130, percentiles: { p1: 14.9, p5: 16.6, p10: 18.1, p25: 20.5, p50: 23.3, p75: 26.2, p90: 29.2, p95: 31.0, p99: 34.4 } },
  { ageWeeks: 156, percentiles: { p1: 16.4, p5: 18.3, p10: 19.9, p25: 22.6, p50: 25.8, p75: 29.1, p90: 32.4, p95: 34.5, p99: 38.1 } },
  { ageWeeks: 182, percentiles: { p1: 17.8, p5: 19.9, p10: 21.6, p25: 24.6, p50: 28.1, p75: 31.8, p90: 35.5, p95: 37.8, p99: 41.8 } },
  { ageWeeks: 208, percentiles: { p1: 19.1, p5: 21.4, p10: 23.2, p25: 26.5, p50: 30.3, p75: 34.3, p90: 38.3, p95: 40.8, p99: 45.2 } },
  { ageWeeks: 234, percentiles: { p1: 20.3, p5: 22.8, p10: 24.7, p25: 28.2, p50: 32.3, p75: 36.6, p90: 41.0, p95: 43.7, p99: 48.4 } },
  { ageWeeks: 260, percentiles: { p1: 21.4, p5: 24.1, p10: 26.1, p25: 29.8, p50: 34.2, p75: 38.8, p90: 43.5, p95: 46.4, p99: 51.4 } },
];

/**
 * Length-for-Age (cm) - Girls 0-260 weeks
 */
export const KG_LENGTH: PercentileData[] = [
  { ageWeeks: 0, percentiles: { p1: 45.0, p5: 46.0, p10: 46.5, p25: 47.3, p50: 48.5, p75: 49.5, p90: 50.5, p95: 51.0, p99: 52.0 } },
  { ageWeeks: 1, percentiles: { p1: 45.5, p5: 46.6, p10: 47.2, p25: 48.0, p50: 49.2, p75: 50.2, p90: 51.2, p95: 51.8, p99: 52.8 } },
  { ageWeeks: 2, percentiles: { p1: 46.1, p5: 47.2, p10: 47.8, p25: 48.7, p50: 50.0, p75: 51.0, p90: 52.0, p95: 52.6, p99: 53.6 } },
  { ageWeeks: 4, percentiles: { p1: 47.2, p5: 48.4, p10: 49.1, p25: 50.1, p50: 51.5, p75: 52.6, p90: 53.7, p95: 54.3, p99: 55.5 } },
  { ageWeeks: 8, percentiles: { p1: 50.0, p5: 51.2, p10: 52.0, p25: 53.2, p50: 54.7, p75: 56.0, p90: 57.3, p95: 58.1, p99: 59.5 } },
  { ageWeeks: 12, percentiles: { p1: 52.2, p5: 53.5, p10: 54.4, p25: 55.7, p50: 57.3, p75: 58.8, p90: 60.2, p95: 61.0, p99: 62.6 } },
  { ageWeeks: 16, percentiles: { p1: 53.9, p5: 55.3, p10: 56.2, p25: 57.6, p50: 59.3, p75: 60.9, p90: 62.4, p95: 63.3, p99: 64.9 } },
  { ageWeeks: 20, percentiles: { p1: 55.3, p5: 56.8, p10: 57.7, p25: 59.2, p50: 61.0, p75: 62.7, p90: 64.3, p95: 65.2, p99: 66.9 } },
  { ageWeeks: 24, percentiles: { p1: 56.5, p5: 58.1, p10: 59.0, p25: 60.6, p50: 62.5, p75: 64.2, p90: 65.9, p95: 66.8, p99: 68.6 } },
  { ageWeeks: 26, percentiles: { p1: 57.0, p5: 58.6, p10: 59.6, p25: 61.2, p50: 63.1, p75: 64.8, p90: 66.5, p95: 67.4, p99: 69.3 } },
  { ageWeeks: 30, percentiles: { p1: 58.1, p5: 59.7, p10: 60.8, p25: 62.4, p50: 64.4, p75: 66.2, p90: 68.0, p95: 68.9, p99: 70.8 } },
  { ageWeeks: 34, percentiles: { p1: 59.1, p5: 60.8, p10: 61.9, p25: 63.6, p50: 65.6, p75: 67.5, p90: 69.3, p95: 70.3, p99: 72.2 } },
  { ageWeeks: 38, percentiles: { p1: 60.1, p5: 61.8, p10: 62.9, p25: 64.6, p50: 66.7, p75: 68.6, p90: 70.5, p95: 71.5, p99: 73.5 } },
  { ageWeeks: 42, percentiles: { p1: 61.0, p5: 62.7, p10: 63.9, p25: 65.6, p50: 67.7, p75: 69.7, p90: 71.6, p95: 72.6, p99: 74.7 } },
  { ageWeeks: 52, percentiles: { p1: 62.8, p5: 64.6, p10: 65.8, p25: 67.6, p50: 69.8, p75: 72.0, p90: 74.0, p95: 75.1, p99: 77.3 } },
  { ageWeeks: 65, percentiles: { p1: 65.2, p5: 67.1, p10: 68.4, p25: 70.4, p50: 72.7, p75: 75.1, p90: 77.3, p95: 78.4, p99: 80.8 } },
  { ageWeeks: 78, percentiles: { p1: 67.2, p5: 69.2, p10: 70.6, p25: 72.8, p50: 75.3, p75: 77.8, p90: 80.1, p95: 81.3, p99: 83.8 } },
  { ageWeeks: 104, percentiles: { p1: 71.2, p5: 73.4, p10: 74.9, p25: 77.4, p50: 80.1, p75: 82.9, p90: 85.4, p95: 86.8, p99: 89.5 } },
  { ageWeeks: 130, percentiles: { p1: 74.4, p5: 76.8, p10: 78.4, p25: 81.1, p50: 84.1, p75: 87.1, p90: 89.8, p95: 91.3, p99: 94.2 } },
  { ageWeeks: 156, percentiles: { p1: 77.0, p5: 79.6, p10: 81.3, p25: 84.2, p50: 87.3, p75: 90.5, p90: 93.4, p95: 94.9, p99: 98.0 } },
  { ageWeeks: 182, percentiles: { p1: 79.1, p5: 81.9, p10: 83.7, p25: 86.8, p50: 90.1, p75: 93.4, p90: 96.4, p95: 98.0, p99: 101.2 } },
  { ageWeeks: 208, percentiles: { p1: 80.9, p5: 83.8, p10: 85.7, p25: 88.9, p50: 92.3, p75: 95.8, p90: 98.9, p95: 100.6, p99: 103.9 } },
  { ageWeeks: 234, percentiles: { p1: 82.4, p5: 85.4, p10: 87.4, p25: 90.7, p50: 94.2, p75: 97.8, p90: 101.0, p95: 102.8, p99: 106.2 } },
  { ageWeeks: 260, percentiles: { p1: 83.8, p5: 86.9, p10: 89.0, p25: 92.4, p50: 95.9, p75: 99.6, p90: 102.9, p95: 104.7, p99: 108.2 } },
];

/**
 * Head Circumference-for-Age (cm) - Girls 0-260 weeks
 */
export const KG_HEAD: PercentileData[] = [
  { ageWeeks: 0, percentiles: { p1: 31.0, p5: 32.0, p10: 32.5, p25: 33.2, p50: 34.0, p75: 34.8, p90: 35.5, p95: 36.0, p99: 37.0 } },
  { ageWeeks: 1, percentiles: { p1: 31.5, p5: 32.6, p10: 33.1, p25: 33.9, p50: 34.7, p75: 35.5, p90: 36.2, p95: 36.8, p99: 37.8 } },
  { ageWeeks: 2, percentiles: { p1: 32.1, p5: 33.2, p10: 33.8, p25: 34.6, p50: 35.5, p75: 36.3, p90: 37.0, p95: 37.6, p99: 38.6 } },
  { ageWeeks: 4, percentiles: { p1: 33.2, p5: 34.4, p10: 35.0, p25: 35.9, p50: 36.9, p75: 37.8, p90: 38.6, p95: 39.2, p99: 40.3 } },
  { ageWeeks: 8, percentiles: { p1: 35.4, p5: 36.7, p10: 37.4, p25: 38.4, p50: 39.5, p75: 40.5, p90: 41.4, p95: 42.0, p99: 43.2 } },
  { ageWeeks: 12, percentiles: { p1: 37.2, p5: 38.6, p10: 39.3, p25: 40.4, p50: 41.5, p75: 42.6, p90: 43.5, p95: 44.2, p99: 45.4 } },
  { ageWeeks: 16, percentiles: { p1: 38.6, p5: 40.1, p10: 40.8, p25: 41.9, p50: 43.1, p75: 44.2, p90: 45.1, p95: 45.8, p99: 47.1 } },
  { ageWeeks: 20, percentiles: { p1: 39.8, p5: 41.3, p10: 42.1, p25: 43.2, p50: 44.5, p75: 45.7, p90: 46.7, p95: 47.3, p99: 48.7 } },
  { ageWeeks: 24, percentiles: { p1: 40.8, p5: 42.4, p10: 43.2, p25: 44.3, p50: 45.6, p75: 46.8, p90: 47.8, p95: 48.5, p99: 50.0 } },
  { ageWeeks: 26, percentiles: { p1: 41.2, p5: 42.8, p10: 43.6, p25: 44.7, p50: 46.1, p75: 47.3, p90: 48.3, p95: 49.0, p99: 50.5 } },
  { ageWeeks: 30, percentiles: { p1: 42.0, p5: 43.6, p10: 44.5, p25: 45.7, p50: 47.1, p75: 48.4, p90: 49.5, p95: 50.2, p99: 51.8 } },
  { ageWeeks: 34, percentiles: { p1: 42.8, p5: 44.5, p10: 45.3, p25: 46.6, p50: 48.0, p75: 49.4, p90: 50.5, p95: 51.2, p99: 52.9 } },
  { ageWeeks: 38, percentiles: { p1: 43.5, p5: 45.2, p10: 46.1, p25: 47.4, p50: 48.9, p75: 50.3, p90: 51.4, p95: 52.2, p99: 53.9 } },
  { ageWeeks: 42, percentiles: { p1: 44.2, p5: 45.9, p10: 46.8, p25: 48.2, p50: 49.7, p75: 51.1, p90: 52.3, p95: 53.0, p99: 54.8 } },
  { ageWeeks: 52, percentiles: { p1: 45.6, p5: 47.4, p10: 48.3, p25: 49.8, p50: 51.4, p75: 52.9, p90: 54.2, p95: 55.0, p99: 56.9 } },
  { ageWeeks: 65, percentiles: { p1: 47.4, p5: 49.3, p10: 50.3, p25: 51.9, p50: 53.6, p75: 55.2, p90: 56.6, p95: 57.4, p99: 59.5 } },
  { ageWeeks: 78, percentiles: { p1: 48.9, p5: 50.9, p10: 52.0, p25: 53.6, p50: 55.4, p75: 57.1, p90: 58.5, p95: 59.4, p99: 61.5 } },
  { ageWeeks: 104, percentiles: { p1: 51.4, p5: 53.6, p10: 54.8, p25: 56.5, p50: 58.5, p75: 60.4, p90: 62.0, p95: 62.9, p99: 65.2 } },
  { ageWeeks: 130, percentiles: { p1: 53.2, p5: 55.6, p10: 56.8, p25: 58.6, p50: 60.7, p75: 62.7, p90: 64.4, p95: 65.4, p99: 67.8 } },
  { ageWeeks: 156, percentiles: { p1: 54.6, p5: 57.1, p10: 58.4, p25: 60.3, p50: 62.5, p75: 64.6, p90: 66.3, p95: 67.4, p99: 69.9 } },
  { ageWeeks: 182, percentiles: { p1: 55.7, p5: 58.2, p10: 59.6, p25: 61.5, p50: 63.7, p75: 65.9, p90: 67.6, p95: 68.7, p99: 71.3 } },
  { ageWeeks: 208, percentiles: { p1: 56.5, p5: 59.1, p10: 60.5, p25: 62.4, p50: 64.6, p75: 66.8, p90: 68.5, p95: 69.6, p99: 72.3 } },
  { ageWeeks: 234, percentiles: { p1: 57.2, p5: 59.8, p10: 61.2, p25: 63.1, p50: 65.3, p75: 67.5, p90: 69.2, p95: 70.3, p99: 73.0 } },
  { ageWeeks: 260, percentiles: { p1: 57.8, p5: 60.4, p10: 61.8, p25: 63.7, p50: 65.9, p75: 68.1, p90: 69.8, p95: 70.9, p99: 73.6 } },
];

/**
 * Weight-for-Length (kg) - Girls 45-120cm
 */
export const KG_WEIGHT_FOR_LENGTH: WeightForLengthData[] = [
  { lengthCm: 45, percentiles: { p1: 2.0, p5: 2.2, p10: 2.3, p25: 2.5, p50: 2.7, p75: 2.9, p90: 3.1, p95: 3.3, p99: 3.6 } },
  { lengthCm: 50, percentiles: { p1: 2.8, p5: 3.1, p10: 3.3, p25: 3.6, p50: 4.0, p75: 4.4, p90: 4.8, p95: 5.1, p99: 5.7 } },
  { lengthCm: 55, percentiles: { p1: 3.8, p5: 4.2, p10: 4.5, p25: 5.0, p50: 5.5, p75: 6.0, p90: 6.6, p95: 7.0, p99: 7.8 } },
  { lengthCm: 60, percentiles: { p1: 5.0, p5: 5.5, p10: 5.9, p25: 6.5, p50: 7.1, p75: 7.7, p90: 8.4, p95: 8.9, p99: 9.9 } },
  { lengthCm: 65, percentiles: { p1: 6.2, p5: 6.8, p10: 7.3, p25: 8.0, p50: 8.8, p75: 9.6, p90: 10.4, p95: 11.0, p99: 12.2 } },
  { lengthCm: 70, percentiles: { p1: 7.6, p5: 8.3, p10: 8.9, p25: 9.7, p50: 10.7, p75: 11.6, p90: 12.6, p95: 13.3, p99: 14.7 } },
  { lengthCm: 75, percentiles: { p1: 9.0, p5: 9.8, p10: 10.5, p25: 11.5, p50: 12.6, p75: 13.7, p90: 14.9, p95: 15.7, p99: 17.3 } },
  { lengthCm: 80, percentiles: { p1: 10.5, p5: 11.4, p10: 12.2, p25: 13.3, p50: 14.5, p75: 15.8, p90: 17.1, p95: 18.1, p99: 19.9 } },
  { lengthCm: 85, percentiles: { p1: 12.0, p5: 13.0, p10: 13.9, p25: 15.1, p50: 16.5, p75: 17.9, p90: 19.4, p95: 20.5, p99: 22.5 } },
  { lengthCm: 90, percentiles: { p1: 13.5, p5: 14.6, p10: 15.6, p25: 17.0, p50: 18.5, p75: 20.1, p90: 21.8, p95: 23.0, p99: 25.2 } },
  { lengthCm: 95, percentiles: { p1: 15.1, p5: 16.3, p10: 17.4, p25: 18.9, p50: 20.6, p75: 22.4, p90: 24.2, p95: 25.6, p99: 28.0 } },
  { lengthCm: 100, percentiles: { p1: 16.7, p5: 18.0, p10: 19.2, p25: 20.9, p50: 22.7, p75: 24.7, p90: 26.7, p95: 28.2, p99: 30.8 } },
  { lengthCm: 105, percentiles: { p1: 18.3, p5: 19.8, p10: 21.1, p25: 22.9, p50: 25.0, p75: 27.1, p90: 29.3, p95: 30.9, p99: 33.7 } },
  { lengthCm: 110, percentiles: { p1: 20.0, p5: 21.6, p10: 23.0, p25: 25.0, p50: 27.2, p75: 29.6, p90: 32.0, p95: 33.8, p99: 36.7 } },
  { lengthCm: 115, percentiles: { p1: 21.7, p5: 23.5, p10: 25.0, p25: 27.2, p50: 29.6, p75: 32.1, p90: 34.8, p95: 36.7, p99: 39.8 } },
  { lengthCm: 120, percentiles: { p1: 23.6, p5: 25.5, p10: 27.1, p25: 29.5, p50: 32.1, p75: 34.8, p90: 37.6, p95: 39.7, p99: 43.0 } },
];
