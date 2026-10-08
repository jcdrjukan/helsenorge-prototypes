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


// ─── Sperre/slette prototype state (browser only) ─────────────────
// Stands in for the real API: blocked results and the usage log live
// in localStorage. index.html?nullstill=1 resets everything.
const LS_SPERRET = 'provesvar-sperret';   // { [id]: 'dd.mm.åååå' }
const LS_LOGG = 'provesvar-logg';         // [{ tid, tekst }]
const lesLS = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } };
const skrivLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const iDag = () => new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
const naa = () => new Date().toLocaleString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
function sperretDato(id) { return lesLS(LS_SPERRET, {})[id] || null; }
function settSperret(id, dato) {
  const s = lesLS(LS_SPERRET, {});
  if (dato) s[id] = dato; else delete s[id];
  skrivLS(LS_SPERRET, s);
}
const LS_SLETTET = 'provesvar-slettet';   // { [id]: 'dd.mm.åååå, tt:mm' }
function slettetTid(id) { return lesLS(LS_SLETTET, {})[id] || null; }
function settSlettet(id, tid) { const s = lesLS(LS_SLETTET, {}); s[id] = tid; skrivLS(LS_SLETTET, s); }
// The ordering institution: the part after the last comma in rekvirert.
const bestillendeVirksomhet = r => (r.rekvirert.split(',').slice(-1)[0] || r.rekvirert).trim();
function loggHendelse(tekst) { const l = lesLS(LS_LOGG, []); l.unshift({ tid: naa(), tekst }); skrivLS(LS_LOGG, l); }
function nullstillPersonvern() { try { [LS_SPERRET, LS_SLETTET, LS_LOGG].forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ } }
// Simulated API call: resolves after a short delay. Success is shown
// only after it resolves (spec: never fake success).
const simulertApi = (ms = 900) => new Promise(res => setTimeout(res, ms));
const resultatNavn = r => `${r.omrade} (${r.dato})`;

// Icons used by the flow (design-system Icons).
const IKON = {
  lock: '<path d="M24 8.475a7.344 7.344 0 017.344 7.344v3.69h3.005v17.444H13.69V19.51l2.964-.001v-3.69a7.344 7.344 0 017.103-7.34zm8.598 12.784H30v.011H18v-.01l-2.56-.001v13.944h17.158V21.259zM24 10.225a5.594 5.594 0 00-5.594 5.594l-.001 3.7h11.19v-3.7A5.594 5.594 0 0024 10.225z"/>',
  checkFill: '<path fill-rule="evenodd" d="m33.706 19.928-1.441-1.387-10.314 10.715-5.879-6.108-1.442 1.386 7.321 7.607 11.755-12.213ZM40.135 24c0 8.873-7.193 16.066-16.067 16.066-8.873 0-16.066-7.193-16.066-16.066S15.195 7.934 24.068 7.934c8.874 0 16.067 7.193 16.067 16.066Z"/>',
  check: '<path d="M22.504 31.198l-9.59-9.966 1.441-1.387 8.149 8.468 14.455-15.016 1.441 1.386z"/>',
  x: '<path d="M25.403 24l10.259-10.259-1.403-1.403L24 22.597l-10.259-10.26-1.403 1.403L22.597 24 12.338 34.26l1.403 1.403L24 25.403l10.259 10.259 1.403-1.403z"/>',
  errorSignFill: '<path fill-rule="evenodd" d="M24.898 21.447v7.228a.893.893 0 01-1.785 0v-7.228a.892.892 0 111.785 0zm.5 11.601a1.394 1.394 0 11-2.787-.001 1.394 1.394 0 012.787.001zm-18.822 6.71h34.847L24.111 8.242 6.576 39.758z"/>',
};

// Success message (NotificationPanel, success) in #statusmelding:
// stays until closed; focus moves to it so it's announced; closing
// returns focus to the page title.
function visStatusmelding(tekst) {
  const holder = document.getElementById('statusmelding');
  if (!holder) return;
  holder.innerHTML = `<div class="np np--success" role="status" tabindex="-1"><svg class="np__icon" viewBox="0 0 48 48" aria-hidden="true">${IKON.checkFill}</svg><div class="np__content"><p class="np__text">${tekst}</p></div><button type="button" class="np__close" aria-label="Lukk melding"><svg viewBox="0 0 48 48" aria-hidden="true">${IKON.x}</svg></button></div>`;
  const panel = holder.firstElementChild;
  panel.querySelector('.np__close').addEventListener('click', () => {
    holder.innerHTML = '';
    const h1 = document.getElementById('sidetittel');
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus(); }
  });
  panel.focus();
}
// Fill button busy state (Loader dots instead of the label).
function settOpptatt(btn, opptatt) {
  if (opptatt) { btn.dataset.label = btn.innerHTML; btn.innerHTML = '<span class="loader-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">Vent litt</span>'; btn.setAttribute('aria-busy', 'true'); }
  else { if (btn.dataset.label) btn.innerHTML = btn.dataset.label; btn.removeAttribute('aria-busy'); }
}
