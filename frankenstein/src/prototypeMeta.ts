// Per-prototype browser tab title + favicon. Without this, the tab title
// and favicon (set once, statically, in index.html) never change as the
// user switches prototypes via the in-page selector or lands on a
// dedicated single-prototype domain — both cases resolve to the same
// static "Resepter" title / purple "LL" icon regardless of which
// prototype is actually showing.

export interface PrototypeMeta {
  title: string;
  /** 1-2 letter monogram shown on the generated favicon. */
  letters: string;
  /** Favicon background colour — reuses this design system's own palette. */
  color: string;
}

export const PROTOTYPE_META: Record<string, PrototypeMeta> = {
  prover:                   { title: 'Prøver og undersøkelser', letters: 'PU', color: '#08667C' },
  behandlingshjelpemidler:  { title: 'Behandlingshjelpemidler', letters: 'BH', color: '#099150' },
  'psykisk-helse':          { title: 'Psykisk helse',           letters: 'PH', color: '#916500' },
  'sykdom-kritisk-info':    { title: 'Sykdom og kritisk info',  letters: 'SK', color: '#A31F0E' },
  legemiddelliste:          { title: 'Resepter',                letters: 'LL', color: '#5B22A6' },
  'pasientens-planer':      { title: 'Pasientens planer',       letters: 'PP', color: '#084350' },
  forside:                  { title: 'Forside',                 letters: 'FS', color: '#2B2C2B' },
  gravid:                   { title: 'Gravid',                  letters: 'GR', color: '#C83521' },
  'forside-demo':           { title: 'Forside',                 letters: 'FS', color: '#2B2C2B' },
  'psykisk-helse-demo':     { title: 'Psykisk helse',           letters: 'PH', color: '#916500' },
  'artikkel-psykisk-helse': { title: 'Veiviser til Psykisk helsehjelp', letters: 'PH', color: '#916500' },
  'spesialister-oversikt':  { title: 'Behandlinger og undersøkelser med ventetider', letters: 'PH', color: '#5B22A6' },
  'kommunale-tjenester-oslo': { title: 'Psykisk helse tjenester i Oslo kommune', letters: 'OK', color: '#099150' },
};

// Matches public/favicon.svg's own visual style (rounded square + centred
// bold monogram) so switching prototypes looks like a colour/letter swap
// of the same icon, not a different icon language.
function faviconDataUri(letters: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><rect width="48" height="48" rx="8" fill="${color}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="20" fill="#ffffff">${letters}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function applyPrototypeMeta(key: string): void {
  const meta = PROTOTYPE_META[key];
  if (!meta) return;

  document.title = meta.title;

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/svg+xml';
  link.href = faviconDataUri(meta.letters, meta.color);
}
