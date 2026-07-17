export interface Medication {
  id: string;
  name: string;
  virkestoff: string;
}

export interface Prescription {
  medicationId: string;
  status: 'aktiv' | 'utekspedert';
  sistHentet: string;
  frequency: 'fast' | 'behov';
  harRefusjon: boolean;
  atcKode: string;
  pakningsstorrelse: string;
  antall: string;
  rekvirertAv: string;
  rekvirertDato: string;
  gyldigTil: string;
  reiterasjoner: number;
  antallUtleveringer: number;
  refusjonshjemmel: string;
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
  {
    medicationId: 'lamotrigin',
    status: 'aktiv',
    sistHentet: '02.06.2026',
    frequency: 'fast',
    harRefusjon: true,
    atcKode: 'N03AX09',
    pakningsstorrelse: '56 stk',
    antall: '1',
    rekvirertAv: 'KARI NORDMANN, Sentrum Legesenter',
    rekvirertDato: '02.06.2026',
    gyldigTil: '02.06.2027',
    reiterasjoner: 3,
    antallUtleveringer: 2,
    refusjonshjemmel: 'Blå resept (§5-14 §2)',
  },
  {
    medicationId: 'rivaroksaban',
    status: 'aktiv',
    sistHentet: '15.05.2026',
    frequency: 'fast',
    harRefusjon: true,
    atcKode: 'B01AF01',
    pakningsstorrelse: '98 stk',
    antall: '1',
    rekvirertAv: 'KARI NORDMANN, Sentrum Legesenter',
    rekvirertDato: '15.05.2026',
    gyldigTil: '15.05.2027',
    reiterasjoner: 3,
    antallUtleveringer: 1,
    refusjonshjemmel: 'Blå resept (§5-14 §2)',
  },
  {
    medicationId: 'metoprolol',
    status: 'aktiv',
    sistHentet: '20.04.2026',
    frequency: 'fast',
    harRefusjon: true,
    atcKode: 'C07AB02',
    pakningsstorrelse: '98 stk',
    antall: '1',
    rekvirertAv: 'KARI NORDMANN, Sentrum Legesenter',
    rekvirertDato: '20.04.2026',
    gyldigTil: '20.04.2027',
    // 0 reiterasjoner left — this is what "can't be renewed without a new
    // legetime" looks like using a real field instead of a bespoke note.
    reiterasjoner: 0,
    antallUtleveringer: 3,
    refusjonshjemmel: 'Blå resept (§5-14 §2)',
  },
  {
    medicationId: 'kandesartan',
    status: 'aktiv',
    sistHentet: '20.04.2026',
    frequency: 'fast',
    harRefusjon: true,
    atcKode: 'C09CA06',
    pakningsstorrelse: '98 stk',
    antall: '1',
    rekvirertAv: 'KARI NORDMANN, Sentrum Legesenter',
    rekvirertDato: '20.04.2026',
    gyldigTil: '20.04.2027',
    reiterasjoner: 3,
    antallUtleveringer: 3,
    refusjonshjemmel: 'Blå resept (§5-14 §2)',
  },
  {
    medicationId: 'paracetamol',
    status: 'utekspedert',
    sistHentet: '10.01.2026',
    frequency: 'behov',
    harRefusjon: false,
    atcKode: 'N02BE01',
    pakningsstorrelse: '100 stk',
    antall: '1',
    rekvirertAv: 'KARI NORDMANN, Sentrum Legesenter',
    rekvirertDato: '10.01.2026',
    gyldigTil: '10.01.2027',
    reiterasjoner: 1,
    antallUtleveringer: 1,
    refusjonshjemmel: 'Ingen refusjon',
  },
  // Discrepancy case: still an active, refillable resept, but the doctor-approved
  // PLL below has moved it to "Avsluttet legemidler" — the exact tension the
  // vault note (Helsenorge/Legemidler.md) flags between the two services.
  {
    medicationId: 'valporinsyre',
    status: 'aktiv',
    sistHentet: '12.03.2026',
    frequency: 'fast',
    harRefusjon: true,
    atcKode: 'N03AG01',
    pakningsstorrelse: '100 stk',
    antall: '1',
    rekvirertAv: 'KARI NORDMANN, Sentrum Legesenter',
    rekvirertDato: '12.03.2026',
    gyldigTil: '12.03.2027',
    reiterasjoner: 2,
    antallUtleveringer: 4,
    refusjonshjemmel: 'Blå resept (§5-14 §2)',
  },
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

// Resepter and PLL are harmonized by construction: Resepter cards read their
// indikasjon/dosering/dispensed-brand text from the same PLL entries rather
// than duplicating separate copy.
export function pllInfoFor(medicationId: string): { sistUtlevert: string; indikasjon: string; dosering: string } {
  const entry = [...PLL_FAST, ...PLL_BEHOV, ...PLL_AVSLUTTET].find(e => e.medicationId === medicationId);
  if (!entry) throw new Error(`No PLL entry found for medication "${medicationId}"`);
  return { sistUtlevert: entry.sistUtlevert, indikasjon: entry.indikasjon, dosering: entry.dosering };
}
