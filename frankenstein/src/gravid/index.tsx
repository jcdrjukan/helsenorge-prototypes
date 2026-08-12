import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Pregnant from '@helsenorge/designsystem-react/components/Icons/Pregnant';
import './style.css';

export interface GravidProps {
  /** Called when the user clicks the "Forside" breadcrumb. */
  onNavigateHome?: () => void;
}

// Thin Frankenstein placeholder — just enough for Forside to have a real
// in-app destination to link/deep-link to. The full tracker (countdown ring,
// weekly content, sticky notes, growth chart) lives only in the separate
// static gravid/index.html prototype for now; porting it here is a
// distinct, larger follow-up task.
export default function Gravid({ onNavigateHome }: GravidProps = {}) {
  return (
    <div className="gr-shell">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="header">
        <div className="top-bar">
          <Logo size={80} />
          <nav className="top-nav">
            <button className="nav-icon-btn" aria-label="Meny">
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
          <Avatar className="gr-avatar" color="blueberry" size="xsmall">Tora Hansen</Avatar>
          <span className="profile-bar__name">Tora Hansen</span>
          <Icon svgIcon={ChevronDown} size={38} />
        </button>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={() => onNavigateHome?.()}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="page-divider" />

      <main className="gr-page">
        <Title htmlMarkup="h1" appearance="title1">Gravid</Title>
        <p className="gr-preamble">
          Følg svangerskapet uke for uke, se beregnet termin, og finn nyttig informasjon underveis.
        </p>

        <Panel variant={PanelVariant.outline} status={PanelStatus.none} color="neutral">
          <Panel.Title
            title="Uke 24 av 40"
            titleMarkup="h2"
            icon={<Icon svgIcon={Pregnant} size={48} />}
          />
          <Panel.A>
            <p className="gr-status-text">Beregnet termin: 12. desember</p>
          </Panel.A>
        </Panel>
      </main>
    </div>
  );
}
