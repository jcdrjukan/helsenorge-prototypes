export interface Consumable {
  name: string;
  quota?: string;
  lastOrder?: string;
  nextOrderDate?: string;
  activeOrder?: boolean;
}

export interface Unit {
  serial: string;
  label?: string;
  deliveryDate: string;
  owner: string;
  url?: string;
}

export interface EquipmentDetails {
  type: string;
  produsent: string;
  serial?: string;
  deliveryDate?: string;
  owner?: string;
  url?: string;
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  modelNo?: string;
  units?: Unit[];
  details: EquipmentDetails;
  consumables: Consumable[];
  deaktivert?: boolean;
  deaktivertMessage?: string;
}

export type DeliveryMode = 'post' | 'hentes' | 'hentes2';
export type AppView = 'forside' | 'machine' | 'order' | 'history';

export interface DeliveryForm {
  mode: DeliveryMode;
  navn: string;
  gate: string;
  postnr: string;
  sted: string;
  telefon: string;
}

export interface SubmittedOrder {
  id: string;
  date: string;
  equipmentItems: { eq: Equipment; quantities: number[] }[];
  delivery: DeliveryMode;
  addr: string;
  poststed?: string;
  navn: string;
  telefon: string;
  comment: string;
  levert?: string;
  saksbehandlerKommentar?: string;
  status?: string;
}

// The date the demo's one seeded "aktiv bestilling" (AirSense 11 AutoSet)
// was placed — always today, so the order card and the consumable rows on
// the machine detail page never show a stale date.
export const TODAY = new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const EQUIPMENT: Equipment[] = [
  {
    id: 'cpap',
    name: 'CPAP',
    model: 'AirSense 11 AutoSet',
    modelNo: '39000',
    units: [
      { serial: '23244159084', label: 'Hjemme', deliveryDate: '12.03.2023', owner: 'St. Olavs sykehus', url: '#' },
      { serial: '23244159999', label: 'Hytta', deliveryDate: '15.06.2023', owner: 'St. Olavs sykehus', url: '#' },
    ],
    details: { type: 'Positivt luftveistrykkapparat, kontinuerlig, auto', produsent: 'ResMed', url: '...' },
    consumables: [
      { name: 'Slange CPAP m/varmetråd ClimateLine 11 CPAP Airsense 11', quota: '', nextOrderDate: '2026-04-15', lastOrder: '15.01.2026' },
      { name: 'Filter inntak pasient Resmed Air 11 standard [Frp 2 stk/pk]', quota: '', lastOrder: TODAY, activeOrder: true },
      { name: 'Maske NIV helmaske AirFit F30i str. S', quota: '', lastOrder: TODAY, activeOrder: true },
      { name: 'Vannkammer fuktekammer CPAP HumidAir 11', quota: '', lastOrder: '20.11.2025' },
    ],
  },
  {
    id: 'oksygen-baerbar',
    name: 'Bærbar oksygenkonsentrator',
    model: 'Inogen Rove 6',
    modelNo: 'IS-501-NA8',
    details: { type: 'Oksygenterapi, oksygenkonsentrator, transportabel', produsent: 'Inogen', serial: '24401092-EU', deliveryDate: '08.11.2022', owner: 'St. Olavs sykehus', url: '...' },
    consumables: [
      { name: 'Kateter oksygen nesekateter dobbelt 3 lpm 2,1 m Micro Flow voksen', quota: '', nextOrderDate: '2026-05-05', lastOrder: '05.02.2026' },
      { name: 'Kateter oksygen nesekateter dobbelt 6 lpm 1,2 m Low flow voksen', quota: '' },
    ],
  },
  {
    id: 'oksygen-stasjonaer',
    name: 'Stasjonær oksygenkonsentrator',
    model: 'EverFlo Q',
    modelNo: '1020000',
    details: { type: 'Oksygenterapi, oksygenkonsentrator, stasjonær', produsent: 'Philips Respironics', serial: '2161198', deliveryDate: '08.11.2022', owner: 'St. Olavs sykehus', url: '...' },
    consumables: [
      { name: 'Kateter oksygen nesekateter dobbelt 3 lpm 2,1 m Micro Flow voksen', quota: '', lastOrder: '12.01.2026' },
      { name: 'Kateter oksygen nesekateter dobbelt 6 lpm 1,2 m Low flow voksen', quota: '' },
      { name: 'Slange oksygen tilførselsslange "Crush resistant" 15,2 meter', quota: '', nextOrderDate: '2026-05-03', lastOrder: '03.02.2026' },
      { name: 'Swivel/adapter oksygenslange u/klips', quota: '' },
      { name: 'Filter luftinntak oksygenkonsentrator Everflo grov 5 stk/pk', quota: '' },
    ],
  },
  {
    id: 'forstover',
    name: 'Forstøverapparat',
    model: 'NebulAIR+',
    modelNo: 'M-EL37P00',
    details: { type: 'Nebulisator, ordinær', produsent: 'Flaem', serial: '24AA15A0669', deliveryDate: '14.03.2024', owner: 'St. Olavs sykehus', url: '...' },
    consumables: [
      { name: 'Maske forstøverapparat NebulAir Plus voksen', quota: '', nextOrderDate: '2026-04-28', lastOrder: '28.01.2026' },
      { name: 'Slange forstøverapparat NebulAir Plus 2 m', quota: '', lastOrder: '14.08.2025' },
      { name: 'Filter luftinntak Forstøverapparat NebulAir Plus', quota: '' },
      { name: 'Strikk elastisk til maske NebulAir forstøver', quota: '', lastOrder: '12.12.2025' },
      { name: 'Filter ekspirasjon antibiotika forstøverapparat Nebulair 10 stk/pk', quota: '' },
    ],
  },
  {
    id: 'cgm',
    name: 'CGM',
    model: 'FreeStyle Libre 3 avleser',
    modelNo: '72081-01',
    details: { type: 'Overvåking, glukosenivå, interstitialvæske', produsent: 'Abbott', serial: 'NCME119-G0546', deliveryDate: '02.09.2024', owner: 'St. Olavs sykehus', url: '...' },
    consumables: [
      { name: 'Sensor/sender CGM Freestyle Libre 3 Plus', quota: '', nextOrderDate: '2026-04-08', lastOrder: '19.03.2026' },
      { name: 'Desinfeksjon Klorhexidinsprit 5 mg/ml 250 ml', quota: '', lastOrder: '08.03.2026' },
    ],
  },
  {
    id: 'insulin-pumpe-5',
    name: 'Diabetes patch-pumpe',
    model: 'OmniPod 5 PDM',
    modelNo: 'PDM-H001-G-NO',
    details: { type: 'Infusjon, pumpe, insulin, bærbar', produsent: 'Insulet', serial: '051200-29471', deliveryDate: '19.06.2023', owner: 'St. Olavs sykehus', url: '...' },
    consumables: [
      { name: 'Plaster film PodPals OmniPod [Frp 10 stk/pk]', quota: '' },
      { name: 'Insulinpumpe patchpumpe POD engangs Omnipod 5 [Frp 10 stk/pk]', quota: '', nextOrderDate: '2026-05-10', lastOrder: '10.02.2026' },
    ],
  },
  {
    id: 'insulin-pumpe',
    name: 'Diabetes patch-pumpe',
    model: 'OmniPod DASH PDM',
    modelNo: 'PDM-USA1-D001-MG-NO1',
    // Deaktivert state is a future-release feature — temporarily disabled.
    // Uncomment both lines below to re-enable it:
    // deaktivert: true,
    // deaktivertMessage: 'Dette utstyret er nå deaktivert og skal returneres til Behandlingshjelpemiddel-sentralen på St. Olavs sykehus. Kirkeveien 123, Trondheim. Åpningstider 08:30–16:00. Telefon: 987 65 432.',
    details: { type: 'Infusjon, pumpe, insulin, bærbar', produsent: 'Insulet', serial: '040500-18348', deliveryDate: '11.01.2022', owner: 'St. Olavs sykehus', url: '...' },
    consumables: [
      { name: 'Plaster film PodPals OmniPod [Frp 10 stk/pk]', quota: '' },
      { name: 'Insulinpumpe patchpumpe POD engangs Omnipod Dash [Frp 10 stk/pk]', quota: '', nextOrderDate: '2026-05-10', lastOrder: '10.02.2026' },
    ],
  },
];

export const HISTORY_ENTRIES: SubmittedOrder[] = [
  {
    id: 'hist-1',
    date: '19.03.2026',
    equipmentItems: [
      {
        eq: EQUIPMENT[4], // CGM
        quantities: [2, 1],
      },
    ],
    delivery: 'post',
    addr: 'Bjørnveien 14',
    poststed: '7030 Trondheim',
    navn: 'Tora Hansen',
    telefon: '98765432',
    comment: '',
    levert: '22.03.2026',
    saksbehandlerKommentar: '',
  },
  {
    id: 'hist-2',
    date: '10.02.2026',
    equipmentItems: [
      {
        eq: EQUIPMENT[5], // Insulin pumpe 5
        quantities: [0, 3],
      },
    ],
    delivery: 'post',
    addr: 'Bjørnveien 14',
    poststed: '7030 Trondheim',
    navn: 'Tora Hansen',
    telefon: '98765432',
    comment: 'Trenger litt ekstra denne gangen.',
    levert: '13.02.2026',
    saksbehandlerKommentar: 'Ekstra antall godkjent av behandler.',
  },
  {
    id: 'hist-3',
    date: '03.02.2026',
    equipmentItems: [
      {
        eq: EQUIPMENT[2], // Stasjonær oksygen
        quantities: [0, 0, 1, 0, 0],
      },
      {
        eq: EQUIPMENT[0], // CPAP
        quantities: [1, 0, 0, 0],
      },
    ],
    delivery: 'post',
    addr: 'Bjørnveien 14',
    poststed: '7030 Trondheim',
    navn: 'Tora Hansen',
    telefon: '98765432',
    comment: 'Barnebarnet mitt ødela den lange slangen jeg har og den korte er nesten tett, så håper ordren kan ferdigbehandles fort.',
    levert: '03.02.2026',
    saksbehandlerKommentar: 'Det er viktig at den nye tilførselsslangen kobles til i henhold til bruksanvisning.',
  },
  {
    id: 'hist-4',
    date: '15.01.2026',
    equipmentItems: [
      {
        eq: EQUIPMENT[0], // CPAP
        quantities: [2, 1, 0, 1],
      },
    ],
    delivery: 'hentes',
    addr: 'St. Olavs sykehus, Medisinsk utstyrssentralen',
    navn: 'Tora Hansen',
    telefon: '',
    comment: '',
    levert: '18.01.2026',
    saksbehandlerKommentar: '',
  },
];
