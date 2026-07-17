export interface Registration {
  gjeldende: number;
  avkreftet: number;
  begrunnelse: string;
  registrertDato: string;
  registrertAv: string;
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
      'Alvorlige reaksjoner på legemidler, som allergiske reaksjoner eller andre bivirkninger som er viktige å kjenne til før ny behandling.',
    group: 1,
    registration: {
      gjeldende: 1,
      avkreftet: 1,
      begrunnelse: 'Penicillin ga anafylaktisk reaksjon.',
      registrertDato: '14.03.2024',
      registrertAv: 'Kari Nordmann (fastlege)',
    },
  },
  {
    id: 'annen-allergier',
    title: 'Annen allergier',
    description:
      'Alvorlige allergier som ikke gjelder legemidler, for eksempel mot lateks, matvarer eller stoffer brukt i behandling.',
    group: 1,
  },
  {
    id: 'intubasjonsproblemer',
    title: 'Intubasjonsproblemer',
    description:
      'Kjente vanskeligheter med å sikre frie luftveier, for eksempel problemer med å legge inn pustetube ved narkose.',
    group: 1,
  },
  {
    id: 'annet-problem-med-anestesi',
    title: 'Annet problem med anestesi',
    description: 'Andre kjente reaksjoner eller komplikasjoner knyttet til bedøvelse og narkose.',
    group: 1,
    registration: {
      gjeldende: 1,
      avkreftet: 0,
      begrunnelse: 'Malign hypertermi ved narkose i 2019.',
      registrertDato: '02.05.2024',
      registrertAv: 'Kari Nordmann (fastlege)',
    },
  },
  {
    id: 'pagaende-behandling',
    title: 'Pågående behandling',
    description:
      'Behandling pasienten er under nå som er viktig å ta hensyn til, for eksempel blodfortynnende eller immundempende behandling.',
    group: 1,
  },
  {
    id: 'implantat-og-transplantat',
    title: 'Implantat og transplantat',
    description:
      'Innopererte hjelpemidler eller organer, for eksempel pacemaker, hjerteklaff, protese eller transplantert organ.',
    group: 1,
  },
  {
    id: 'smitte',
    title: 'Smitte',
    description: 'Smittsomme tilstander som krever spesielle forholdsregler for å beskytte pasient og helsepersonell.',
    group: 1,
  },
  {
    id: 'kritisk-medisinsk-tilstand',
    title: 'Kritisk medisinsk tilstand',
    description:
      'Sykdommer eller tilstander som kan få alvorlige konsekvenser og krever rask oppmerksomhet i en akuttsituasjon.',
    group: 1,
  },
  {
    id: 'hlr-og-behandlingsavklaringer',
    title: 'HLR- og behandlingsavklaringer',
    description: 'Beslutninger om hjerte-lungeredning og eventuell begrensning av livsforlengende behandling.',
    group: 2,
  },
  {
    id: 'annen-prosedyreendring',
    title: 'Annen prosedyreendring',
    description: 'Andre forhold som gjør at vanlige undersøkelser eller behandlinger må tilpasses eller endres.',
    group: 2,
  },
];
