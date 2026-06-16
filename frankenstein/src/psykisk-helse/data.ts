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
  'Å være mer aktiv',
  'Bekymret for at jeg har en spiseforstyrrelse',
  'Føle meg mindre ensom',
  'Hjelp med en skadelig vane (alkohol, rusmidler, tobakk eller spill)',
  'Føle meg bedre om meg selv',
  'Håndtere hverdagen bedre',
  'Hjelp med relasjonene mine',
  'Forbedre mitt sosiale nettverk',
  'Ingen av disse',
];
