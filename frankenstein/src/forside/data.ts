import type { SvgIcon } from '@helsenorge/designsystem-react/components/Icon';

import CriticalHealthInfo from '@helsenorge/designsystem-react/components/Icons/CriticalHealthInfo';
import Contacts from '@helsenorge/designsystem-react/components/Icons/Contacts';
import Vaccine from '@helsenorge/designsystem-react/components/Icons/Vaccine';
import Pregnant from '@helsenorge/designsystem-react/components/Icons/Pregnant';
import Journal from '@helsenorge/designsystem-react/components/Icons/Journal';
import CalendarEvent from '@helsenorge/designsystem-react/components/Icons/CalendarEvent';
import Medicine from '@helsenorge/designsystem-react/components/Icons/Medicine';
import Envelope from '@helsenorge/designsystem-react/components/Icons/Envelope';
import Referral from '@helsenorge/designsystem-react/components/Icons/Referral';
import SharedHealthData from '@helsenorge/designsystem-react/components/Icons/SharedHealthData';
import MaleDoctorAndPerson from '@helsenorge/designsystem-react/components/Icons/MaleDoctorAndPerson';
import Hospital from '@helsenorge/designsystem-react/components/Icons/Hospital';
import Microscope from '@helsenorge/designsystem-react/components/Icons/Microscope';
import Notepad from '@helsenorge/designsystem-react/components/Icons/Notepad';
import Laboratory from '@helsenorge/designsystem-react/components/Icons/Laboratory';
import DonorCard from '@helsenorge/designsystem-react/components/Icons/DonorCard';
import Documents from '@helsenorge/designsystem-react/components/Icons/Documents';
import Toolbox from '@helsenorge/designsystem-react/components/Icons/Toolbox';
import Wallet from '@helsenorge/designsystem-react/components/Icons/Wallet';
import Bus from '@helsenorge/designsystem-react/components/Icons/Bus';
import EuropeanHealthCard from '@helsenorge/designsystem-react/components/Icons/EuropeanHealthCard';
import Refund from '@helsenorge/designsystem-react/components/Icons/Refund';
import Archive from '@helsenorge/designsystem-react/components/Icons/Archive';
import MedicineWarning from '@helsenorge/designsystem-react/components/Icons/MedicineWarning';
import HealthWarning from '@helsenorge/designsystem-react/components/Icons/HealthWarning';
import MentalHealthAdult from '@helsenorge/designsystem-react/components/Icons/MentalHealthAdult';
import ChildIcon from './ChildIcon';

export interface TjenesteRow {
  id: string;
  label: string;
  icon: SvgIcon;
}

export interface TjenesteGroup {
  heading: string;
  rows: TjenesteRow[];
}

// The 4 fixed snarveier always shown regardless of any activation state —
// unrelated to the new "valgbare tjenester" mechanic, matches the Figma
// reference's own example content.
export const FIXED_SNARVEIER: TjenesteRow[] = [
  { id: 'sykdom-kritisk-info', label: 'Sykdom og kritisk info', icon: CriticalHealthInfo },
  { id: 'helsekontakter',      label: 'Helsekontakter',         icon: Contacts },
  { id: 'vaksiner',            label: 'Vaksiner',                icon: Vaccine },
  { id: 'pasientjournal',      label: 'Pasientjournal',          icon: Journal },
];

export const TJENESTER_TILES: TjenesteRow[] = [
  { id: 'timeavtaler', label: 'Timeavtaler', icon: CalendarEvent },
  { id: 'resepter',    label: 'Resepter',    icon: Medicine },
  { id: 'innboks',     label: 'Innboks',     icon: Envelope },
];

// Full "alle tjenester" expander content, matching the Figma reference
// (node 230:3673) group-for-group and row-for-row. Placeholder rows (no
// real destination) — only the Valgbare tjenester section (rendered
// separately, right after Kvalitet og styring) has real behaviour.
export const TJENESTE_GROUPS: TjenesteGroup[] = [
  {
    heading: 'Oppfølging i helsetjenesten',
    rows: [
      { id: 'og-innboks',           label: 'Innboks',                     icon: Envelope },
      { id: 'og-timeavtaler',       label: 'Timeavtaler',                 icon: CalendarEvent },
      { id: 'og-henvisninger',      label: 'Henvisninger',                icon: Referral },
      { id: 'og-pasientjournal',    label: 'Pasientjournal',              icon: Journal },
      { id: 'og-delte-opplysninger',label: 'Helseopplysninger som deles', icon: SharedHealthData },
      { id: 'og-bytte-fastlege',    label: 'Bytte fastlege',              icon: MaleDoctorAndPerson },
      { id: 'og-behandlingssted',   label: 'Velg behandlingssted',        icon: Hospital },
      { id: 'og-forskning',         label: 'Forskning og screening',      icon: Microscope },
      { id: 'og-helsekontakter',    label: 'Helsekontakter',              icon: Contacts },
      { id: 'og-oppgaver',          label: 'Oppgaver',                    icon: Notepad },
    ],
  },
  {
    heading: 'Oversikter',
    rows: [
      { id: 'ov-resepter',    label: 'Resepter',                 icon: Medicine },
      { id: 'ov-vaksiner',    label: 'Vaksiner',                 icon: Vaccine },
      { id: 'ov-prover',      label: 'Prøver og undersøkelser',  icon: Laboratory },
      { id: 'ov-sykdom',      label: 'Sykdom og kritisk info',   icon: CriticalHealthInfo },
      { id: 'ov-donorkort',   label: 'Donorkort',                icon: DonorCard },
      { id: 'ov-dokumenter',  label: 'Dokumenter',               icon: Documents },
      { id: 'ov-verktoy',     label: 'Verktøy',                  icon: Toolbox },
    ],
  },
  {
    heading: 'Søknad og refusjon',
    rows: [
      { id: 'sr-frikort',    label: 'Frikort og egenandeler',            icon: Wallet },
      { id: 'sr-reiser',     label: 'Pasientreiser',                     icon: Bus },
      { id: 'sr-trygdekort', label: 'Søk om Europeisk helsetrygdkort',   icon: EuropeanHealthCard },
      { id: 'sr-helfo',      label: 'Søk Helfo om refusjon',             icon: Refund },
    ],
  },
  {
    heading: 'Kvalitet og styring',
    rows: [
      { id: 'ks-helseregistre', label: 'Helseregistre',         icon: Archive },
      { id: 'ks-bivirkninger',  label: 'Meld bivirkninger',      icon: MedicineWarning },
      { id: 'ks-hendelse',      label: 'Melde alvorlig hendelse', icon: HealthWarning },
    ],
  },
];

// ── Valgbare tjenester ───────────────────────────────────────────────
// The 3 candidate services shown here (always, all 3, regardless of
// activation) and mirrored under the always-visible "Valgbare fliser"
// tile grid. Activating one adds it to Snarveier; ending it removes it.
export type ValgbarTjenesteId = 'psykisk-helse' | 'gravid' | 'smabarnsliv';

export interface ValgbarTjeneste {
  id: ValgbarTjenesteId;
  label: string;
  description: string;
  icon: SvgIcon;
  /** Whether this tjeneste has a real prototype to navigate to. */
  hasPrototype: boolean;
  /** Placeholder-only "Støtte til din situasjon" card badge (e.g. "Nytt innhold") — real content model TBD. */
  badge?: string;
  /** Placeholder-only "Støtte til din situasjon" teaser bullets — real content model TBD. */
  teaser?: string[];
}

export const VALGBARE_TJENESTER: ValgbarTjeneste[] = [
  {
    id: 'psykisk-helse',
    label: 'Psykisk helse',
    description: 'Verktøy og artikler tilpasset det du ønsker hjelp med.',
    icon: MentalHealthAdult,
    hasPrototype: true,
  },
  {
    id: 'gravid',
    label: 'Gravid',
    description: 'Følg svangerskapet uke for uke.',
    icon: Pregnant,
    hasPrototype: true,
    badge: 'Nytt innhold',
    teaser: ['Gravid uke 32', 'Vise målinger og informasjon'],
  },
  {
    id: 'smabarnsliv',
    label: 'Småbarnsliv',
    description: 'Råd og oversikt de første leveårene.',
    icon: ChildIcon,
    hasPrototype: false,
  },
];

// ── Activation state persistence ────────────────────────────────────
// Shared across App.tsx (Snarveier/deep-link decisions) and Forside
// itself. Gravid ships activated by default, matching the Figma
// reference's own example ("a couple active snarveier").
const ACTIVATED_LS_KEY = 'forside-activated-tjenester';

export function loadActivatedTjenester(): Set<ValgbarTjenesteId> {
  try {
    const raw = localStorage.getItem(ACTIVATED_LS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore
  }
  return new Set(['gravid']);
}

export function saveActivatedTjenester(ids: Set<ValgbarTjenesteId>): void {
  try {
    localStorage.setItem(ACTIVATED_LS_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}
