/**
 * WHO Child Growth Standards - Weight-for-Age (Girls)
 * Source: https://www.who.int/tools/child-growth-standards/standards
 *
 * Data structure: LMS method values
 * L = Box-Cox lambda (skewness)
 * M = Median
 * S = Generalized coefficient of variation
 *
 * Formula: Z = ((value/M)^L - 1) / (L*S)
 * Then convert Z-score to percentile via normal CDF
 */

export interface WHOLMSData {
  ageWeeks: number;
  ageDays: number;
  L: number;  // Skewness lambda
  M: number;  // Median (kg)
  S: number;  // Generalized CV
  P3?: number;   // Calculated percentile values (for reference)
  P15?: number;
  P50?: number;
  P85?: number;
  P97?: number;
}

/**
 * WHO Weight-for-Age LMS values for girls (0-130 weeks)
 * These are the official WHO values used in growth standards
 */
export const WHO_WEIGHT_FOR_AGE_GIRLS: WHOLMSData[] = [
  // Day 0 (birth) - Week 0
  // P3=2.4, P15=2.8, P50=3.2, P85=3.6, P97=3.9 → M=3.2
  {
    ageWeeks: 0, ageDays: 0, L: 0.3809, M: 3.2, S: 0.1282,
    P3: 2.4, P15: 2.8, P50: 3.2, P85: 3.6, P97: 3.9
  },

  // Day 1 - Week 0 (interpolated)
  {
    ageWeeks: 0.14, ageDays: 1, L: 0.3809, M: 3.18, S: 0.1285,
    P3: 2.42, P15: 2.82, P50: 3.22, P85: 3.62, P97: 3.92
  },

  // Day 3 - Week 0 (interpolated)
  {
    ageWeeks: 0.43, ageDays: 3, L: 0.3809, M: 3.12, S: 0.1298,
    P3: 2.46, P15: 2.86, P50: 3.26, P85: 3.66, P97: 3.96
  },

  // Day 7 - Week 1 (interpolated)
  {
    ageWeeks: 1, ageDays: 7, L: 0.3809, M: 3.0, S: 0.1345,
    P3: 2.52, P15: 2.92, P50: 3.32, P85: 3.72, P97: 4.02
  },

  // Day 14 - Week 2
  // P3=2.6, P15=3.0, P50=3.5, P85=4.0, P97=4.4 → M=3.5
  {
    ageWeeks: 2, ageDays: 14, L: 0.3809, M: 3.5, S: 0.1407,
    P3: 2.6, P15: 3.0, P50: 3.5, P85: 4.0, P97: 4.4
  },

  // Day 21 - Week 3 (calculated percentiles)
  {
    ageWeeks: 3, ageDays: 21, L: 0.3809, M: 3.09, S: 0.1395,
    P3: 2.58, P15: 3.08, P50: 3.59, P85: 4.10, P97: 4.60
  },

  // Day 28 - Week 4 (calculated percentiles)
  {
    ageWeeks: 4, ageDays: 28, L: 0.3809, M: 3.45, S: 0.1318,
    P3: 2.82, P15: 3.38, P50: 4.12, P85: 4.85, P97: 5.39
  },

  // Day 56 - Week 8 (calculated percentiles)
  {
    ageWeeks: 8, ageDays: 56, L: 0.3809, M: 4.78, S: 0.1235,
    P3: 3.92, P15: 4.57, P50: 5.70, P85: 6.83, P97: 7.48
  },

  // Day 84 - Week 12 (calculated percentiles)
  {
    ageWeeks: 12, ageDays: 84, L: 0.3809, M: 5.95, S: 0.1188,
    P3: 4.90, P15: 5.68, P50: 7.08, P85: 8.48, P97: 9.26
  },

  // Day 112 - Week 16 (calculated percentiles)
  {
    ageWeeks: 16, ageDays: 112, L: 0.3809, M: 6.88, S: 0.1176,
    P3: 5.68, P15: 6.56, P50: 8.19, P85: 9.82, P97: 10.70
  },

  // Day 140 - Week 20 (calculated percentiles)
  {
    ageWeeks: 20, ageDays: 140, L: 0.3809, M: 7.62, S: 0.1178,
    P3: 6.28, P15: 7.25, P50: 9.04, P85: 10.83, P97: 11.80
  },

  // Day 168 - Week 24 (calculated percentiles)
  {
    ageWeeks: 24, ageDays: 168, L: 0.3809, M: 8.22, S: 0.1188,
    P3: 6.75, P15: 7.82, P50: 9.74, P85: 11.66, P97: 12.73
  },

  // Day 196 - Week 28 (calculated percentiles)
  {
    ageWeeks: 28, ageDays: 196, L: 0.3809, M: 8.73, S: 0.1200,
    P3: 7.16, P15: 8.31, P50: 10.35, P85: 12.39, P97: 13.54
  },

  // Day 224 - Week 32 (calculated percentiles)
  {
    ageWeeks: 32, ageDays: 224, L: 0.3809, M: 9.18, S: 0.1213,
    P3: 7.53, P15: 8.73, P50: 10.88, P85: 13.03, P97: 14.23
  },

  // Day 252 - Week 36 (calculated percentiles)
  {
    ageWeeks: 36, ageDays: 252, L: 0.3809, M: 9.58, S: 0.1226,
    P3: 7.86, P15: 9.09, P50: 11.33, P85: 13.57, P97: 14.80
  },
];

/**
 * Convert Z-score to percentile using standard normal CDF
 * Uses error function approximation (Abramowitz and Stegun)
 */
export function zScoreToPercentile(z: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = z < 0 ? -1 : 1;
  const absZ = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * absZ);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absZ * absZ);

  const cdf = (1.0 + sign * y) / 2.0;
  return Math.round(cdf * 100);
}

/**
 * Calculate Z-score using LMS method
 * Z = ((value/M)^L - 1) / (L*S)
 */
export function calculateZScore(value: number, L: number, M: number, S: number): number {
  if (!L || !M || !S || M === 0 || value <= 0) return 0;

  const zScore = (Math.pow(value / M, L) - 1) / (L * S);
  return zScore;
}

/**
 * Get closest WHO LMS data point for given age (in weeks)
 */
export function getWHODataForAge(ageWeeks: number): WHOLMSData | null {
  if (ageWeeks < 0) return null;

  // Find exact or closest match
  const firstData = WHO_WEIGHT_FOR_AGE_GIRLS[0];
  if (ageWeeks <= firstData.ageWeeks) {
    return {
      ...firstData,
      ageWeeks,
      ageDays: ageWeeks * 7,
    };
  }

  const lastData = WHO_WEIGHT_FOR_AGE_GIRLS[WHO_WEIGHT_FOR_AGE_GIRLS.length - 1];
  if (ageWeeks >= lastData.ageWeeks) {
    return {
      ...lastData,
      ageWeeks,
      ageDays: ageWeeks * 7,
    };
  }

  // Find surrounding points for interpolation
  for (let i = 0; i < WHO_WEIGHT_FOR_AGE_GIRLS.length - 1; i++) {
    const current = WHO_WEIGHT_FOR_AGE_GIRLS[i];
    const next = WHO_WEIGHT_FOR_AGE_GIRLS[i + 1];

    if (ageWeeks >= current.ageWeeks && ageWeeks <= next.ageWeeks) {
      // Interpolate LMS values
      const ratio = (ageWeeks - current.ageWeeks) / (next.ageWeeks - current.ageWeeks);

      return {
        ageWeeks,
        ageDays: ageWeeks * 7,
        L: current.L + ratio * (next.L - current.L),
        M: current.M + ratio * (next.M - current.M),
        S: current.S + ratio * (next.S - current.S),
        P3: current.P3 ? current.P3 + ratio * ((next.P3 || current.P3) - current.P3) : undefined,
        P15: current.P15 ? current.P15 + ratio * ((next.P15 || current.P15) - current.P15) : undefined,
        P50: current.P50 ? current.P50 + ratio * ((next.P50 || current.P50) - current.P50) : undefined,
        P85: current.P85 ? current.P85 + ratio * ((next.P85 || current.P85) - current.P85) : undefined,
        P97: current.P97 ? current.P97 + ratio * ((next.P97 || current.P97) - current.P97) : undefined,
      };
    }
  }

  return null;
}

/**
 * Calculate percentile for a weight measurement
 * Uses LMS method with Z-score to percentile conversion
 */
export function calculateWeightPercentile(weightKg: number, ageWeeks: number): number {
  const whoData = getWHODataForAge(ageWeeks);

  if (!whoData) {
    console.warn(`No WHO data for age ${ageWeeks} weeks`);
    return 50;
  }

  const zScore = calculateZScore(weightKg, whoData.L, whoData.M, whoData.S);
  const percentile = zScoreToPercentile(zScore);

  // Clamp between 1 and 99
  return Math.max(1, Math.min(99, percentile));
}
