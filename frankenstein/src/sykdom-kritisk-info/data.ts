export interface Registration {
  gjeldende: number;
  avkreftet: number;
  detail: string;
}

export interface CriticalCategory {
  id: string;
  title: string;
  description: string;
  group: 1 | 2;
  registration?: Registration;
}

export const CATEGORIES: CriticalCategory[] = [
  {
    id: 'legemiddelreaksjoner',
    title: 'Legemiddelreaksjoner',
    description:
      'Her vises legemidler og annet som kan gi deg en alvorlig reaksjon som for eksempel allergisk sjokk eller alvorlig utslett.',
    group: 1,
    registration: {
      gjeldende: 1,
      avkreftet: 1,
      detail: 'Penicillin — anafylaktisk reaksjon. Registrert 14.03.2024 av fastlege Kari Nordmann.',
    },
  },
  {
    id: 'annen-allergier',
    title: 'Annen allergier',
    description: 'Her vises alvorlige allergiske reaksjoner som ikke er legemiddelreaksjoner.',
    group: 1,
  },
  {
    id: 'intubasjonsproblemer',
    title: 'Intubasjonsproblemer',
    description: 'Her vises tidligere problemer med intubasjon som er viktig for helsepersonell å kjenne til.',
    group: 1,
  },
  {
    id: 'annet-problem-med-anestesi',
    title: 'Annet problem med anestesi',
    description:
      'Har du opplevd alvorlige komplikasjoner ved narkose eller annen bedøvelse, skal det være registrert her.',
    group: 1,
    registration: {
      gjeldende: 1,
      avkreftet: 0,
      detail: 'Malign hypertermi ved narkose i 2019. Registrert 02.05.2024 av fastlege Kari Nordmann.',
    },
  },
  {
    id: 'pagaende-behandling',
    title: 'Pågående behandling',
    description: 'Her vises pågående behandlinger som kan påvirke annen medisinsk behandling.',
    group: 1,
  },
  {
    id: 'implantat-og-transplantat',
    title: 'Implantat og transplantat',
    description: 'Her vises implantater og transplantater som er viktig informasjon ved undersøkelser og behandling.',
    group: 1,
  },
  {
    id: 'smitte',
    title: 'Smitte',
    description: 'Her vises smittsomme sykdommer som helsepersonell bør kjenne til av smittevernhensyn.',
    group: 1,
  },
  {
    id: 'kritisk-medisinsk-tilstand',
    title: 'Kritisk medisinsk tilstand',
    description: 'Her vises kroniske eller alvorlige medisinske tilstander som er kritiske å kjenne til.',
    group: 1,
  },
  {
    id: 'hlr-og-behandlingsavklaringer',
    title: 'HLR- og behandlingsavklaringer',
    description: 'Her vises avklaringer om hjerte-lunge-redning og annen behandling ved akutt forverring.',
    group: 2,
  },
  {
    id: 'annen-prosedyreending',
    title: 'Annen prosedyreending',
    description: 'Her vises andre forhold som gjør at en behandlingsprosedyre bør tilpasses.',
    group: 2,
  },
];
