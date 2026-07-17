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
// artwork from Figma file UAhljteF5I4yI9lwrpxta7, node 3398:995 ("Rx6 1").
function RxIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 38 38" aria-hidden="true">
      <path d="M23.9 5.6C25.4 7.1 26.8 8.7 28.3 10.3V10.5V29.3C28.3 29.5 28.1 29.7 27.9 29.8C21.2 29.8 14.6 29.8 7.9 29.8C7.7 29.8 7.5 29.6 7.5 29.3V5.6C7.5 5.4 7.7 5.2 7.9 5.1C13 5.1 18 5.1 23.1 5.1C23.5 5.1 23.6 5.3 23.8 5.6H23.9ZM27.3 28.6V11.1H23.1C23.1 11.1 23 11.1 22.9 11.1C22.8 11.1 22.6 10.9 22.6 10.7V6.3H8.7V28.7H27.2L27.3 28.6ZM23.7 7.1V10H26.5C26.5 10 26.4 9.9 26.3 9.8C25.5 8.9 24.7 8 23.8 7.2C22.9 6.4 23.8 7.2 23.7 7.1Z" fill="#000" />
      <path d="M19.7 8.7C21 9.9 21 11.9 19.7 13.1C18.5 14.2 17.4 15.5 16.2 16.6C13.2 19.3 9.3 15.4 11.8 12.4C13 11.3 14.1 9.9 15.4 8.8C16.7 7.7 18.4 7.6 19.6 8.8L19.7 8.7ZM18.7 9.8C18.1 9.3 17.3 9.3 16.6 9.8C15.9 10.3 15.8 10.7 15.4 11.1L17.6 13.3C18.3 12.4 19.5 11.8 19.1 10.5C18.7 9.2 18.8 9.9 18.6 9.8H18.7ZM16.1 13.9L14.4 12.2C13.9 12.8 12.8 13.4 12.8 14.3C12.7 15.7 14.3 16.6 15.4 15.7C15.8 15.3 16.3 14.9 16.7 14.4L16.3 13.9H16.1Z" fill="#000" />
      <path d="M11.9 25.1H24C24.7 25.1 24.8 26 24.1 26.2H11.7C11.1 26 11.1 25.2 11.7 25.1H11.9Z" fill="#000" />
      <path d="M24.5 20.2C24.5 20.2 24.3 20.4 24.1 20.4H11.9C11.2 20.4 11.2 19.4 11.9 19.3H24C24.5 19.3 24.7 19.8 24.4 20.2H24.5Z" fill="#000" />
      <path d="M11.9 22.2H24C24.7 22.2 24.8 23.1 24.1 23.3H11.8C11.1 23.2 11.2 22.2 11.8 22.2H11.9Z" fill="#000" />
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

          <Button variant="fill" arrow="icon" className="ll-forny-button" wrapperClassName="ll-forny-button">
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
                      <Panel key={p.medicationId} variant={PanelVariant.fill} status={PanelStatus.none} color="neutral" className="ll-resept-panel">
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
                          <h4 className="ll-detail-heading">E-resept</h4>
                          <p className="ll-detail-label">Legemiddel:</p>
                          <a className="ll-resept-link" href="#">{med.name} ↗</a>
                          <p className="ll-detail-label">Bruksområde:</p>
                          <p className="ll-detail-value">{info.indikasjon}</p>
                          <p className="ll-detail-label">Dosering:</p>
                          <p className="ll-detail-value">{info.dosering}</p>
                          <p className="ll-detail-label">Virkestoff:</p>
                          <p className="ll-detail-value">{med.virkestoff}</p>
                          <p className="ll-detail-label">ATC-kode:</p>
                          <p className="ll-detail-value">{p.atcKode}</p>
                          <p className="ll-detail-label">Pakningsstørrelse:</p>
                          <p className="ll-detail-value">{p.pakningsstorrelse}</p>
                          <p className="ll-detail-label">Antall:</p>
                          <p className="ll-detail-value">{p.antall}</p>
                          <p className="ll-detail-label">Rekvirert av:</p>
                          <p className="ll-detail-value">{p.rekvirertAv}</p>
                          <p className="ll-detail-label">Rekvirert dato:</p>
                          <p className="ll-detail-value">{p.rekvirertDato}</p>
                          <p className="ll-detail-label">Gyldig til:</p>
                          <p className="ll-detail-value">{p.gyldigTil}</p>
                          <p className="ll-detail-label">Reiterasjoner:</p>
                          <p className="ll-detail-value">
                            {p.reiterasjoner} (Det betyr at du kan hente ut forskrevet mengde {p.reiterasjoner + 1} ganger)
                          </p>
                          <p className="ll-detail-label">Antall utleveringer:</p>
                          <a className="ll-resept-link" href="#">Se {p.antallUtleveringer} utleveringer</a>
                          <p className="ll-detail-label">Refusjonshjemmel:</p>
                          <p className="ll-detail-value">{p.refusjonshjemmel}</p>
                          <p className="ll-detail-label">Reseptstatus:</p>
                          <p className="ll-detail-value">
                            {p.status === 'aktiv' ? 'Aktiv' : 'Utekspedert'}. {p.status === 'aktiv' ? 'Denne resepten kan fremdeles brukes' : 'Resepten er ferdig utlevert for denne perioden.'}
                          </p>
                          <p className="ll-detail-label">Resepten er hentet fra:</p>
                          <p className="ll-detail-value">Reseptformidleren</p>
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
