export interface Medication {
  id: string;
  name: string;
  virkestoff: string;
}

export interface Prescription {
  medicationId: string;
  status: 'aktiv' | 'utekspedert';
  sistHentet: string;
  kanFornyes: boolean;
  fornyesNote?: string;
}

export interface PllEntry {
  medicationId: string;
  sistUtlevert: string;
  indikasjon: string;
  dosering: string;
  multidose?: boolean;
}

export interface PllAvsluttetEntry {
  medicationId: string;
  sistUtlevert: string;
  indikasjon: string;
  dosering: string;
  sluttdato: string;
}

export interface Legemiddelreaksjon {
  navn: string;
  reaksjon: string;
  datoOppdatert: string;
  kilde: string;
}

// Content below is transcribed from the reference PLL design
// (Figma file UAhljteF5I4yI9lwrpxta7, node 3393:7599), cross-referenced with
// Resepter so the same patient's medications appear consistently in both views.
export const MEDICATIONS: Medication[] = [
  { id: 'lamotrigin', name: 'Lamotrigin tyggetab/disperg tab 50 mg', virkestoff: 'Lamotrigin' },
  { id: 'rivaroksaban', name: 'Rivaroksaban tab 20 mg', virkestoff: 'Rivaroksaban' },
  { id: 'metoprolol', name: 'Metoprolol depottab 25 mg', virkestoff: 'Metoprololsukinat' },
  { id: 'kandesartan', name: 'Kandesartan tab 4 mg', virkestoff: 'Kandesartan' },
  { id: 'paracetamol', name: 'Paracetamol tab 1 g', virkestoff: 'Paracetamol' },
  { id: 'valporinsyre', name: 'Valporinsyre depotkapsel 150 mg', virkestoff: 'Valporinsyre' },
];

export const PRESCRIPTIONS: Prescription[] = [
  { medicationId: 'lamotrigin', status: 'aktiv', sistHentet: '02.06.2026', kanFornyes: true },
  { medicationId: 'rivaroksaban', status: 'aktiv', sistHentet: '15.05.2026', kanFornyes: true },
  {
    medicationId: 'metoprolol',
    status: 'aktiv',
    sistHentet: '20.04.2026',
    kanFornyes: false,
    fornyesNote: 'Trenger ny time hos fastlege før fornyelse.',
  },
  { medicationId: 'kandesartan', status: 'aktiv', sistHentet: '20.04.2026', kanFornyes: true },
  { medicationId: 'paracetamol', status: 'utekspedert', sistHentet: '10.01.2026', kanFornyes: true },
  // Discrepancy case: still an active, refillable resept, but the doctor-approved
  // PLL below has moved it to "Avsluttet legemidler" — the exact tension the
  // vault note (Helsenorge/Legemidler.md) flags between the two services.
  { medicationId: 'valporinsyre', status: 'aktiv', sistHentet: '12.03.2026', kanFornyes: true },
];

export const PLL_FAST: PllEntry[] = [
  {
    medicationId: 'lamotrigin',
    sistUtlevert: 'Lamictal tyggetab/disperg 50 mg',
    indikasjon: 'MOT EPILEPSI',
    dosering: '1 tablett morgen 1 tablett kveld',
  },
  {
    medicationId: 'rivaroksaban',
    sistUtlevert: 'Rivaroksaban tab 20 mg',
    indikasjon: 'BLODFORTYNNENDE',
    dosering: '1 tablett morgen',
    multidose: true,
  },
  {
    medicationId: 'metoprolol',
    sistUtlevert: 'Metoprolol depottab 25 mg',
    indikasjon: 'HJERTEMEDISIN',
    dosering: '1 tablett morgen',
    multidose: true,
  },
  {
    medicationId: 'kandesartan',
    sistUtlevert: 'Candesartan Sandoz tab 4 mg',
    indikasjon: 'HJERTEMEDISIN',
    dosering: '1 tablett morgen',
    multidose: true,
  },
];

export const PLL_BEHOV: PllEntry[] = [
  {
    medicationId: 'paracetamol',
    sistUtlevert: 'Paracet tab 1 g',
    indikasjon: 'MOT SMERTER',
    dosering: '1 tablett morgen',
  },
];

export const PLL_AVSLUTTET: PllAvsluttetEntry[] = [
  {
    medicationId: 'valporinsyre',
    sistUtlevert: 'Orfiril long depotkaps, hard 150 mg',
    indikasjon: 'MOT EPILEPSI',
    dosering: '1 kapsel morgen 1 kapsel kveld',
    sluttdato: '10.09.2024',
  },
];

export const LEGEMIDDELREAKSJONER: Legemiddelreaksjon[] = [
  {
    navn: 'Fenoksymetylpenicillin',
    reaksjon: 'Anafylaktisk reaksjon',
    datoOppdatert: '21.08.2024',
    kilde: 'Hentet fra tidligere journal',
  },
];

export const PLL_SIST_OPPDATERT = 'Sist oppdatert 13. juli 2023 av Ståle Psa Westby';
