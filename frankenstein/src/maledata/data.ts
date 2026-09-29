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
  /** The scale's own real endpoints (e.g. 0 and 4), used for the chart's
   *  gridlines when ordinal is true — distinct from lo/hi, which pad the
   *  plot area for visual headroom and aren't meant to be shown as ticks.
   *  Defaults to 0–4 (Tungpust's scale) when omitted. */
  scaleMin?: number;
  scaleMax?: number;
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
const rndPuls = seededRng(19);
const rndSpo2 = seededRng(23);
const rndTemp = seededRng(31);
const rndPust = seededRng(37);
const rndCfs = seededRng(41);

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
    name: 'Blodtrykk',
    unit: 'mmHg',
    lo: 105,
    hi: 175,
    band: [120, 140],
    decimals: 0,
    source: 'device',
    // Filled in from BP_DAYS below (latest systolic reading of each day).
    values: [],
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
    scaleMin: 0,
    scaleMax: 4,
    values: generate(rndPust, 1, 0.9, 0, 4, i => (i > 78 ? 0.15 : 0), 0.12).map(v =>
      v == null ? null : Math.round(v)
    ),
  },
  {
    id: 'cfs',
    name: 'CFS',
    unit: '1–9',
    // Same top-headroom treatment as pust above; bottom padded just enough
    // to keep score 1 off the very bottom edge.
    lo: 0.5,
    hi: 12,
    band: null,
    decimals: 0,
    source: 'form',
    ordinal: true,
    scaleMin: 1,
    scaleMax: 9,
    // Clinical Frailty Score is assessed by a clinician, not logged daily
    // like the other form-registered series — high missingProb reflects
    // that it's only recorded on the (infrequent) occasions an assessment
    // actually happens.
    values: generate(rndCfs, 4, 0.6, 1, 9, i => (i > 78 ? 0.3 : 0), 0.85).map(v =>
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

// ─── Blood pressure: morning + evening readings (floating-bar chart) ────
// Each day has up to two readings; a null reading is a missing bar (its
// slot stays empty, the other bar doesn't shift). The most recent 7 days
// are the fixed sample week from the chart spec (oldest first); the
// earlier 83 days are seeded in the same pattern (morning ~140/88,
// evening ~128/80) so the longer timeframes have something to show.

export type BpReading = { sys: number; dia: number } | null;
export interface BpDay {
  morning: BpReading;
  evening: BpReading;
}

const BP_SAMPLE_MORNING: [number, number][] = [[141, 88], [145, 90], [138, 86], [143, 89], [139, 87], [136, 85], [140, 88]];
const BP_SAMPLE_EVENING: [number, number][] = [[129, 80], [132, 82], [127, 79], [130, 81], [126, 78], [128, 80], [125, 79]];

const rndBp = seededRng(53);
function bpReading(sysBase: number, diaBase: number): BpReading {
  if (rndBp() < 0.05) return null;
  const sys = Math.round(sysBase + (rndBp() - 0.5) * 16);
  const dia = Math.round(diaBase + (rndBp() - 0.5) * 10);
  return { sys, dia };
}

/** 90 days, oldest first, most recent last — same indexing as SERIES values. */
export const BP_DAYS: BpDay[] = Array.from({ length: N }, (_, i) => {
  const s = i - (N - 7);
  if (s >= 0) {
    const [ms, md] = BP_SAMPLE_MORNING[s];
    const [es, ed] = BP_SAMPLE_EVENING[s];
    return { morning: { sys: ms, dia: md }, evening: { sys: es, dia: ed } };
  }
  return { morning: bpReading(141, 88), evening: bpReading(128, 80) };
});

/** The most recent `days` BP days, oldest first. */
export function bpWindow(days: number): BpDay[] {
  return BP_DAYS.slice(N - days);
}

export function formatBp(r: NonNullable<BpReading>): string {
  return `${r.sys}/${r.dia}`;
}

const WEEKDAYS_SHORT = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'];
const WEEKDAYS_LONG = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

export function weekdayShort(offset: number): string {
  return WEEKDAYS_SHORT[dateForOffset(offset).getDay()];
}

/** e.g. "Tirsdag 29. sep" */
export function weekdayDateLabel(offset: number): string {
  const w = WEEKDAYS_LONG[dateForOffset(offset).getDay()];
  return `${w[0].toUpperCase()}${w.slice(1)} ${dateLabel(offset)}`;
}

// Blodtrykk's daily value = that day's latest systolic reading
// (evening if present, else morning), so the card/CSV agree with the chart.
{
  const sbp = SERIES.find(x => x.id === 'sbp');
  if (sbp) sbp.values = BP_DAYS.map(d => (d.evening ?? d.morning)?.sys ?? null);
}

// ─── Trend for the latest-registration cards ────────────────────────
// Neutral, descriptive change over a fixed window — never a verdict
// (working notes §8: no good/bad colours or words; whether "up" is good
// depends on the series and the patient). Compares averages, not two
// single readings, so day-to-day noise doesn't flip it: the mean of the
// readings in the most recent 3 days vs. the mean of the readings 3 days
// around the start of the window. Below a per-series threshold it's
// reported as "about unchanged". Ordinal/form series get no trend text.

export const TREND_DAYS = 14;

/** Smallest change worth reporting, per series (same unit as the series). */
const TREND_STABLE: Record<string, number> = {
  vekt: 0.5,
  sbp: 5,
  puls: 5,
  spo2: 1,
  temp: 0.3,
};

export interface Trend {
  /** Recent mean minus earlier mean. */
  delta: number;
  /** |delta| is below the series' threshold. */
  stable: boolean;
}

function meanOf(vals: (number | null)[]): number | null {
  const present = vals.filter((v): v is number => v != null);
  return present.length ? present.reduce((a, b) => a + b, 0) / present.length : null;
}

export function trendFor(s: MaledataSeries, days = TREND_DAYS): Trend | null {
  if (s.ordinal) return null;
  const w = windowValues(s, days);
  const earlier = meanOf(w.slice(0, 3));
  const recent = meanOf(w.slice(-3));
  if (earlier == null || recent == null) return null;
  const delta = recent - earlier;
  const threshold = TREND_STABLE[s.id] ?? 0;
  return { delta, stable: Math.abs(delta) < threshold };
}

/** e.g. "+0,8 kg siste 14 dager", "−5 mmHg siste 14 dager",
 *  "Omtrent uendret siste 14 dager". Uses a real minus sign (U+2212). */
export function trendLabel(s: MaledataSeries, t: Trend, days = TREND_DAYS): string {
  const period = `siste ${days} dager`;
  if (t.stable) return `Omtrent uendret ${period}`;
  const sign = t.delta > 0 ? '+' : '−';
  return `${sign}${formatValue(Math.abs(t.delta), s.decimals)} ${s.unit} ${period}`;
}
