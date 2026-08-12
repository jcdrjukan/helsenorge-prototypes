import resourcesJson from './resources.json';

export type Tag =
  | 'sove-bedre'
  | 'angst'
  | 'stress'
  | 'nedstemthet'
  | 'rus-og-avhengighet'
  | 'spilleavhengighet'
  | 'ensomhet-relasjoner'
  | 'generell-mestring';

export type ResourceType = 'verktøy' | 'artikkel';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  shortDescription: string;
  url: string;
  tags: Tag[];
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
  { label: 'bli mindre plaget av bekymringer og angst', tag: 'angst' },
  { label: 'være mindre trist eller nedstemt', tag: 'nedstemthet' },
  { label: 'sove bedre', tag: 'sove-bedre' },
  { label: 'håndtere stress på en bedre måte', tag: 'stress' },
  { label: 'endre forholdet mitt til alkohol, rusmidler eller tobakk', tag: 'rus-og-avhengighet' },
  { label: 'få bedre kontroll på pengespillingen', tag: 'spilleavhengighet' },
  { label: 'føle meg mindre ensom eller styrke relasjonene mine', tag: 'ensomhet-relasjoner' },
  { label: 'forstå meg selv og situasjonen min bedre', tag: 'generell-mestring' },
  { label: 'noe annet / Ingen av disse', tag: null, exclusive: true },
];

const FALLBACK_IDS = [
  'artikkel-rad-for-god-psykisk-helse',
  'artikkel-abc-for-god-psykisk-helse',
  'opp',
];

export interface ScoredResults {
  verktøy: Resource[];
  artikler: Resource[];
  isEmpty: boolean;
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
      isEmpty: true,
    };
  }

  return {
    verktøy: ranked.filter(r => r.type === 'verktøy'),
    artikler: ranked.filter(r => r.type === 'artikkel'),
    isEmpty: false,
  };
}

const LS_KEY = 'veiviser-seen';
const LS_ANSWERS_KEY = 'veiviser-answers';

// Clear seen-status and answers on every hard page refresh (new browser
// session) — but NOT on ordinary in-app navigation (e.g. bouncing to
// Forside and back via a snarvei), which unmounts/remounts this component
// without a real page reload and should keep the same answers/results.
if (!sessionStorage.getItem('veiviser-session')) {
  sessionStorage.setItem('veiviser-session', '1');
  localStorage.removeItem(LS_KEY);
  localStorage.removeItem(LS_ANSWERS_KEY);
}

export function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

export function persistSeen(ids: Set<string>): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
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
