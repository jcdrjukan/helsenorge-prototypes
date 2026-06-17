export type ResourceCategory = 'verktøy' | 'artikkel' | 'ekstern';

export interface Resource {
  id: string;
  category: ResourceCategory;
  title: string;
  timeLabel: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const RESOURCES: Resource[] = [
  // Verktøy
  {
    id: 'tankevirus',
    category: 'verktøy',
    title: 'Tankevirus',
    timeLabel: '5 min/dag',
    description: 'Tankevirus er en populær barne-/ungdomsapp som lærer deg å identifisere og håndtere negative tankemønstre.',
    ctaLabel: 'Gå til appen',
    ctaUrl: '#',
  },
  {
    id: 'grubl',
    category: 'verktøy',
    title: 'Grubl',
    timeLabel: '8 min/dag',
    description: 'Bruk mindre tid på grubling og bekymring – et nettbasert selvhjelpsverktøy som hjelper deg å gruble mindre.',
    ctaLabel: 'Gå til appen',
    ctaUrl: '#',
  },
  {
    id: 'sovnhjelp',
    category: 'verktøy',
    title: 'Søvnhjelpesiden mot kortvarige søvnvansker',
    timeLabel: 'Video (13:36)',
    description: 'Denne videoen gir deg innsikt i og konkrete teknikker for å beherske søvnvansker.',
    ctaLabel: 'Gå til videoen',
    ctaUrl: '#',
  },

  // Artikler
  {
    id: 'pusteoevelser',
    category: 'artikkel',
    title: 'Pusteøvelser som roer',
    timeLabel: '≈ 15 min',
    description: 'Enkle teknikker som aktiverer kroppens avslapningsrespons og demper stress.',
    ctaLabel: 'Gå til artikkelen',
    ctaUrl: '#',
  },
  {
    id: 'sovnhygiene',
    category: 'artikkel',
    title: 'God søvnhygiene',
    timeLabel: '≈ 10 min',
    description: 'Rutiner som gir bedre nattesøvn og mer energi gjennom dagen.',
    ctaLabel: 'Gå til artikkelen',
    ctaUrl: '#',
  },
  {
    id: 'angst',
    category: 'artikkel',
    title: 'Slik kjenner du igjen angst',
    timeLabel: '≈ 29 min',
    description: 'Lær om uro, panikk og kroppslige reaksjoner – og hva du kan gjøre med dem.',
    ctaLabel: 'Gå til artikkelen',
    ctaUrl: '#',
  },
];

export const Q1_OPTIONS = [
  'Søver dårlig',
  'Angst (uro, panikk, fobier)',
  'Stress (overbelastet, mye press)',
  'Dårlig humør (nedstemt, trist)',
];

export const Q2_OPTIONS = [
  'Bli mindre plaget av bekymringer og angst',
  'Få det bedre når jeg er nedstemt',
  'Sove bedre',
  'Håndtere stress og press i hverdagen',
  'Endre forholdet mitt til alkohol eller rusmidler',
  'Få bedre kontroll på spilling (penger/gambling)',
  'Føle meg mindre ensom eller styrke relasjonene mine',
  'Forstå meg selv og situasjonen min bedre',
  'Noe annet / Ingen av disse',
];
