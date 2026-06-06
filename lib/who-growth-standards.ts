/**
 * WHO Child Growth Standards - Hardcoded LMS data
 * For girls, 0-13 weeks
 */

// WHO LMS parameters - meisjes
// Gewicht (kg) - week 0-13
export const WHO_WEIGHT_LMS = [
  { week: 0,  L: 0.3809, M: 3.2322, S: 0.14171 },
  { week: 1,  L: 0.3809, M: 3.3498, S: 0.13998 },
  { week: 2,  L: 0.3809, M: 3.5166, S: 0.13756 },
  { week: 3,  L: 0.3809, M: 3.6908, S: 0.13589 },
  { week: 4,  L: 0.3809, M: 3.8561, S: 0.13421 },
  { week: 5,  L: 0.3809, M: 4.0128, S: 0.13228 },
  { week: 6,  L: 0.3809, M: 4.1614, S: 0.13044 },
  { week: 7,  L: 0.3809, M: 4.3018, S: 0.12877 },
  { week: 8,  L: 0.3809, M: 4.4347, S: 0.12709 },
  { week: 9,  L: 0.3809, M: 4.5604, S: 0.12558 },
  { week: 10, L: 0.3809, M: 4.6794, S: 0.12422 },
  { week: 11, L: 0.3809, M: 4.7924, S: 0.12296 },
  { week: 12, L: 0.3809, M: 4.8999, S: 0.12180 },
  { week: 13, L: 0.3809, M: 5.0025, S: 0.12073 },
];

// Lengte (cm) - week 0-13
export const WHO_LENGTH_LMS = [
  { week: 0,  L: 1, M: 49.1477, S: 0.03790 },
  { week: 1,  L: 1, M: 50.3913, S: 0.03628 },
  { week: 2,  L: 1, M: 51.5920, S: 0.03591 },
  { week: 3,  L: 1, M: 52.5855, S: 0.03574 },
  { week: 4,  L: 1, M: 53.4685, S: 0.03567 },
  { week: 5,  L: 1, M: 54.2441, S: 0.03563 },
  { week: 6,  L: 1, M: 54.9351, S: 0.03563 },
  { week: 7,  L: 1, M: 55.5620, S: 0.03561 },
  { week: 8,  L: 1, M: 56.1376, S: 0.03568 },
  { week: 9,  L: 1, M: 56.6707, S: 0.03574 },
  { week: 10, L: 1, M: 57.1688, S: 0.03581 },
  { week: 11, L: 1, M: 57.6367, S: 0.03590 },
  { week: 12, L: 1, M: 58.0789, S: 0.03600 },
  { week: 13, L: 1, M: 58.4996, S: 0.03610 },
];

// Hoofdomtrek (cm) - week 0-13
export const WHO_HEAD_LMS = [
  { week: 0,  L: 1, M: 33.8787, S: 0.03496 },
  { week: 1,  L: 1, M: 34.6486, S: 0.03344 },
  { week: 2,  L: 1, M: 35.4164, S: 0.03246 },
  { week: 3,  L: 1, M: 36.1002, S: 0.03182 },
  { week: 4,  L: 1, M: 36.6990, S: 0.03127 },
  { week: 5,  L: 1, M: 37.2223, S: 0.03081 },
  { week: 6,  L: 1, M: 37.6820, S: 0.03043 },
  { week: 7,  L: 1, M: 38.0849, S: 0.03011 },
  { week: 8,  L: 1, M: 38.4374, S: 0.02983 },
  { week: 9,  L: 1, M: 38.7454, S: 0.02959 },
  { week: 10, L: 1, M: 39.0135, S: 0.02939 },
  { week: 11, L: 1, M: 39.2461, S: 0.02920 },
  { week: 12, L: 1, M: 39.4470, S: 0.02904 },
  { week: 13, L: 1, M: 39.6193, S: 0.02890 },
];

// Standaard normaalverdeling CDF (Abramowitz & Stegun approximatie)
export function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779
            + t * (-1.8212560 + t * 1.3302744))));
  return z > 0 ? 1 - p : p;
}

export function normalCDFInverse(p: number): number {
  // Rational approximation
  const a = [0, -3.969683028665376e+01, 2.209460984245205e+02,
    -2.759285104469687e+02, 1.383577518672690e+02,
    -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [0, -5.447609879822406e+01, 1.615858368580409e+02,
    -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01,
    -2.400758277161838e+00, -2.549732539343734e+00,
    4.374664141464968e+00, 2.938163982698783e+00];
  const d2 = [7.784695709041462e-03, 3.224671290700398e-01,
    2.445134137142996e+00, 3.754408661907416e+00];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d2[0]*q+d2[1])*q+d2[2])*q+d2[3])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5;
    const r = q * q;
    return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q /
           (((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
            ((((d2[0]*q+d2[1])*q+d2[2])*q+d2[3])*q+1);
  }
}

// LMS Z-score → percentiel functie
export function lmsToPercentile(value: number, L: number, M: number, S: number): number {
  const z = (Math.pow(value / M, L) - 1) / (L * S);
  return normalCDF(z) * 100;
}

// Percentiel waarde → kg/cm functie
export function lmsPercentileValue(L: number, M: number, S: number, pct: number): number {
  const z = normalCDFInverse(pct / 100);
  return M * Math.pow(1 + L * S * z, 1 / L);
}

// Get closest LMS data for a week
export function getLMSForWeek(week: number, type: 'weight' | 'length' | 'head') {
  const data = type === 'weight' ? WHO_WEIGHT_LMS : type === 'length' ? WHO_LENGTH_LMS : WHO_HEAD_LMS;

  const week0 = Math.floor(week);
  const week1 = Math.ceil(week);

  if (week0 === week1 || week0 >= data.length - 1) {
    return data[Math.min(week0, data.length - 1)];
  }

  const d0 = data[week0];
  const d1 = data[week1];
  const ratio = week - week0;

  return {
    week,
    L: d0.L + ratio * (d1.L - d0.L),
    M: d0.M + ratio * (d1.M - d0.M),
    S: d0.S + ratio * (d1.S - d0.S),
  };
}
