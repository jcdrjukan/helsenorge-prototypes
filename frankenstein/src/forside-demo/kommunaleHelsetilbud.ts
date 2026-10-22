// Content for "Helsetjenester kommunen tilbyr" (#kommunale-tjenester-oslo),
// taken from drawing 5a in kommunale-helsetilbud.html (2026-10-22). Contact
// details there were for Drammen; e-mail domains and post towns are switched
// to Oslo to match the page. Names, phone numbers and street names are
// placeholders.

export type Kategori = 'barn-familie' | 'livsstil' | 'psykisk-helse' | 'rus';

export const KATEGORIER: { id: Kategori; label: string }[] = [
  { id: 'barn-familie', label: 'Barn og familie' },
  { id: 'livsstil', label: 'Livsstil og aktivitet' },
  { id: 'psykisk-helse', label: 'Psykisk helse' },
  { id: 'rus', label: 'Rus' },
];

export const KATEGORI_LABEL: Record<Kategori, string> = Object.fromEntries(
  KATEGORIER.map(k => [k.id, k.label]),
) as Record<Kategori, string>;

export type IkonNavn =
  | 'person' | 'video' | 'legevakt' | 'psykisk' | 'rus' | 'friskliv' | 'svangerskap'
  | 'barn' | 'skole' | 'ungdom' | 'vaksine' | 'hjem' | 'rehab' | 'fysio'
  | 'korttid' | 'demens' | 'barnekoord' | 'logoped' | 'mestring';

export interface Seksjon { heading: string; text: string[] }
export interface Kontaktlinje { label: string; value: string; href?: string }
export interface Lenke { text: string; external?: boolean }
export interface Knapp { text: string; icon: 'kalender' | 'konvolutt' }

export interface Helsetilbud {
  id: string;
  title: string;
  desc: string;
  icon: IkonNavn;
  tags?: Kategori[];
  sections: Seksjon[];
  /** "Dette tilbyr kommunen din" — shown after the first section. */
  underTilbud?: { title: string; text: string }[];
  contact?: Kontaktlinje[];
  links?: Lenke[];
  buttons?: Knapp[];
}

export const KONTAKTER: Helsetilbud[] = [
  {
    id: 'fastlege',
    title: 'Fastlege',
    desc: 'Den første du kontakter når du har et helseproblem.',
    icon: 'person',
    sections: [{
      heading: 'Hva kan fastlegen hjelpe deg med?',
      text: ['Fastlegen er den du først kontakter når du trenger helsehjelp. Fastlegen kan hjelpe deg med fysiske og psykiske helseplager, behandling og oppfølging, og henvise deg videre ved behov.'],
    }],
    contact: [
      { label: 'Din fastlege er', value: 'Lege Legetsen' },
      { label: 'Din fastlege siden', value: '12. oktober 2012' },
      { label: 'Legekontor', value: 'Ekeberg legekontor' },
    ],
    links: [{ text: 'Se info om din fastlege og legekontor' }],
    buttons: [{ text: 'Bestill time', icon: 'kalender' }, { text: 'Skriv melding', icon: 'konvolutt' }],
  },
  {
    id: 'nettlege',
    title: 'Kommunal nettlege',
    desc: 'Rask hjelp fra lege på video.',
    icon: 'video',
    sections: [{
      heading: 'Hva kan Kommunal nettlege hjelpe deg med?',
      text: ['Kommunal nettlege får du raskt videotime hos lege. Kun for helseplager som ikke krever fysisk undersøkelse eller oppfølging.'],
    }],
    links: [{ text: 'Les mer om Kommunal nettlege' }],
    buttons: [{ text: 'Bestill time', icon: 'kalender' }],
  },
  {
    id: 'legevakt',
    title: 'Legevakt',
    desc: 'Når du trenger helsehjelp raskt.',
    icon: 'legevakt',
    sections: [{
      heading: 'Hva kan legevakt hjelpe deg med?',
      text: ['Legevakten kan hjelpe deg når fastlegekontoret ditt er stengt og hjelpen ikke kan vente. Ring først slik at du får veiledning og riktig hjelp.'],
    }],
    // The drawing has 116 177; legevakten's national number is 116 117.
    contact: [{ label: 'Telefon', value: '116 117', href: 'tel:116117' }],
    links: [{ text: 'Les mer om legevakt' }],
  },
];

const KOMMUNENS_NETTSIDE: Lenke = { text: 'Les mer på kommunens nettside', external: true };

export const HELSETILBUD: Helsetilbud[] = [
  {
    id: 'psykisk-helse',
    title: 'Psykisk helse',
    desc: 'Hjelp til deg som har psykiske utfordringer.',
    icon: 'psykisk',
    tags: ['psykisk-helse'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Kommunen har ulike tilbud til deg som sliter psykisk. Du kan blant annet få hjelp for søvnproblemer, angst og depresjon. Pårørende kan også få hjelp.'] },
      { heading: 'Slik får du hjelp', text: ['Kontakt kommunens psykiske helsetjeneste for å få informasjon om hva slags hjelp som finnes. Fastlegen kan også hjelpe deg med å finne riktig tilbud.'] },
    ],
    underTilbud: [
      { title: 'Rask psykisk helsehjelp', text: 'Gratis korttidshjelp uten henvisning ved lett til moderat angst og depresjon. Fra 16 år.' },
      { title: 'Psykologtjeneste', text: 'Samtaler og veiledning med kommunepsykolog for barn, unge og voksne.' },
    ],
    contact: [
      { label: 'Telefon', value: '32 04 50 00', href: 'tel:32045000' },
      { label: 'E-post', value: 'psykiskhelse@oslo.kommune.no', href: 'mailto:psykiskhelse@oslo.kommune.no' },
    ],
    links: [{ text: 'Meld deg på via kommunens skjema', external: true }, { text: 'Les mer om psykisk helsehjelp' }],
  },
  {
    id: 'rus',
    title: 'Rus og avhengighet',
    desc: 'Tilbud til deg som sliter med rus.',
    icon: 'rus',
    tags: ['rus'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'Kommunen kan hjelpe deg som har problemer med alkohol eller andre rusmidler. Du kan få støtte til å redusere eller slutte med rusmidler, mestre hverdagen eller håndtere utfordringer knyttet til rus.',
        'Du kan for eksempel få tilbud om samtaler, rådgivning, praktisk oppfølging og støtte til å komme i behandling. Pårørende kan også få råd og veiledning.',
      ] },
      { heading: 'Slik får du hjelp', text: [
        'Du kan kontakte kommunens rustjeneste direkte eller snakke med fastlegen om behovet ditt.',
        'Kommunen vurderer hvilke behov du har, og hvilken hjelp som passer best for deg. Du trenger ikke være rusfri for å få hjelp.',
      ] },
    ],
    links: [{ text: 'Les mer om rus og avhengighet på helsenorge' }],
  },
  {
    id: 'friskliv',
    title: 'Frisklivssentral',
    desc: 'Få støtte til å endre levevaner og mestre dine helseutfordringer.',
    icon: 'friskliv',
    tags: ['livsstil', 'psykisk-helse'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'Frisklivssentralen kan hjelpe deg med å mestre hverdagen og ta vare på helsa di. Du kan for eksempel få hjelp til å få et bedre kosthold, bli mer fysisk aktiv, slutte med snus og røyk, bli sterkere psykisk, eller få bedre søvn.',
        'Mange frisklivssentraler har også tilbud for barn, unge og deres familier.',
      ] },
      { heading: 'Slik får du hjelp', text: [
        'Alle som har en sykdom eller økt risiko for å utvikle sykdom kan få hjelp hos frisklivssentralen.',
        'Ta kontakt med kommunen din for å finne ut om det finnes en frisklivssentral der du bor. Du kan også få henvisning fra fastlegen din, annet helsepersonell eller Nav.',
      ] },
    ],
    contact: [
      { label: 'Telefon', value: '32 04 60 70', href: 'tel:32046070' },
      { label: 'E-post', value: 'frisklivs@oslo.kommune.no', href: 'mailto:frisklivs@oslo.kommune.no' },
    ],
    links: [{ text: 'Meld deg på aktiviteter', external: true }, { text: 'Les mer om Frisklivssentral' }],
  },
  {
    id: 'svangerskap',
    title: 'Svangerskap, fødsel og barsel',
    desc: 'Hjelp og oppfølging fra jordmor.',
    icon: 'svangerskap',
    tags: ['barn-familie'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'Du får tilbud om jevnlige svangerskapskontroller hos jordmor gjennom hele graviditeten. Jordmor gir råd, undersøker deg og fosteret og følger deg gjennom svangerskapet og tiden etter fødselen.',
        'Jordmor hjelper deg med spørsmål om graviditeten, barnets utvikling, fødsel, amming og hvordan du har det fysisk og psykisk.',
      ] },
      { heading: 'Slik får du hjelp', text: [
        'Kontakt jordmortjenesten i kommunen din når du finner ut at du er gravid. Du trenger ikke henvisning fra lege.',
        'Svangerskapsoppfølgingen er gratis.',
      ] },
    ],
    links: [{ text: 'Les mer om jordmortjenesten i kommunen' }],
  },
  {
    id: 'helsestasjon-barn',
    title: 'Helsestasjon for barn',
    desc: 'For gravide og barn i alderen 0-5 år.',
    icon: 'barn',
    tags: ['barn-familie', 'livsstil'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'Helsestasjonen tilbyr gratis oppfølging av barn fra fødsel til skolestart. Her får barnet helsekontroller og vaksiner, og du som forelder kan få råd og veiledning.',
        'Du kan få hjelp med spørsmål om blant annet barnets vekst og utvikling, mat, søvn, språk, trivsel og om foreldrerollen.',
      ] },
      { heading: 'Slik får du tilbud', text: [
        'Alle barn får tilbud om faste helsekontroller på helsestasjonen. Helsestasjonen tar kontakt for å avtale de første kontrollene.',
        'Kontakt helsestasjonen direkte hvis du har spørsmål eller trenger hjelp mellom de faste timene. Mange helsestasjoner har åpne dager hvor du ikke trenger å ringe for å avtale time først.',
        'Gå til «Helsekontakter» på barnets profil for å se om du kan kontakte helsestasjonen gjennom Helsenorge.',
      ] },
    ],
    contact: [
      { label: 'Telefon', value: '32 04 70 00', href: 'tel:32047000' },
      { label: 'Adresse', value: 'Bragernes torg 4, 0150 Oslo' },
    ],
    links: [{ text: 'Les mer om helsestasjon for barn' }],
  },
  {
    id: 'skolehelse',
    title: 'Skolehelsetjenesten',
    desc: 'For barn og ungdom i alderen 5-20 år.',
    icon: 'skole',
    tags: ['barn-familie', 'psykisk-helse'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'I skolehelsetjenesten kan du snakke med helsesykepleier og noen ganger også skolelege, fysioterapeut og psykolog.',
        'Du kan snakke med helsesykepleier om blant annet kropp og pubertet, psykisk helse, stress, vennskap, mobbing, familie eller andre ting som er vanskelige.',
        'Skolehelsetjenesten tilbyr også enkelte helseundersøkelser og vaksiner.',
        'De som jobber der har taushetsplikt og kan hjelpe deg videre hvis du trenger mer støtte.',
      ] },
      { heading: 'Slik får du tilbud', text: [
        'Du trenger ikke bestille time for å snakke med helsesykepleier eller andre i skolehelsetjenesten. Det er bare å møte opp (drop-in). Hvis helsesykepleier ikke er til stede eller er opptatt, står det ofte en beskjed på døren.',
        'Kontaktinformasjonen til skolehelsetjenesten skal stå på nettsiden til din kommune eller skolen.',
      ] },
    ],
    links: [{ text: 'Les mer om skolehelsetjenesten' }],
  },
  {
    id: 'helsestasjon-ungdom',
    title: 'Helsestasjon for ungdom',
    desc: 'Gratis tilbud til ungdom',
    icon: 'ungdom',
    tags: ['barn-familie', 'psykisk-helse', 'rus'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'Helsestasjon for ungdom er et gratis helsetilbud der du kan snakke med helsepersonell om kropp, psykisk helse, seksualitet, prevensjon og andre spørsmål du har om helse og livet ditt.',
        'Du kan blant annet få hjelp med prevensjon, teste deg for seksuelt overførbare infeksjoner eller snakke om stress, vanskelige følelser og forhold til andre.',
        'De som jobber der, har taushetsplikt. Tilbudet er for ungdom, vanligvis fra 12 til 20 år, men noen kommuner har en høyere aldersgrense.',
      ] },
      { heading: 'Slik får du tilbud', text: [
        'Du kan vanligvis møte opp uten å bestille time. Noen steder kan du også avtale time på forhånd.',
        'Sjekk åpningstidene til helsestasjonen i kommunen din før du kommer. Du trenger ikke henvisning.',
      ] },
    ],
    contact: [
      { label: 'Åpent', value: 'Tirsdag og torsdag 14–18' },
      { label: 'Adresse', value: 'Tollbugata 1, 0152 Oslo' },
    ],
    links: [{ text: 'Les mer om helsestasjon for ungdom' }],
  },
  {
    id: 'vaksiner',
    title: 'Vaksiner og smittevern',
    desc: 'Vaksiner og råd om forebygging av smittsomme sykdommer.',
    icon: 'vaksine',
    tags: ['livsstil', 'barn-familie'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: [
        'Kommunen tilbyr vaksiner gjennom offentlige vaksinasjonsprogrammer. Dette kan blant annet være vaksiner mot influensa, korona og pneumokokksykdom for aktuelle grupper.',
        'Du kan også få informasjon om anbefalte vaksiner og hvilke vaksiner du kan ha behov for ut fra alder, helse og andre risikofaktorer.',
        'Du kan få råd om smittsomme sykdommer og hvordan du kan forebygge smitte. Hvis du har vært utsatt for smitte, for eksempel tuberkulose, kan du også få oppfølging.',
      ] },
      { heading: 'Slik får du tilbud', text: [
        'Kontakt kommunens vaksinetjeneste eller smittevernskontor, eller se kommunens nettside for å bestille time.',
        'Hvilke vaksiner du kan få, hvor de settes, og hva du må betale, avhenger av vaksinen og tilbudet i kommunen. Noen vaksiner kan du ta hos fastlegen.',
        'Barn får vaksiner i barnevaksinasjonsprogrammet på helsestasjonen.',
      ] },
    ],
    contact: [{ label: 'Telefon', value: '32 04 72 00', href: 'tel:32047200' }],
    links: [{ text: 'Bestill vaksinetime', external: true }, { text: 'Les mer om vaksiner på Helsenorge' }],
  },
  {
    id: 'hjemme',
    title: 'Helsetjenester i hjemmet',
    desc: 'Sykepleie og praktisk hjelp der du bor.',
    icon: 'hjem',
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Hjemmesykepleie, praktisk bistand og opplæring for deg som trenger hjelp for å kunne bo hjemme.'] },
      { heading: 'Slik får du tilbud', text: ['Du må søke kommunen. Du får et vedtak som beskriver hjelpen du får.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'rehab',
    title: 'Habilitering og rehabilitering',
    desc: 'For å gjenopprette funksjon etter sykdom eller skade.',
    icon: 'rehab',
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Trening og oppfølging i hjemmet eller på institusjon, slik at du kan klare mest mulig selv.'] },
      { heading: 'Slik får du tilbud', text: ['Du får tilbudet etter søknad, ofte via lege eller sykehus.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'fysio',
    title: 'Fysioterapi',
    desc: 'Behandling og trening ved plager i muskler og ledd.',
    icon: 'fysio',
    tags: ['livsstil'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Kommunale fysioterapeuter tilbyr behandling og trening, både på institutt og i hjemmet.'] },
      { heading: 'Slik får du tilbud', text: ['Du kan ta kontakt selv. Noen tilbud krever henvisning.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'korttid',
    title: 'Korttidsopphold',
    desc: 'Midlertidig opphold på sykehjem.',
    icon: 'korttid',
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Et tidsbegrenset opphold for behandling, rehabilitering eller avlastning for pårørende.'] },
      { heading: 'Slik får du tilbud', text: ['Du må søke kommunen.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'demens',
    title: 'Demenskoordinator',
    desc: 'For personer med demens og deres pårørende.',
    icon: 'demens',
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Demenskoordinator hjelper med utredning, informasjon og oppfølging, og er kontaktperson for pårørende.'] },
      { heading: 'Slik får du tilbud', text: ['Du kan ta kontakt selv, eller via fastlegen.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'barnekoord',
    title: 'Barnekoordinator',
    desc: 'For familier med barn som har alvorlig sykdom eller funksjonsnedsettelse.',
    icon: 'barnekoord',
    tags: ['barn-familie'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Barnekoordinator hjelper familien med å samordne tjenester og er en fast kontaktperson.'] },
      { heading: 'Slik får du tilbud', text: ['Helsepersonell setter deg i kontakt med barnekoordinator. Du kan også søke selv.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'logoped',
    title: 'Logopedtjeneste',
    desc: 'Hjelp ved språk-, tale- og svelgevansker.',
    icon: 'logoped',
    tags: ['barn-familie'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Logoped gir utredning og behandling til barn og voksne med språk-, tale-, stemme- eller svelgevansker.'] },
      { heading: 'Slik får du tilbud', text: ['Du trenger henvisning fra lege eller PP-tjenesten.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
  {
    id: 'mestring',
    title: 'Læring og mestring',
    desc: 'Kurs for deg som lever med sykdom, og for pårørende.',
    icon: 'mestring',
    tags: ['psykisk-helse'],
    sections: [
      { heading: 'Hva kan tilbudet hjelpe deg med?', text: ['Kurs og samtalegrupper som gir kunnskap og verktøy til å mestre hverdagen med langvarig sykdom.'] },
      { heading: 'Slik får du tilbud', text: ['Du kan melde deg på selv.'] },
    ],
    links: [KOMMUNENS_NETTSIDE],
  },
];
