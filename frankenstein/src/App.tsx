import { useState, useEffect } from 'react';
import ForsideDemo from './forside-demo';
import ArtikkelPsykiskHelse from './forside-demo/ArtikkelPsykiskHelse';
import SpesialistOversikt from './forside-demo/SpesialistOversikt';
import KommunaleTjenesterOslo from './forside-demo/KommunaleTjenesterOslo';
import PsykiskHelseDemo from './psykisk-helse-demo';
import type { ValgbarTjenesteId } from './forside-demo/data';
import { hasCompletedVeiviser } from './psykisk-helse-demo/data';
import { applyPrototypeMeta } from './prototypeMeta';
import './App.css';

// psykiskhelse-demo branch: a deliberately minimal App.tsx with five
// screens — standalone copies of Forside and Psykisk helse, plus three mock
// Helsenorge content pages: an article page (stands in for
// https://www.helsenorge.no/psykisk-helse/), a specialist-treatment
// overview (recreated from Figma node 333:3684), and a blank Oslo kommune
// tjenester page. Forside's "Veiviser til Psykisk helsehjelp" article link
// opens the article page; its first panel ("Selvhjelp") continues on into
// Psykisk helse, its second panel ("Kommunale tjenester") and third panel
// ("Spesialister") open the other two content pages. Psykisk helse is also
// reachable straight from Forside via "Se alle tjenester" →
// "Situasjonstjenester", and both paths deep-link to results if the
// veiviser's already been completed (same as the "Støtte til din
// situasjon" card once it appears), otherwise to the frontpage to start
// it. Psykisk helse's own "Ta kontakt" → "Kommunale tjenester" link opens
// the same Oslo kommune page. Gravid stays non-clickable everywhere
// (hasPrototype:false in forside-demo/data.ts), so goToTjeneste below only
// ever fires for 'psykisk-helse'.
//
// The Oslo kommune page's breadcrumb has two entry points (the article
// page and Psykisk helse's results view), so it uses the generic
// `cameFrom`/`goBack` mechanism to return wherever the user actually came
// from. Every other screen's breadcrumb — including Psykisk helse's own,
// which always says/goes to "Forside" — is fixed.
type Prototype =
  | 'forside-demo' | 'artikkel-psykisk-helse' | 'spesialister-oversikt'
  | 'kommunale-tjenester-oslo' | 'psykisk-helse-demo';

function getInitialPrototype(): Prototype {
  const hash = window.location.hash.slice(1);
  if (hash === 'psykisk-helse-demo') return 'psykisk-helse-demo';
  if (hash === 'artikkel-psykisk-helse') return 'artikkel-psykisk-helse';
  if (hash === 'spesialister-oversikt') return 'spesialister-oversikt';
  if (hash === 'kommunale-tjenester-oslo') return 'kommunale-tjenester-oslo';
  return 'forside-demo';
}

function App() {
  const [prototype, setPrototype] = useState<Prototype>(getInitialPrototype);
  const [cameFrom, setCameFrom] = useState<Prototype>('forside-demo');

  useEffect(() => {
    applyPrototypeMeta(prototype);
  }, [prototype]);

  // hashOverride lets goToTjeneste below deep-link into Psykisk helse's own
  // internal view-hash (e.g. "resultater") instead of the prototype-level
  // hash — same two-layer hash trick the original connected prototypes
  // used. Note this only works for in-app navigation, not surviving a raw
  // page refresh.
  const navigateTo = (target: Prototype, hashOverride?: string) => {
    setCameFrom(prototype);
    setPrototype(target);
    window.location.hash = hashOverride ?? target;
  };

  // Deep-links straight to results when the veiviser's already been
  // completed.
  const goToTjeneste = (id: ValgbarTjenesteId) => {
    if (id === 'psykisk-helse') {
      navigateTo('psykisk-helse-demo', hasCompletedVeiviser() ? 'resultater' : 'psykisk-helse-demo');
    }
  };

  const goHome = () => navigateTo('forside-demo');
  const goToArtikkel = () => navigateTo('artikkel-psykisk-helse');
  const goToSpesialister = () => navigateTo('spesialister-oversikt');
  const goToKommunaleTjenester = () => navigateTo('kommunale-tjenester-oslo');
  const goBack = () => navigateTo(cameFrom);

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">
        <div className="phone-frame__screen">
          {prototype === 'forside-demo' && <ForsideDemo onGoToTjeneste={goToTjeneste} onOpenArtikkel={goToArtikkel} />}
          {prototype === 'artikkel-psykisk-helse' && (
            <ArtikkelPsykiskHelse
              onNavigateHome={goHome}
              onOpenPsykiskHelse={() => goToTjeneste('psykisk-helse')}
              onOpenSpesialister={goToSpesialister}
              onOpenKommunaleTjenester={goToKommunaleTjenester}
            />
          )}
          {prototype === 'spesialister-oversikt' && (
            <SpesialistOversikt onNavigateBack={goToArtikkel} />
          )}
          {prototype === 'kommunale-tjenester-oslo' && (
            <KommunaleTjenesterOslo onNavigateBack={goBack} />
          )}
          {prototype === 'psykisk-helse-demo' && (
            <PsykiskHelseDemo onNavigateHome={goHome} onOpenKommunaleTjenester={goToKommunaleTjenester} />
          )}
        </div>
        <div className="phone-frame__home" />
      </div>
    </div>
  );
}

export default App;
