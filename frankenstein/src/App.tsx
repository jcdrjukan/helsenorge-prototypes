import { useState } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Title from '@helsenorge/designsystem-react/components/Title';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Behandlingshjelpemidler from './behandlingshjelpemidler';
import PsykiskHelse from './psykisk-helse';
import SykdomKritiskInfo from './sykdom-kritisk-info';
import Legemiddelliste from './legemiddelliste';
import PasientensPlaner from './pasientens-planer';
import Forside from './forside';
import Gravid from './gravid';
import { hasCompletedVeiviser } from './psykisk-helse/data';
import { loadActivatedTjenester, type ValgbarTjenesteId } from './forside/data';
import './App.css';

type Prototype = 'prover' | 'behandlingshjelpemidler' | 'psykisk-helse' | 'sykdom-kritisk-info' | 'legemiddelliste' | 'pasientens-planer' | 'forside' | 'gravid';

// Detect dedicated per-prototype Netlify sites by hostname
const hostname = window.location.hostname;
const dedicatedPrototype: Prototype | null =
  hostname.includes('psykisk') || hostname.includes('veiviser') ||
  hostname.startsWith('joyful-blancmange') ? 'psykisk-helse' :
  hostname.includes('behandling') ? 'behandlingshjelpemidler' :
  hostname.includes('sykdom') || hostname.includes('kritisk') ||
  hostname.startsWith('melodic-cobbler') ? 'sykdom-kritisk-info' :
  hostname.includes('legemid') || hostname.includes('resept') ||
  hostname.startsWith('marvelous-torte') ? 'legemiddelliste' :
  hostname.includes('pasient') || hostname.includes('plan') ||
  hostname.startsWith('fluffy-cobbler') ? 'pasientens-planer' :
  hostname.includes('forside') ? 'forside' :
  null;

function getInitialPrototype(): Prototype {
  if (dedicatedPrototype) return dedicatedPrototype;
  const hash = window.location.hash.slice(1);
  if (hash === 'behandlingshjelpemidler') return 'behandlingshjelpemidler';
  if (hash === 'psykisk-helse') return 'psykisk-helse';
  if (hash === 'sykdom-kritisk-info') return 'sykdom-kritisk-info';
  if (hash === 'legemiddelliste') return 'legemiddelliste';
  if (hash === 'pasientens-planer') return 'pasientens-planer';
  if (hash === 'forside') return 'forside';
  if (hash === 'gravid') return 'gravid';
  return 'prover';
}

const directLink = !!dedicatedPrototype ||
  ['behandlingshjelpemidler', 'psykisk-helse', 'sykdom-kritisk-info', 'legemiddelliste', 'pasientens-planer', 'forside', 'gravid'].includes(window.location.hash.slice(1));

function App() {
  const [prototype, setPrototype] = useState<Prototype>(getInitialPrototype);
  // Gravid/Småbarnsliv have no activate/deactivate UI yet (Psykisk helse's
  // is derived from hasCompletedVeiviser() instead, see goToTjeneste below)
  // — this is just the persisted seed set until that's built.
  const [activatedTjenester] = useState<Set<ValgbarTjenesteId>>(loadActivatedTjenester);

  const switchPrototype = (p: Prototype) => {
    setPrototype(p);
    window.location.hash = p;
  };

  // Navigates to a valgbar tjeneste's own prototype — for Psykisk helse,
  // deep-links straight to its results view when the veiviser has already
  // been completed, by setting the raw hash to that prototype's OWN
  // internal view-hash before switching (PsykiskHelse reads whatever hash
  // is already present at mount time). Note this only works for in-app
  // navigation, not surviving a raw page refresh — a pre-existing
  // limitation of this app's two-layer hash scheme (see App.tsx history).
  const goToTjeneste = (id: ValgbarTjenesteId) => {
    if (id === 'psykisk-helse') {
      window.location.hash = hasCompletedVeiviser() ? 'resultater' : 'psykisk-helse';
      setPrototype('psykisk-helse');
    } else if (id === 'gravid') {
      switchPrototype('gravid');
    }
  };

  const goHome = () => switchPrototype('forside');

  return (
    <div className="phone-wrapper">
      {!directLink && (
        <div className="prototype-switcher">
          <span className="prototype-switcher__label">Prototype:</span>
          <button
            className={`prototype-switcher__btn${prototype === 'prover' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('prover')}
          >
            Prøver og undersøkelser
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'behandlingshjelpemidler' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('behandlingshjelpemidler')}
          >
            Behandlingshjelpemidler
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'psykisk-helse' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('psykisk-helse')}
          >
            Psykisk helse
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'sykdom-kritisk-info' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('sykdom-kritisk-info')}
          >
            Sykdom og kritisk info
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'legemiddelliste' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('legemiddelliste')}
          >
            Legemiddelliste
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'pasientens-planer' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('pasientens-planer')}
          >
            Pasientens planer
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'forside' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('forside')}
          >
            Forside
          </button>
          <button
            className={`prototype-switcher__btn${prototype === 'gravid' ? ' prototype-switcher__btn--active' : ''}`}
            onClick={() => switchPrototype('gravid')}
          >
            Gravid
          </button>
        </div>
      )}

      <div className="phone-frame">
        <div className="phone-frame__screen">
          {prototype === 'prover' && (
            <div className="mobile-shell">
              <header className="header">
                <div className="top-bar">
                  <Logo size={80} />
                  <nav className="top-nav">
                    <button className="nav-icon-btn" aria-label="Åpne meny">
                      <Icon svgIcon={Menu} size={38} />
                      <span className="nav-icon-btn__label">Meny</span>
                    </button>
                    <button className="nav-icon-btn" aria-label="Varsler">
                      <Icon svgIcon={Bell} size={38} />
                      <span className="nav-icon-btn__label">Varsler</span>
                    </button>
                    <button className="nav-icon-btn" aria-label="Logg ut">
                      <Icon svgIcon={Logout} size={38} />
                      <span className="nav-icon-btn__label">Logg ut</span>
                    </button>
                  </nav>
                </div>
                <button className="profile-bar" aria-label="Brukermeny">
                  <Avatar color="blueberry" size="xsmall">Tore Hansen</Avatar>
                  <span className="profile-bar__name">Tore Hansen</span>
                  <Icon svgIcon={ChevronDown} size={38} />
                </button>
              </header>
              <nav className="breadcrumb" aria-label="Brødsmulesti">
                <button className="breadcrumb__back">
                  <Icon svgIcon={ChevronLeft} size={38} />
                  <span>Forside</span>
                </button>
              </nav>
              <hr className="page-divider" />
              <main className="page-content">
                <Title htmlMarkup="h1" appearance="title1">Prøver og undersøkelser</Title>
                <p className="ingress">Hva vil du se?</p>
                <LinkList variant="fill" color="neutral" chevron>
                  <LinkList.Link href="#">
                    <ElementHeader>
                      <ElementHeader.Text firstText="Prøvesvar" firstTextEmphasised />
                      <ElementHeader.Text firstText="Kun tilgjengelig hvis du tar en prøve hos noen som er med i utprøvingen av Prøvesvar." subText />
                    </ElementHeader>
                  </LinkList.Link>
                  <LinkList.Link href="#">
                    <ElementHeader>
                      <ElementHeader.Text firstText="Analyser og undersøkelser fra sykehus" firstTextEmphasised />
                      <ElementHeader.Text firstText="Det er kun sykehus i Helse Vest som viser sine prøvesvar." subText />
                    </ElementHeader>
                  </LinkList.Link>
                  <LinkList.Link href="#">
                    <ElementHeader>
                      <ElementHeader.Text firstText="Fremtidige prøver" firstTextEmphasised />
                      <ElementHeader.Text firstText="Tjenesten er under utprøving" subText />
                    </ElementHeader>
                  </LinkList.Link>
                </LinkList>
              </main>
            </div>
          )}

          {prototype === 'behandlingshjelpemidler' && <Behandlingshjelpemidler />}
          {prototype === 'psykisk-helse' && <PsykiskHelse onNavigateHome={goHome} />}
          {prototype === 'sykdom-kritisk-info' && <SykdomKritiskInfo />}
          {prototype === 'legemiddelliste' && <Legemiddelliste />}
          {prototype === 'pasientens-planer' && <PasientensPlaner />}
          {prototype === 'forside' && (
            <Forside
              activatedTjenester={activatedTjenester}
              onGoToTjeneste={goToTjeneste}
            />
          )}
          {prototype === 'gravid' && <Gravid onNavigateHome={goHome} />}
        </div>
        <div className="phone-frame__home" />
      </div>
    </div>
  );
}

export default App;
