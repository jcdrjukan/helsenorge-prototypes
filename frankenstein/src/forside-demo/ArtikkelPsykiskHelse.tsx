import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import PanelList from '@helsenorge/designsystem-react/components/PanelList';
import Panel, { PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import Toolbox from '@helsenorge/designsystem-react/components/Icons/Toolbox';
import HealthClinic from '@helsenorge/designsystem-react/components/Icons/HealthClinic';
import HealthcarePersonell from '@helsenorge/designsystem-react/components/Icons/HealthcarePersonell';
import type { SvgIcon } from '@helsenorge/designsystem-react/components/Icon';
import './style.css';

export interface ArtikkelPsykiskHelseProps {
  onNavigateHome: () => void;
  /** Called when the first panel ("Selvhjelp") is clicked — takes the user
   *  to Psykisk helse (deep-links to results if the veiviser's already
   *  been completed, same as every other Psykisk helse entry point). */
  onOpenPsykiskHelse: () => void;
  /** Called when the third panel ("Spesialister") is clicked — opens the
   *  "Behandlinger og undersøkelser med ventetider" overview. */
  onOpenSpesialister: () => void;
  /** Called when the second panel ("Kommunale tjenester") is clicked —
   *  opens the Oslo kommune tjenester page. */
  onOpenKommunaleTjenester: () => void;
}

function artikkelPaneler(onOpenPsykiskHelse: () => void, onOpenSpesialister: () => void, onOpenKommunaleTjenester: () => void) {
  return [
    { title: 'Prøv selvhjelp', text: 'Helsenorge tilbyr en rekke selvhjelpsverktøy og ressurser som du kan ta i bruk nå.', icon: Toolbox, onClick: onOpenPsykiskHelse },
    { title: 'Finn kommunale tjenester', text: 'Psykisk helse tjenestetilbud i din kommune.', icon: HealthClinic, onClick: onOpenKommunaleTjenester },
    { title: 'Velg behandling', text: 'Med henvisning fra din fastlege kan du få ulike spesialistbehandlinger.', icon: HealthcarePersonell, onClick: onOpenSpesialister },
  ] satisfies { title: string; text: string; icon: SvgIcon; onClick: () => void }[];
}

// Mock Helsenorge article page — stands in for a real content page at
// https://www.helsenorge.no/psykisk-helse/. Not a real Frankenstein
// component yet; reuses the shared header/breadcrumb classes from App.css
// so it matches every other page's chrome.
export default function ArtikkelPsykiskHelse({ onNavigateHome, onOpenPsykiskHelse, onOpenSpesialister, onOpenKommunaleTjenester }: ArtikkelPsykiskHelseProps) {
  const paneler = artikkelPaneler(onOpenPsykiskHelse, onOpenSpesialister, onOpenKommunaleTjenester);
  return (
    <div className="fs-shell">

      <div className="illustration-banner">
        Konseptskisse
      </div>

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
          <Avatar color="blueberry" size="xsmall" className="fs-avatar">Tora Hansen</Avatar>
          <span className="profile-bar__name">Tora Hansen</span>
          <Icon svgIcon={ChevronDown} size={38} />
        </button>
      </header>

      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={onNavigateHome}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="page-divider" />

      <main className="fs-page">
        <h1 className="fs-h1">Veiviser til psykisk helsehjelp</h1>
        <p className="fs-article__body">
          Her får du en oversikt over psykisk helse tjenestetilbud i Norge.
        </p>

        <PanelList variant={PanelVariant.outline}>
          {paneler.map(p => (
            <button key={p.title} type="button" className="artikkel-panel-btn" onClick={p.onClick}>
              <Panel variant={PanelVariant.outline}>
                <Panel.A>
                  <div className="artikkel-panel__row">
                    <span className="artikkel-panel__icon">
                      <Icon svgIcon={p.icon} size={32} />
                    </span>
                    <div className="artikkel-panel__text">
                      <h3 className="fs-article__title">{p.title}</h3>
                      <p className="fs-article__body">{p.text}</p>
                    </div>
                    <Icon svgIcon={ChevronRight} size={38} />
                  </div>
                </Panel.A>
              </Panel>
            </button>
          ))}
        </PanelList>
      </main>
    </div>
  );
}
