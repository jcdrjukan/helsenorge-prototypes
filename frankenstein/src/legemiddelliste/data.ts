export interface Medication {
  id: string;
  name: string;
  form: string;
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
  dosering: string;
  fortsattIBruk: boolean;
  seponertNote?: string;
}

export const MEDICATIONS: Medication[] = [
  { id: 'paracetamol', name: 'Paracetamol', form: '500 mg tablett' },
  { id: 'simvastatin', name: 'Simvastatin', form: '20 mg tablett' },
  { id: 'metformin', name: 'Metformin', form: '500 mg tablett' },
  { id: 'ibux', name: 'Ibux', form: '400 mg tablett' },
];

export const PRESCRIPTIONS: Prescription[] = [
  { medicationId: 'paracetamol', status: 'aktiv', sistHentet: '10.06.2026', kanFornyes: true },
  {
    medicationId: 'simvastatin',
    status: 'aktiv',
    sistHentet: '02.05.2026',
    kanFornyes: false,
    fornyesNote: 'Trenger ny time hos fastlege før fornyelse.',
  },
  { medicationId: 'metformin', status: 'utekspedert', sistHentet: '15.01.2026', kanFornyes: true },
  { medicationId: 'ibux', status: 'aktiv', sistHentet: '20.03.2026', kanFornyes: true },
];

export const PLL_ENTRIES: PllEntry[] = [
  { medicationId: 'paracetamol', dosering: '1–2 tabletter ved behov, maks 4 ganger daglig', fortsattIBruk: true },
  { medicationId: 'simvastatin', dosering: '1 tablett hver kveld', fortsattIBruk: true },
  { medicationId: 'metformin', dosering: '1 tablett morgen og kveld, tas sammen med mat', fortsattIBruk: true },
  {
    medicationId: 'ibux',
    dosering: '1 tablett ved behov',
    fortsattIBruk: false,
    seponertNote: 'Seponert av fastlege 15.04.2026 — kan gi magebesvær i kombinasjon med blodfortynnende.',
  },
];
