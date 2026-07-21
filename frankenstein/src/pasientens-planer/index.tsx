import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import HighlightPanel from '@helsenorge/designsystem-react/components/HighlightPanel';
import StatusDot, { StatusDotVariant } from '@helsenorge/designsystem-react/components/StatusDot';
import Button from '@helsenorge/designsystem-react/components/Button';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import StarStroke from '@helsenorge/designsystem-react/components/Icons/StarStroke';
import Scale from '@helsenorge/designsystem-react/components/Icons/Scale';
import EmergencyCall from '@helsenorge/designsystem-react/components/Icons/EmergencyCall';
import Group from '@helsenorge/designsystem-react/components/Icons/Group';
import './style.css';

export default function PasientensPlaner() {
  return (
    <div className="pp-shell">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="header">
        <div className="top-bar">
          <Logo size={80} />
          <nav className="top-nav">
            <button className="nav-icon-btn" aria-label="Meny">
              <Icon svgIcon={Menu} size={38} />
              <span className="nav-icon-btn__label">Meny</span>
            </button>
            <button className="nav-icon-btn" aria-label="Søk">
              <Icon svgIcon={Search} size={38} />
              <span className="nav-icon-btn__label">Søk</span>
            </button>
            <button className="nav-icon-btn" aria-label="Logg ut">
              <Icon svgIcon={Logout} size={38} />
              <span className="nav-icon-btn__label">Logg ut</span>
            </button>
          </nav>
        </div>
        <button className="profile-bar" aria-label="Brukermeny">
          <Avatar color="blueberry" size="xsmall">Kari Nordmann</Avatar>
          <span className="profile-bar__name">Kari Nordmann</span>
          <Icon svgIcon={ChevronDown} size={38} />
        </button>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back">
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="page-divider" />

      <main className="pp-page">
        <Title htmlMarkup="h1" appearance="title1">Min egenbehandlingsplan</Title>

        <HighlightPanel color="blueberry" svgIcon={StarStroke} title="Mitt mål" className="pp-goal-panel">
          <p className="pp-goal-quote">
            «Jeg vil klare å gå til butikken selv og passe barnebarna på lørdager.»
          </p>
        </HighlightPanel>

        <Panel variant={PanelVariant.outline} status={PanelStatus.none} color="neutral" className="pp-today-panel">
          <Panel.A>
            <div className="pp-today-header">
              <h2 className="pp-today-title">I dag</h2>
              <span className="pp-today-date">onsdag 24. juni</span>
            </div>
            <p className="pp-today-text">Vei deg om morgenen og registrer hvordan pusten er.</p>
            <Button variant="outline" wrapperClassName="pp-today-button">
              <Icon svgIcon={Scale} size={24} /> Registrer dagens måling
            </Button>
          </Panel.A>
        </Panel>

        <h2 className="pp-section-title">Hvordan har jeg det i dag?</h2>

        <Panel variant={PanelVariant.outline} status={PanelStatus.none} color="neutral" className="pp-zone-panel pp-zone-outline">
          <Panel.A>
            <StatusDot text="Grønn — alt er som det skal" variant={StatusDotVariant.active} />
            <p className="pp-zone-text">
              Vekten er stabil og pusten er som vanlig. Følg planen din som før.
            </p>
          </Panel.A>
        </Panel>

        <Panel variant={PanelVariant.outline} status={PanelStatus.none} color="neutral" className="pp-zone-panel pp-zone-outline">
          <Panel.A>
            <StatusDot text="Gul — følg ekstra med" variant={StatusDotVariant.pending} />
            <p className="pp-zone-text">
              Du har gått opp mer enn 2 kg på tre dager, eller blir fortere tungpustet. Ta en ekstra vanndrivende tablett og vei deg i morgen tidlig.
            </p>
          </Panel.A>
        </Panel>

        <HighlightPanel color="cherry" className="pp-zone-panel pp-zone-panel--red">
          <StatusDot text="Rød — ta kontakt nå" variant={StatusDotVariant.inactive} />
          <Button variant="fill" concept="destructive" wrapperClassName="pp-call-button">
            <Icon svgIcon={EmergencyCall} size={24} /> Ring helsehjelp 116 117
          </Button>
        </HighlightPanel>

        <div className="pp-footer-note">
          <Icon svgIcon={Group} size={24} />
          <p>
            Datteren Lise ser også denne planen. Sist oppdatert av fastlege Dr. Berg, 12. juni.
          </p>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="pp-footer">
        <div className="pp-footer__top">
          <div className="pp-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <div>
              <p className="pp-footer__link-title">23 32 70 00</p>
              <p className="pp-footer__link-sub">Veiledning helsenorge.no</p>
            </div>
          </div>
          <div className="pp-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="pp-footer__link-title">Hjelp og kontakt</p>
          </div>
          <div className="pp-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div className="pp-footer__lang">
              <span className="pp-footer__link-title">English</span>
              <span className="pp-footer__lang-sep" />
              <span className="pp-footer__link-title">Sámi</span>
            </div>
          </div>
        </div>
        <div className="pp-footer__divider" />
        <div className="pp-footer__links">
          <a href="#" className="pp-footer__link">Om Helsenorge</a>
          <a href="#" className="pp-footer__link">Personvern og nettsikkerhet</a>
          <a href="#" className="pp-footer__link">Tilgjengelighetserklæring</a>
        </div>
        <div className="pp-footer__divider" />
        <a href="#" className="pp-footer__link">Last ned Helsenorge-appen</a>
        <div className="pp-footer__divider" />
        <p className="pp-footer__brand">Drives av Norsk helsenett SF</p>
      </footer>
    </div>
  );
}
