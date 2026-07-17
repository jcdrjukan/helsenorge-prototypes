import { useState, useEffect } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Button from '@helsenorge/designsystem-react/components/Button';
import Badge from '@helsenorge/designsystem-react/components/Badge';
import Checkbox from '@helsenorge/designsystem-react/components/Checkbox';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import StatusDot, { StatusDotVariant } from '@helsenorge/designsystem-react/components/StatusDot';
import HighlightPanel from '@helsenorge/designsystem-react/components/HighlightPanel';
import Select from '@helsenorge/designsystem-react/components/Select';
import Tabs from '@helsenorge/designsystem-react/components/Tabs';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronUp from '@helsenorge/designsystem-react/components/Icons/ChevronUp';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Medicine from '@helsenorge/designsystem-react/components/Icons/Medicine';
import Printer from '@helsenorge/designsystem-react/components/Icons/Printer';
import HelpSign from '@helsenorge/designsystem-react/components/Icons/HelpSign';
import './style.css';

import {
  MEDICATIONS, PRESCRIPTIONS, PLL_FAST, PLL_BEHOV, PLL_AVSLUTTET, LEGEMIDDELREAKSJONER, PLL_SIST_OPPDATERT,
  pllInfoFor,
  type PllEntry, type PllAvsluttetEntry,
} from './data';

type View = 'landing' | 'resepter' | 'pll';

const HASH_TO_VIEW: Record<string, View> = {
  '': 'landing',
  '#': 'landing',
  '#legemiddelliste': 'landing',
  '#resepter': 'resepter',
  '#pll': 'pll',
};

function viewFromHash(): View {
  return HASH_TO_VIEW[window.location.hash] ?? 'landing';
}

function medById(id: string) {
  return MEDICATIONS.find(m => m.id === id)!;
}

// No Rx icon exists in @helsenorge/designsystem-react — this is the vector
// artwork from Figma file UAhljteF5I4yI9lwrpxta7, node 3398:985 ("Rx4 1").
function RxIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 38 38" aria-hidden="true">
      <path d="M14.1 16.2L20.7 22.9C21 22.9 24 19.6 24.5 19.2C25.3 18.5 26.4 17.9 27.3 18.9C28.2 19.9 27.6 20.6 27 21.3C25.9 22.7 24.1 23.9 23.1 25.3V25.6C23.2 25.6 27.4 29.8 27.4 29.8C28.3 31.2 26.7 32.8 25.3 32L20.7 27.6L16.2 31.9C14.8 32.8 13.1 31.2 14 29.7C14.9 28.2 14.5 29.2 14.7 28.9L18.2 25.5C18.2 25.5 18.3 25.3 18.3 25.2C18.3 24.7 12.4 19.4 11.7 18.5V21.6C11.7 21.9 11.3 22.6 11 22.8C9.9 23.7 8.5 22.9 8.4 21.6C8.7 17.1 8 12 8.4 7.6C8.8 3.2 8.9 6 9.9 5.8C12.4 6 15.2 5.6 17.7 5.8C21.4 6.2 23.6 10.5 21.5 13.7C19.4 16.9 19 16.1 17.8 16.1H14.1V16.2ZM11.7 13H17.1C17.1 13 17.7 12.9 17.8 12.8C19.3 12.3 19.5 10.2 18.2 9.4C16.9 8.6 17.5 9.1 17.4 9.1H11.6V13.1L11.7 13Z" fill="#000" />
    </svg>
  );
}

function PllRow({ entry, extra }: { entry: PllEntry | PllAvsluttetEntry; extra?: React.ReactNode }) {
  const med = medById(entry.medicationId);
  const multidose = 'multidose' in entry && entry.multidose;
  return (
    <div className="ll-pll-row">
      <div className="ll-pll-row__info">
        <p className="ll-pll-row__name">{med.name}</p>
        <p className="ll-pll-row__meta">Virkestoff: {med.virkestoff}</p>
        <p className="ll-pll-row__meta">Sist utlevert: {entry.sistUtlevert}</p>
        <p className="ll-pll-row__meta">{entry.indikasjon}</p>
      </div>
      <div className="ll-pll-row__dose">
        <p>{entry.dosering}</p>
        {multidose && <span className="ll-multidose-tag">Multidose</span>}
        {extra}
      </div>
    </div>
  );
}

export default function Legemiddelliste() {
  const [view, setView] = useState<View>(() => viewFromHash());
  const [visAktiveKun, setVisAktiveKun] = useState(false);
  const [visRefusjonKun, setVisRefusjonKun] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resepterTab, setResepterTab] = useState(0);
  const [avsluttetOpen, setAvsluttetOpen] = useState(false);
  const [reaksjonerOpen, setReaksjonerOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goTo = (v: View, hash: string) => {
    setView(v);
    window.location.hash = hash;
  };

  const breadcrumbLabel = view === 'landing' ? 'Forside' : 'Resepter';
  const breadcrumbAction = () => {
    if (view === 'landing') return;
    goTo('landing', '#legemiddelliste');
  };

  const resepter = PRESCRIPTIONS
    .filter(p => !visAktiveKun || p.status === 'aktiv')
    .filter(p => !visRefusjonKun || p.harRefusjon);

  return (
    <div className="ll-shell">

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
          <Avatar color="blueberry" size="xsmall">Tora Hansen</Avatar>
          <span className="profile-bar__name">Tora Hansen</span>
          <Icon svgIcon={ChevronDown} size={38} />
        </button>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={breadcrumbAction}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>{breadcrumbLabel}</span>
        </button>
      </nav>
      <hr className="page-divider" />

      {/* ── Landing ────────────────────────────────────────────── */}
      {view === 'landing' && (
        <main className="ll-page">
          <Title htmlMarkup="h1" appearance="title1">Resepter</Title>
          <p className="ll-preamble">
            Medisiner som er forskrevet for deg og hvordan du skal bruke dem.
          </p>

          <LinkList variant="outline" color="neutral" chevron>
            <LinkList.Link
              href="#resepter"
              onClick={(e) => { e.preventDefault(); goTo('resepter', '#resepter'); }}
              icon={<RxIcon />}
            >
              <ElementHeader>
                <ElementHeader.Text firstText="Hva kan jeg hente på apoteket?" firstTextEmphasised />
                <ElementHeader.Text firstText="Se dine resepter, sjekk status og forny." subText />
              </ElementHeader>
            </LinkList.Link>
            <LinkList.Link
              href="#pll"
              onClick={(e) => { e.preventDefault(); goTo('pll', '#pll'); }}
              icon={<Icon svgIcon={Medicine} size={38} />}
            >
              <ElementHeader>
                <ElementHeader.Text firstText="Hva skal jeg bruke, og hvordan?" firstTextEmphasised />
                <ElementHeader.Text firstText="Se legemiddellisten din, godkjent av lege." subText />
              </ElementHeader>
            </LinkList.Link>
          </LinkList>
        </main>
      )}

      {/* ── Resepter ───────────────────────────────────────────── */}
      {view === 'resepter' && (
        <main className="ll-page">
          <Title htmlMarkup="h1" appearance="title1">Resepter</Title>
          <p className="ll-preamble">
            Her finner du en samlet oversikt over dine resepter på legemidler og andre varer.
          </p>

          <Button variant="fill" arrow="icon">
            <Icon svgIcon={Medicine} size={24} /> Forny resept
          </Button>

          <button
            className="ll-help-disclosure"
            onClick={() => setHelpOpen(o => !o)}
            aria-expanded={helpOpen}
          >
            <Icon svgIcon={HelpSign} size={24} />
            <span>Trenger du hjelp til å hente medisiner?</span>
            <Icon svgIcon={helpOpen ? ChevronUp : ChevronDown} size={24} />
          </button>
          {helpOpen && (
            <p className="ll-help-disclosure__body">
              Du kan hente reseptbelagte legemidler på ethvert apotek i Norge. Ta med gyldig legitimasjon. Har du fullmakt, kan du hente medisiner på vegne av noen andre.
            </p>
          )}

          <Tabs activeTab={resepterTab}>
            <Tabs.Tab title="Resepter" onTabClick={() => setResepterTab(0)}>
              <div className="ll-tabpanel">
                <p className="ll-tab-intro">
                  Her vises aktive resepter og resepter med utlevering siste 12 måneder.
                </p>

                <div className="ll-filter-panel">
                  <p className="ll-filter-panel__title">Vis kun</p>
                  <Checkbox
                    label="Aktive e-resepter"
                    checked={visAktiveKun}
                    onChange={() => setVisAktiveKun(v => !v)}
                  />
                  <Checkbox
                    label="Resepter med refusjon"
                    checked={visRefusjonKun}
                    onChange={() => setVisRefusjonKun(v => !v)}
                  />
                </div>

                <Select label="Sorter etter" defaultValue="standard">
                  <option value="standard">Standard sortering</option>
                </Select>

                <div className="ll-panel-list">
                  {resepter.map(p => {
                    const med = medById(p.medicationId);
                    const info = pllInfoFor(p.medicationId);
                    const shortName = med.name.split(' ')[0];
                    return (
                      <Panel key={p.medicationId} variant={PanelVariant.outline} status={PanelStatus.none} color="neutral">
                        <Panel.A>
                          <StatusDot
                            text={p.status === 'aktiv' ? 'Aktiv' : 'Utekspedert'}
                            variant={p.status === 'aktiv' ? StatusDotVariant.active : StatusDotVariant.inactive}
                          />
                          <p className="ll-resept-status-sub">
                            {p.status === 'aktiv' ? 'Denne resepten kan fremdeles brukes' : 'Resepten er ferdig utlevert for denne perioden.'}
                          </p>
                          <h3 className="ll-panel-title">{med.name}</h3>
                          <p className="ll-panel-sub">Virkestoff: {med.virkestoff}</p>
                          <p className="ll-panel-sub">{p.frequency === 'fast' ? 'FAST' : 'VED BEHOV'}: {info.indikasjon}</p>
                          <div className="ll-panel-hr" />
                          <p className="ll-panel-meta">Sist utlevert: {p.sistHentet}</p>
                          <a className="ll-resept-link" href="#">{info.sistUtlevert} ↗</a>
                          <p className="ll-panel-meta">(tilsvarer {med.name})</p>
                          <p className="ll-panel-meta">{info.indikasjon}</p>
                          <p className="ll-panel-meta">{info.dosering}</p>
                          <p className="ll-panel-meta">Tilsvarer {shortName}</p>
                        </Panel.A>
                        <Panel.ExpandedContent>
                          <p className="ll-panel-meta">Forskrivende lege: {p.forskrivendeLege}</p>
                          <p className="ll-panel-meta">Reseptnummer: {p.reseptnummer}</p>
                          <p className="ll-panel-meta">Gyldig til: {p.gyldigTil}</p>
                          {p.kanFornyes ? (
                            <Button variant="outline" arrow="icon">Forny resept</Button>
                          ) : (
                            <p className="ll-panel-note">{p.fornyesNote}</p>
                          )}
                        </Panel.ExpandedContent>
                      </Panel>
                    );
                  })}
                </div>

                <Button variant="outline">
                  <Icon svgIcon={Printer} size={24} /> Vis utskriftsvennlig side
                </Button>

                <div className="ll-privacy-section">
                  <h2 className="ll-privacy-section__title">Personvern for Resepter</h2>
                  <LinkList variant="line" color="neutral">
                    <LinkList.Link href="#">Logg over bruk for Reseptformidleren</LinkList.Link>
                    <LinkList.Link href="#">Personverninnstillinger for Reseptformidleren</LinkList.Link>
                    <LinkList.Link href="#">Logg over bruk for resepter i Kjernejournal</LinkList.Link>
                    <LinkList.Link href="#">Personverninnstilling for resepter i Kjernejournal</LinkList.Link>
                  </LinkList>
                </div>
              </div>
            </Tabs.Tab>

            <Tabs.Tab title="Resepthistorikk" onTabClick={() => setResepterTab(1)}>
              <div className="ll-tabpanel">
                <p className="ll-tab-intro">Ingen eldre resepthistorikk å vise i denne prototypen.</p>
              </div>
            </Tabs.Tab>
          </Tabs>
        </main>
      )}

      {/* ── PLL ────────────────────────────────────────────────── */}
      {view === 'pll' && (
        <main className="ll-page">
          <Title htmlMarkup="h1" appearance="title1">Legemiddelliste</Title>
          <p className="ll-updated">{PLL_SIST_OPPDATERT}</p>

          <div className="ll-pll-card">
            <h2 className="ll-pll-card__title">Din legemiddelliste</h2>
            <p className="ll-pll-card__intro">Her finner du en oversikt over legemidlene du skal bruke.</p>

            <h3 className="ll-pll-section-label">Disse tar du fast</h3>
            <div className="ll-pll-list">
              {PLL_FAST.map(entry => <PllRow key={entry.medicationId} entry={entry} />)}
            </div>

            <h3 className="ll-pll-section-label">Disse tar du ved behov</h3>
            <div className="ll-pll-list">
              {PLL_BEHOV.map(entry => <PllRow key={entry.medicationId} entry={entry} />)}
            </div>
          </div>

          <div className="ll-expander-group">
            <button
              className={`ll-expander-header${avsluttetOpen ? ' ll-expander-header--open' : ''}`}
              onClick={() => setAvsluttetOpen(o => !o)}
              aria-expanded={avsluttetOpen}
            >
              <span>Avsluttet legemidler</span>
              <span className="ll-expander-header__right">
                <Badge color="blueberry">{PLL_AVSLUTTET.length}</Badge>
                <Icon svgIcon={avsluttetOpen ? ChevronUp : ChevronDown} size={38} />
              </span>
            </button>
            {avsluttetOpen && (
              <div className="ll-expander-body">
                <p className="ll-expander-body__intro">
                  Disse medisinene skal du ikke bruke lenger. Har du mer igjen av medisinen kan du levere det tilbake til apoteket.
                </p>
                {PLL_AVSLUTTET.map(entry => (
                  <PllRow key={entry.medicationId} entry={entry} extra={<p>Sluttdato: {entry.sluttdato}</p>} />
                ))}
              </div>
            )}
          </div>

          <div className="ll-expander-group">
            <button
              className={`ll-expander-header${reaksjonerOpen ? ' ll-expander-header--open' : ''}`}
              onClick={() => setReaksjonerOpen(o => !o)}
              aria-expanded={reaksjonerOpen}
            >
              <span>Legemiddelreaksjoner</span>
              <span className="ll-expander-header__right">
                <Badge color="blueberry">{LEGEMIDDELREAKSJONER.length}</Badge>
                <Icon svgIcon={reaksjonerOpen ? ChevronUp : ChevronDown} size={38} />
              </span>
            </button>
            {reaksjonerOpen && (
              <div className="ll-expander-body">
                <p className="ll-expander-body__intro">{LEGEMIDDELREAKSJONER.length} registrert legemiddelreaksjon</p>
                {LEGEMIDDELREAKSJONER.map(r => (
                  <div className="ll-pll-row" key={r.navn}>
                    <div className="ll-pll-row__info">
                      <p className="ll-pll-row__name">{r.navn}</p>
                      <p className="ll-pll-row__meta">{r.reaksjon}</p>
                      <p className="ll-pll-row__meta">Dato oppdatert: {r.datoOppdatert}</p>
                      <p className="ll-pll-row__meta">Kilde: {r.kilde}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <HighlightPanel color="blueberry" className="ll-message-panel">
            <p className="ll-message-panel__text">
              Er det et legemiddel på listen som du har sluttet å ta, eller tar du et legemiddel som ikke står på listen? Send en melding til din fastlege om det.
            </p>
            <Button variant="outline">Send melding til fastlegen</Button>
          </HighlightPanel>
        </main>
      )}
    </div>
  );
}
