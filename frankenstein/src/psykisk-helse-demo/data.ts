import resourcesJson from './resources.json';

export type Tag =
  | 'sove-bedre'
  | 'angst'
  | 'stress'
  | 'nedstemthet'
  | 'rus-og-avhengighet'
  | 'spilleavhengighet'
  | 'ensomhet-relasjoner'
  | 'generell-mestring'
  | 'fysisk-aktivitet'
  | 'graviditet-barsel'
  | 'konsentrasjon';

export type ResourceType = 'verktøy' | 'artikkel' | 'veiledningstjeneste';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  shortDescription: string;
  url: string;
  tags: Tag[];
  /** Overrides the default "Gå til <type>" button label when set. */
  ctaLabel?: string;
  /** True for a verktøy that's a downloadable app (vs. a web tool or a
   *  self-help video/program) — changes the CTA to "Last ned app" with an
   *  external-link arrow. */
  isApp?: boolean;
  /** For an isApp resource: the Apple App Store page for the app itself.
   *  "Last ned app" opens this, while `url` (the Helsenorge page about the
   *  app) stays behind "Vis mer om verktøyet" in the expanded card. */
  appStoreUrl?: string;
  /** "Noen å snakke med" services only (Figma 402:7929–402:8145). */
  service?: ServiceDetails;
}

/** One day's opening hours: open all day, closed, or a list of
 *  [from, to] "HH:MM" intervals. */
export type OpeningHours = 'døgnåpen' | 'stengt' | [string, string][];

export interface ServiceDetails {
  image: string;
  longDescription: string;
  bemanning: string;
  phone: string;
  chatUrl: string;
  website: string;
  /** Mandag → Søndag, in order. */
  hours: [string, OpeningHours][];
}

export const RESOURCES: Resource[] = resourcesJson as Resource[];

export interface QuizOption {
  label: string;
  tag: Tag | null;
  exclusive?: boolean;
}

export const Q1_OPTIONS: QuizOption[] = [
  { label: 'Sover dårlig', tag: 'sove-bedre' },
  { label: 'Sliter med angst eller fobier', tag: 'angst' },
  { label: 'Er nedstemt eller trist', tag: 'nedstemthet' },
  { label: 'Er stressa', tag: 'stress' },
];

export const Q2_OPTIONS: QuizOption[] = [
  { label: 'Bli mindre plaget av bekymringer og angst', tag: 'angst' },
  { label: 'Være mindre trist eller nedstemt', tag: 'nedstemthet' },
  { label: 'Sove bedre', tag: 'sove-bedre' },
  { label: 'Håndtere stress på en bedre måte', tag: 'stress' },
  { label: 'Endre forholdet mitt til alkohol, rusmidler eller tobakk', tag: 'rus-og-avhengighet' },
  { label: 'Få bedre kontroll på pengespillingen', tag: 'spilleavhengighet' },
  { label: 'Føle meg mindre ensom eller styrke relasjonene mine', tag: 'ensomhet-relasjoner' },
  { label: 'Styrke den psykiske helsa mi', tag: 'generell-mestring' },
];

const FALLBACK_IDS = [
  'artikkel-rad-for-god-psykisk-helse',
  'artikkel-abc-for-god-psykisk-helse',
  'opp',
];

// Both veiledningstjenester (Kirkens SOS, Mental Helse) are general crisis-
// support contacts, not tied to any one quiz category — they should show
// up in every result set regardless of tag matches or which answers were
// picked, unlike every other resource.
// Listed in the order the "Noen å snakke med" design shows them.
const ALWAYS_SHOW_VEILEDNING_IDS = ['veiledning-mental-helse', 'veiledning-kirkens-sos'];
const ALWAYS_SHOW_VEILEDNING = ALWAYS_SHOW_VEILEDNING_IDS
  .map(id => RESOURCES.find(r => r.id === id))
  .filter((r): r is Resource => !!r);

export interface ScoredResults {
  verktøy: Resource[];
  artikler: Resource[];
  veiledningstjenester: Resource[];
  isEmpty: boolean;
}

// Both services always show, in the design's fixed order (a tag match no
// longer moves one ahead of the other).
function withAlwaysShowVeiledning(matched: Resource[]): Resource[] {
  const alwaysIds = new Set(ALWAYS_SHOW_VEILEDNING_IDS);
  return [...ALWAYS_SHOW_VEILEDNING, ...matched.filter(r => !alwaysIds.has(r.id))];
}

const DAY_NAMES = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

/** Live open/closed status from a service's opening hours, worded like the
 *  design: "Åpen - Døgnåpen", "Åpen - Stenger 15:30", "Stengt - Åpner 12:00"
 *  (or "Åpner i morgen 10:00" / "Åpner mandag 11:30" for a later day). */
export function serviceStatus(hours: [string, OpeningHours][], now = new Date()): { open: boolean; detail: string } {
  // hours[] is Mandag-first; JS getDay() is Sunday-first.
  const dayIdx = (jsDay: number) => (jsDay + 6) % 7;
  const today = hours[dayIdx(now.getDay())][1];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  if (today === 'døgnåpen') return { open: true, detail: 'Døgnåpen' };
  if (today !== 'stengt') {
    const current = today.find(([from, to]) => nowMin >= toMin(from) && nowMin < toMin(to));
    if (current) return { open: true, detail: `Stenger ${current[1]}` };
    const later = today.find(([from]) => toMin(from) > nowMin);
    if (later) return { open: false, detail: `Åpner ${later[0]}` };
  }
  for (let ahead = 1; ahead <= 7; ahead++) {
    const jsDay = (now.getDay() + ahead) % 7;
    const day = hours[dayIdx(jsDay)][1];
    if (day === 'stengt') continue;
    const when = ahead === 1 ? 'i morgen' : DAY_NAMES[jsDay];
    // A døgnåpen day opens at midnight — "Åpner mandag" reads better than "Åpner mandag 00:00".
    return { open: false, detail: day === 'døgnåpen' ? `Åpner ${when}` : `Åpner ${when} ${day[0][0]}` };
  }
  return { open: false, detail: '' };
}

export function computeResults(
  q1Selected: Set<string>,
  q2Selected: Set<string>
): ScoredResults {
  const q1Tags = new Set<Tag>(
    Q1_OPTIONS.filter(o => o.tag && q1Selected.has(o.label)).map(o => o.tag!)
  );
  const q2Tags = new Set<Tag>(
    Q2_OPTIONS.filter(o => o.tag && q2Selected.has(o.label)).map(o => o.tag!)
  );

  const scored = RESOURCES.map(r => {
    let score = 0;
    r.tags.forEach(tag => {
      if (q2Tags.has(tag)) score += 2;
      if (q1Tags.has(tag)) score += 1;
    });
    return { resource: r, score };
  }).filter(({ score }) => score > 0);

  scored.sort((a, b) => b.score - a.score);
  const ranked = scored.map(({ resource }) => resource);

  if (ranked.length === 0) {
    const fallback = RESOURCES.filter(r => FALLBACK_IDS.includes(r.id));
    return {
      verktøy: fallback.filter(r => r.type === 'verktøy'),
      artikler: fallback.filter(r => r.type === 'artikkel'),
      veiledningstjenester: withAlwaysShowVeiledning(fallback.filter(r => r.type === 'veiledningstjeneste')),
      isEmpty: true,
    };
  }

  return {
    verktøy: ranked.filter(r => r.type === 'verktøy'),
    artikler: ranked.filter(r => r.type === 'artikkel'),
    veiledningstjenester: withAlwaysShowVeiledning(ranked.filter(r => r.type === 'veiledningstjeneste')),
    isEmpty: false,
  };
}

const LS_ANSWERS_KEY = 'veiviser-answers';

// Clear answers on every hard page refresh (new browser session) — but NOT
// on ordinary in-app navigation (e.g. bouncing to Forside and back via a
// snarvei), which unmounts/remounts this component without a real page
// reload and should keep the same answers/results.
if (!sessionStorage.getItem('veiviser-session')) {
  sessionStorage.setItem('veiviser-session', '1');
  localStorage.removeItem(LS_ANSWERS_KEY);
}

// The actual quiz answers (q1/q2) — without this, navigating away (e.g. to
// Forside) and back via a snarvei loses the selections entirely, even
// though hasCompletedVeiviser() still correctly deep-links to results:
// results would then compute from empty answers instead of what the user
// actually picked.
export function getAnswers(): { q1: Set<string>; q2: Set<string> } {
  try {
    const raw = localStorage.getItem(LS_ANSWERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { q1: new Set(parsed.q1 || []), q2: new Set(parsed.q2 || []) };
    }
  } catch {
    // ignore
  }
  return { q1: new Set(), q2: new Set() };
}

export function persistAnswers(q1: Set<string>, q2: Set<string>): void {
  try {
    localStorage.setItem(LS_ANSWERS_KEY, JSON.stringify({ q1: [...q1], q2: [...q2] }));
  } catch {
    // ignore
  }
}

export function clearAnswers(): void {
  try {
    localStorage.removeItem(LS_ANSWERS_KEY);
  } catch {
    // ignore
  }
}

// Tracks whether the user has reached the results view at least once since
// starting (or last restarting/ending) the veiviser — Forside reads this to
// decide whether a snarvei/flis for Psykisk helse should deep-link straight
// to results instead of the front page.
const LS_COMPLETED_KEY = 'ph-veiviser-completed';

export function markVeiviserCompleted(): void {
  try {
    localStorage.setItem(LS_COMPLETED_KEY, '1');
  } catch {
    // ignore
  }
}

export function clearVeiviserCompleted(): void {
  try {
    localStorage.removeItem(LS_COMPLETED_KEY);
  } catch {
    // ignore
  }
}

export function hasCompletedVeiviser(): boolean {
  try {
    return localStorage.getItem(LS_COMPLETED_KEY) === '1';
  } catch {
    return false;
  }
}
