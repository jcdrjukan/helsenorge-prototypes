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
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Medicine from '@helsenorge/designsystem-react/components/Icons/Medicine';
import MedicineWarning from '@helsenorge/designsystem-react/components/Icons/MedicineWarning';
import './style.css';

import { MEDICATIONS, PRESCRIPTIONS, PLL_ENTRIES } from './data';

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

export default function Legemiddelliste() {
  const [view, setView] = useState<View>(() => viewFromHash());
  const [visAktiveKun, setVisAktiveKun] = useState(false);

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
              icon={<Icon svgIcon={Medicine} size={38} />}
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
                    <p className="ll-panel-sub">{med.form}</p>
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
          <Title htmlMarkup="h1" appearance="title1">Legemidler du skal bruke</Title>
          <p className="ll-preamble">
            Dette er den samlede legemiddellisten din, godkjent av fastlegen din. Er det feil eller mangler, ta kontakt med fastlegen.
          </p>

          <div className="ll-panel-list">
            {PLL_ENTRIES.map(entry => {
              const med = medById(entry.medicationId);
              return (
                <Panel key={entry.medicationId} variant={PanelVariant.outline} status={PanelStatus.none} color="neutral">
                  <Panel.A>
                    <Badge color={entry.fortsattIBruk ? 'blueberry' : 'cherry'}>
                      {entry.fortsattIBruk ? 'I bruk' : 'Ikke lenger i bruk'}
                    </Badge>
                    <h3 className="ll-panel-title">{med.name}</h3>
                    <p className="ll-panel-sub">{med.form}</p>
                    <p className="ll-panel-meta">{entry.dosering}</p>
                    {!entry.fortsattIBruk && (
                      <div className="ll-discrepancy">
                        <Icon svgIcon={MedicineWarning} size={24} />
                        <p>{entry.seponertNote} Du har fortsatt en aktiv resept på dette legemiddelet — se <a href="#resepter" onClick={(e) => { e.preventDefault(); goTo('resepter', '#resepter'); }}>Resepter</a>.</p>
                      </div>
                    )}
                  </Panel.A>
                </Panel>
              );
            })}
          </div>

          <div className="ll-message-cta">
            <p className="ll-message-cta__text">
              Bruker du et legemiddel som ikke står på listen, eller har du spørsmål om noe du bruker?
            </p>
            <Button variant="outline">Send melding til fastlegen</Button>
          </div>
        </main>
      )}
    </div>
  );
}
