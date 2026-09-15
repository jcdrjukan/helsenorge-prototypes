// Måledata — synthetic seeded demo data, ported from maledata-mobile-wireframe-v3.html
// (concept wireframe referenced in the Obsidian working notes). Deterministic
// seeded PRNG so the same 90-day series renders on every visit; there is no
// real PMD/VKP integration behind this prototype.

export type MaledataSource = 'device' | 'form';

export interface MaledataSeries {
  id: string;
  name: string;
  unit: string;
  /** Fixed y-axis bounds for the panel. */
  lo: number;
  hi: number;
  /** Clinician-set target/reference band, or null if none exists yet
   *  (per the working notes' data-contract gap — the display must work in
   *  both states). */
  band: [number, number] | null;
  decimals: number;
  source: MaledataSource;
  /** Ordinal/form-registered scale (e.g. a 0–4 symptom score) — rendered as
   *  discrete markers, never an interpolated line (§8 of the working notes). */
  ordinal?: boolean;
  /** 90 values, oldest first, most recent last. null = missing that day. */
  values: (number | null)[];
}

const N = 90;

function seededRng(seed: number) {
  let s = seed;
  return function rnd() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generate(
  rnd: () => number,
  base: number,
  amp: number,
  lo: number,
  hi: number,
  drift: ((i: number) => number) | null,
  missingProb: number
): (number | null)[] {
  const out: (number | null)[] = [];
  let v = base;
  for (let i = 0; i < N; i++) {
    v = v + (rnd() - 0.5) * amp + (drift ? drift(i) : 0);
    v = Math.max(lo, Math.min(hi, v));
    out.push(rnd() < missingProb ? null : v);
  }
  return out;
}

// Each series gets its own seed so panels don't visually echo one another.
const rndVekt = seededRng(7);
const rndSbp = seededRng(11);
const rndPuls = seededRng(19);
const rndSpo2 = seededRng(23);
const rndTemp = seededRng(31);
const rndPust = seededRng(37);

export const SERIES: MaledataSeries[] = [
  {
    id: 'vekt',
    name: 'Vekt',
    unit: 'kg',
    lo: 79,
    hi: 87,
    band: [81, 84],
    decimals: 1,
    source: 'device',
    values: generate(rndVekt, 82.3, 0.5, 80, 86.5, i => (i > 75 ? 0.12 : 0), 0.06),
  },
  {
    id: 'sbp',
    name: 'Blodtrykk (over)',
    unit: 'mmHg',
    lo: 105,
    hi: 175,
    band: [120, 140],
    decimals: 0,
    source: 'device',
    values: generate(rndSbp, 150, 7, 110, 170, i => (i > 60 && i < 72 ? -1.4 : 0), 0.06),
  },
  {
    id: 'puls',
    name: 'Puls',
    unit: '/min',
    lo: 45,
    hi: 105,
    band: [55, 90],
    decimals: 0,
    source: 'device',
    values: generate(rndPuls, 72, 6, 50, 100, null, 0.06),
  },
  {
    id: 'spo2',
    name: 'Oksygenmetning',
    unit: '%',
    lo: 86,
    // Padded above the band's own top (100) so the chart reserves the same
    // proportion of headroom above its top gridline as the other series —
    // band[1] sitting exactly at hi left this one with none.
    hi: 105,
    band: [92, 100],
    decimals: 0,
    source: 'device',
    values: generate(rndSpo2, 95, 1.5, 88, 99, null, 0.06),
  },
  {
    id: 'temp',
    name: 'Temperatur',
    unit: '°C',
    lo: 35,
    hi: 39.5,
    band: [36, 37.8],
    decimals: 1,
    source: 'device',
    values: generate(rndTemp, 36.7, 0.25, 36, 38.6, null, 0.15),
  },
  {
    id: 'pust',
    name: 'Tungpust',
    unit: '0–4',
    lo: -0.5,
    // Padded above the top gridline (4) to match the headroom on the other
    // panels — see the spo2 series above for the same reasoning.
    hi: 6,
    band: null,
    decimals: 0,
    source: 'form',
    ordinal: true,
    values: generate(rndPust, 1, 0.9, 0, 4, i => (i > 78 ? 0.15 : 0), 0.12).map(v =>
      v == null ? null : Math.round(v)
    ),
  },
];

const MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];

/** Calendar date for a series index that is `offset` days before today. */
export function dateForOffset(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return d;
}

export function dateLabel(offset: number): string {
  const d = dateForOffset(offset);
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]}`;
}

export function agoLabel(offset: number): string {
  if (offset === 0) return 'i dag';
  if (offset === 1) return 'i går';
  return `${offset} dager siden`;
}

export function formatValue(v: number, decimals: number): string {
  return v.toFixed(decimals).replace('.', ',');
}

export interface LatestReading {
  value: number;
  /** Days before today. */
  offset: number;
  outOfRange: boolean;
  stale: boolean;
}

export function latestReading(s: MaledataSeries): LatestReading | null {
  let i = N - 1;
  while (i >= 0 && s.values[i] == null) i--;
  if (i < 0) return null;
  const value = s.values[i] as number;
  const offset = N - 1 - i;
  const outOfRange = !!s.band && (value < s.band[0] || value > s.band[1]);
  return { value, offset, outOfRange, stale: offset > 2 };
}

/** The most recent `days` values for a series, oldest first. */
export function windowValues(s: MaledataSeries, days: number): (number | null)[] {
  return s.values.slice(N - days);
}

export const TOTAL_DAYS = N;
