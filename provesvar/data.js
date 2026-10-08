// Shared result data for the Prøvesvar prototype (resultat.html,
// personvern.html). Loaded with a plain <script>, before page scripts.
// ─── Result data (?id=N, matching the list on index.html) ─────────
// From the live page's test data, one entry per list item. Text uses
// {Term} for words with an ordforklaring (word explanation); the
// explanations in ORDFORKLARINGER are drafts. "Utført av" for results
// 2–9 and the eyebrow for Cytologi aren't in the supplied markup:
// Utført av follows result 1's pattern (the institution from the
// rekvirent); Cytologi's eyebrow is assumed to be "Patologi".
const ORDFORKLARINGER = {
  'Rekvirert av:': 'Den som ba om at prøven skulle tas, for eksempel fastlegen din.',
  'Utført av:': 'Laboratoriet eller virksomheten som analyserte prøven.',
  'Referanseområde': 'Området der verdiene til de fleste friske personer ligger. En verdi utenfor betyr ikke nødvendigvis at noe er galt.',
  'Mengde': 'Hvor mange bakterier som ble funnet i prøven.',
  'S-CRP': 'C-reaktivt protein (CRP) målt i serum. CRP stiger ved betennelse og infeksjon i kroppen.',
  'mg/l': 'Milligram per liter: hvor mange milligram av stoffet det er i én liter blod.',
  'mg/L': 'Milligram per liter: hvor mange milligram av stoffet det er i én liter blod.',
  'U-Leukocytter': 'Hvite blodceller i urinen. Kan tyde på betennelse eller infeksjon i urinveiene.',
  'U-Kreatinin': 'Et avfallsstoff fra musklene, målt i urinen. Brukes blant annet til å vurdere hvor konsentrert urinen er.',
  'Us-SARS-relatert koronavirus': 'Test som påviser koronavirus, inkludert SARS-CoV-2, i en prøve fra luftveiene.',
  'HPV': 'Humant papillomavirus. Noen typer kan over tid gi celleforandringer i livmorhalsen.',
  'cervixcytologi': 'Undersøkelse av celler fra livmorhalsen.',
  'Cervix': 'Livmorhalsen.',
  'Us-FT4': 'Fritt tyroksin, et hormon fra skjoldbruskkjertelen.',
  'pmol/L': 'Pikomol per liter.',
  'P-D-dimer': 'Et nedbrytningsprodukt fra blodpropper. Brukes blant annet til å utelukke blodpropp.',
  'B-Leukocytter': 'Hvite blodceller i blodet. Er ofte forhøyet ved infeksjon.',
  '10E9/L': 'Milliarder celler per liter blod.',
  'B-Hemoglobin': 'Proteinet i de røde blodcellene som frakter oksygen rundt i kroppen.',
  'g/dL': 'Gram per desiliter.',
  'Us-TSH': 'Tyreoideastimulerende hormon. Styrer hvor mye hormon skjoldbruskkjertelen lager.',
  'P-INR': 'Et mål på hvor raskt blodet levrer seg.',
  'Us-FSH': 'Follikkelstimulerende hormon.',
  'IU/L': 'Internasjonale enheter per liter.',
  'U/L': 'Enheter per liter.',
  'U-Bakterier dyrkning': 'Urinprøven er dyrket for å se om det vokser bakterier i den.',
};
// Building blocks. A block is { rows: [[dt, dd], …], historikk, graf }.
const PNA = 'Pasientnær analyse';
const lab = (navn, resultat, extra = []) => ({ rows: [['Undersøkelse', [navn, PNA]], ['Laboratorieresultat', resultat], ...extra], historikk: true });
const ref = (navn, resultat, omrade, enhet, opts = {}) => ({
  rows: [['Undersøkelse', navn], ['Resultat', resultat, opts.avvik], ['{Referanseområde}', omrade], ['Måleenhet', enhet]],
  historikk: true, graf: opts.graf,
});
const LUKKET = (tittel, tekst) => ({ tittel, tekst });
const CYTOLOGI_BLOKKER = [
  { rows: [['Aktuell problemstilling', 'Her kan rekvirenten legge inn kliniske opplysninger som er viktige for denne rekvisisjonen']] },
  { rows: [['Undersøkelse', ['Cytologi', '{HPV}-test']],
           ['Funn og resultater fra undersøkelser', 'Normal {cervixcytologi}.\nHøyrisiko {HPV} påvist.\n\nNy livmorhalsprøve til {HPV}-test anbefales om 24 måneder, ifølge retningslinjene i Livmorhalsprogrammet, forutsatt at kliniske funn ikke tilsier annet.'],
           ['Prøvemateriale', '{Cervix}']] },
  { rows: [['Vurdering', 'Tilstedeværelse av sylinderepitel er en kvalitetsindikator, men manglende sylinderepitel gjør ikke prøven uegnet.']] },
  { rows: [['Undersøkelse', '{HPV} 16'], ['Resultat', 'Negativ']] },
  { rows: [['Undersøkelse', '{HPV} 18'], ['Resultat', 'Negativ']] },
  { rows: [['Undersøkelse', '{HPV} andre typer'], ['Resultat', 'Positiv'],
           ['Kommentar', 'Det er utført {HPV}-undersøkelse med Cobas 6800. Følgende høyrisikovirus er undersøkt: 31, 33, 35, 39, 45, 51, 52, 56, 58, 59, 66 og 68.']] },
];
const IKKE_MED = 'Innholdet her er ikke med i prototypen ennå.';
const RESULTATER = {
  1: { omrade: 'Medisinsk biokjemi', fagomrade: 'Laboratoriemedisin', dato: '18.03.2026',
       rekvirert: 'Uavhengig Fjernsyn, WebMed Test HelseNorge -TREG VOKAL KATT SKORPION', utfort: 'WebMed Test HelseNorge -TREG VOKAL KATT SKORPION',
       ekspandere: [{ tittel: 'Prøvesvar (1)', blokker: [lab('CRP', '123')] }, LUKKET('Tilleggsinformasjon (0)', 'Ingen tilleggsinformasjon.')] },
  2: { omrade: 'Medisinsk biokjemi', fagomrade: 'Laboratoriemedisin', dato: '19.02.2026',
       rekvirert: 'WebMed Demobruker, Evila Øyelegeseter AS', utfort: 'Evila Øyelegeseter AS',
       ekspandere: [{ tittel: 'Prøvesvar (1)', blokker: [lab('{S-CRP}', '21', [['Måleenhet', '{mg/l}']])] }, LUKKET('Tilleggsinformasjon (0)', 'Ingen tilleggsinformasjon.')] },
  3: { omrade: 'Medisinsk biokjemi', fagomrade: 'Laboratoriemedisin', dato: '30.01.2026',
       rekvirert: 'Grønn Vits, WebMed Test HelseNorge', utfort: 'WebMed Test HelseNorge',
       ekspandere: [{ tittel: 'Prøvesvar (7)', blokker: [lab('{U-Leukocytter}', '1'), lab('U-Protein', '1'), lab('U-Blod', '1'), lab('U-Spesifikk vekt', '1'), lab('U-Ketoner', '1'), lab('U-Nitritt', '1'), lab('{U-Kreatinin}', '1')] },
                    LUKKET('Tilleggsinformasjon (0)', 'Ingen tilleggsinformasjon.')] },
  4: { omrade: 'Medisinsk biokjemi', fagomrade: 'Laboratoriemedisin', dato: '29.01.2026',
       rekvirert: 'Grønn Vits, Evila Øyelegeseter AS', utfort: 'Evila Øyelegeseter AS',
       ekspandere: [{ tittel: 'Prøvesvar (1)', blokker: [lab('Hurtigtest COVID19', 'neg')] }, LUKKET('Tilleggsinformasjon (0)', 'Ingen tilleggsinformasjon.')] },
  5: { omrade: 'Medisinsk mikrobiologi', fagomrade: 'Laboratoriemedisin', dato: '13.01.2026',
       rekvirert: 'Kommuneoverlege Gro K, Trondheim kommune - Smittevern', utfort: 'Trondheim kommune - Smittevern',
       ekspandere: [{ tittel: 'Prøvesvar (1)', blokker: [{ rows: [['Undersøkelse', '{Us-SARS-relatert koronavirus} (inkl. SARS-CoV-2) antigen'], ['Laboratorieresultat', 'Påvist'], ['Prøvemateriale', 'Hals+nasopharynxsekret'], ['Kommentar', 'Her kan man legge inn en kommentar til resultatet ved behov']], historikk: true }] },
                    LUKKET('Prøvemateriale (1)', IKKE_MED), LUKKET('Tilleggsinformasjon (2)', IKKE_MED)] },
  6: { omrade: 'Cytologi', fagomrade: 'Patologi', dato: '11.09.2025',
       rekvirert: 'NORSK HELSENETT SF, Pasientens prøvesvar', utfort: 'NORSK HELSENETT SF',
       ekspandere: [{ tittel: 'Prøvesvar', blokker: CYTOLOGI_BLOKKER }, LUKKET('Detaljer om prøvesvar', IKKE_MED), LUKKET('Prøvemateriale (1)', IKKE_MED), LUKKET('Tilleggsinformasjon (0)', 'Ingen tilleggsinformasjon.')] },
  7: { omrade: 'Medisinsk biokjemi', fagomrade: 'Laboratoriemedisin', dato: '04.08.2025',
       rekvirert: 'Sulten Lege, LIS1, Kattskinnet legesenter', utfort: 'Kattskinnet legesenter',
       ekspandere: [{ tittel: 'Prøvesvar (8)', blokker: [
         ref('{Us-FT4}', '11', '10 - 22', '{pmol/L}', { graf: [11, 10, 22] }),
         ref('{P-D-dimer}', '0,4', '< 0,5', '{mg/L}'),
         ref('Us-LH', '14', '< 12', '{IU/L}', { avvik: '(over øvre referanseområde)' }),
         ref('{B-Leukocytter}', '11', '3,5 - 11,0', '{10E9/L}', { graf: [11, 3.5, 11] }),
         ref('{B-Hemoglobin}', '15', '11,7 - 15,3', '{g/dL}', { graf: [15, 11.7, 15.3] }),
         ref('{Us-TSH}', '4,4', '0,3 - 4,5', '10E-3/L', { graf: [4.4, 0.3, 4.5] }),
         ref('{P-INR}', '1,1', '< 1,2', '0'),
         ref('{Us-FSH}', '11', '< 12', '{U/L}'),
       ] }, LUKKET('Prøvemateriale (3)', IKKE_MED), LUKKET('Tilleggsinformasjon (2)', IKKE_MED)] },
  8: { omrade: 'Medisinsk mikrobiologi', fagomrade: 'Laboratoriemedisin', dato: '04.08.2025',
       rekvirert: 'Sulten Lege, LIS1, Kattskinnet legesenter', utfort: 'Kattskinnet legesenter',
       ekspandere: [{ tittel: 'Prøvesvar (2)', blokker: [
         { rows: [['Undersøkelse', '{U-Bakterier dyrkning}'], ['Funn 1', 'Escherichia coli'], ['Prøvemateriale', 'Urin'], ['{Mengde}', '>100.000 bakterier pr.ml.']], historikk: true },
         { rows: [['Undersøkelse', '{U-Bakterier dyrkning}'], ['Funn 2', 'Klebsiella pneumoniae'], ['Prøvemateriale', 'Urin'], ['{Mengde}', '>1000 CFU/1000 ml.']], historikk: true },
       ] }, LUKKET('Resistensbestemmelse (5)', IKKE_MED), LUKKET('Prøvemateriale (1)', IKKE_MED), LUKKET('Tilleggsinformasjon (1)', IKKE_MED)] },
  9: { omrade: 'Cytologi', fagomrade: 'Patologi', dato: '20.09.2024',
       rekvirert: 'NORSK HELSENETT SF, Pasientens prøvesvar', utfort: 'NORSK HELSENETT SF',
       ekspandere: [{ tittel: 'Prøvesvar', blokker: CYTOLOGI_BLOKKER }, LUKKET('Detaljer om prøvesvar', IKKE_MED), LUKKET('Prøvemateriale (1)', IKKE_MED), LUKKET('Tilleggsinformasjon (0)', 'Ingen tilleggsinformasjon.')] },
};

