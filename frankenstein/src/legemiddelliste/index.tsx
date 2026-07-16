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
import HighlightPanel from '@helsenorge/designsystem-react/components/HighlightPanel';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronUp from '@helsenorge/designsystem-react/components/Icons/ChevronUp';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Medicine from '@helsenorge/designsystem-react/components/Icons/Medicine';
import './style.css';

import {
  MEDICATIONS, PRESCRIPTIONS, PLL_FAST, PLL_BEHOV, PLL_AVSLUTTET, LEGEMIDDELREAKSJONER, PLL_SIST_OPPDATERT,
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

// No Rx icon exists in @helsenorge/designsystem-react — a plain SVG rendering
// of the traditional prescription symbol (℞), matching the other 38px icons.
function RxIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="28"
        fontWeight="700"
        fill="#000"
      >
        ℞
      </text>
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

  const breadcrumbLabel = view === 'landing' ? 'Forside' : 'Legemiddelliste';
  const breadcrumbAction = () => {
    if (view === 'landing') return;
    goTo('landing', '#legemiddelliste');
  };

  const resepter = visAktiveKun ? PRESCRIPTIONS.filter(p => p.status === 'aktiv') : PRESCRIPTIONS;

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
          <Title htmlMarkup="h1" appearance="title1">Legemiddelliste</Title>
          <p className="ll-preamble">
            Resepter og legemiddellisten viser delvis overlappende informasjon, men svarer på ulike spørsmål. Velg det som passer det du lurer på.
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
            Her ser du hvilke legemidler du kan hente på apoteket, og om resepten kan fornyes.
          </p>

          <Checkbox
            label="Vis kun aktive resepter"
            checked={visAktiveKun}
            onChange={() => setVisAktiveKun(v => !v)}
          />

          <div className="ll-panel-list">
            {resepter.map(p => {
              const med = medById(p.medicationId);
              return (
                <Panel key={p.medicationId} variant={PanelVariant.outline} status={PanelStatus.none} color="neutral">
                  <Panel.A>
                    <Badge color={p.status === 'aktiv' ? 'blueberry' : 'neutral'}>
                      {p.status === 'aktiv' ? 'Aktiv resept' : 'Utekspedert'}
                    </Badge>
                    <h3 className="ll-panel-title">{med.name}</h3>
                    <p className="ll-panel-sub">Virkestoff: {med.virkestoff}</p>
                    <p className="ll-panel-meta">Sist hentet: {p.sistHentet}</p>
                    {p.kanFornyes ? (
                      <Button variant="outline" arrow="icon">Forny resept</Button>
                    ) : (
                      <p className="ll-panel-note">{p.fornyesNote}</p>
                    )}
                  </Panel.A>
                </Panel>
              );
            })}
          </div>
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
