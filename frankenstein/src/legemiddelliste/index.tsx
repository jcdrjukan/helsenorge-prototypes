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
// artwork from Figma file UAhljteF5I4yI9lwrpxta7, node 3396:919 ("Rx 1").
function RxIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 612 792" aria-hidden="true">
      <path d="M545.3 140.4V652.4H67.3V140.4H545.3ZM442.6 601.2C476.3 628.2 519.3 586 494.3 551.8L414.6 471.2V252.5L413 248L339.1 174.1L336.2 172.5H136C121.3 173.5 110 185 108.8 199.6V543.3C109 558.3 119.2 570.6 134 573H261.8C262.8 573.4 263.7 577.9 264.2 579.1C270.5 594.5 282.9 601.6 299.3 602.5C337.6 604.6 377.7 600.9 416.2 602.5C419.8 602 423.1 601.5 426.5 600.3C429.9 599.1 432.8 596.9 436.1 595.5C437.3 595.6 441.2 600.2 442.6 601.3V601.2Z" fill="#fff" />
      <path d="M442.6 601.2C441.2 600.1 437.3 595.5 436.1 595.4C432.8 596.9 429.9 599 426.5 600.2C423.1 601.4 419.8 601.9 416.2 602.4C377.7 600.8 337.6 604.5 299.3 602.4C283 601.5 270.5 594.4 264.2 579C257.9 563.6 262.7 573.3 261.8 573H134C119.2 570.5 108.9 558.2 108.8 543.2V199.6C110.1 185 121.3 173.5 136 172.4H336.2C336.2 172.5 339.1 174.2 339.1 174.2L413 248.1L414.5 252.6V471.3L494.3 551.9C519.4 586.1 476.3 628.3 442.6 601.3V601.2ZM327 186.9H135.5C135 186.9 131 188.8 130.3 189.2C126.5 191.5 124.2 195.1 123.7 199.6V545.3C123.8 552.3 129.5 557.1 135.9 558.5H262.2C265 545.6 274.2 535 286.9 531.2C288 530.9 292.5 529.6 293.2 529.6H369.6L370.1 528.6C363.1 521.2 355.1 515.7 351.4 505.9C340 475.7 369 447.2 398.7 459.6C399.1 459.8 399.8 459.1 399.8 458.9V259.8H346.1C340.9 259.8 332.9 254.1 330.3 249.7C327.7 245.3 326.9 242 326.9 241.1V186.9H327ZM348.3 245.3H388.3L388.8 244.3L341.6 197.8V239C341.6 241.8 345.8 244.8 348.3 245.2V245.3ZM434.2 513.9L434.8 512.8L399.2 476.7C378.6 459.9 351.3 486 369 506.9C375.5 514.7 384.8 522.1 392 529.4L418.6 529.6L434.2 514V513.9ZM445.7 523L434 535.2C450 545.7 455.6 566.7 446 583.6C464.7 609.1 500.6 585.4 481.6 558.9L445.6 523H445.7ZM349 544H294.3C293.3 544 287.4 546.7 286.2 547.4C272.5 555.8 272.9 576.4 286.8 584.5C300.7 592.6 292.8 587.5 294.3 587.5H349V544ZM418.2 544H363.5V587.5H418.2C422.3 587.5 429.8 581.8 432.1 578.5C441 565.9 433.5 546.3 418.2 544.1V544Z" fill="#000" />
      <path d="M327 186.9V241.1C327 241.9 329.7 248.6 330.4 249.7C333 254.1 341 259.8 346.2 259.8H399.9V458.9C399.9 459.1 399.2 459.8 398.8 459.6C369.1 447.2 340.1 475.7 351.5 505.9C362.9 536.1 363.2 521.3 370.2 528.6L369.7 529.6H293.3C292.6 529.6 288.1 530.9 287 531.2C274.3 535.1 265.1 545.7 262.3 558.6H136C129.5 557.1 123.9 552.4 123.8 545.4V199.6C124.3 195.1 126.5 191.5 130.4 189.2C134.3 186.9 135.1 186.9 135.6 186.9H327.1H327ZM185.7 270.3H202.4C208.2 270.3 216.3 264 219.3 259.3C228.5 244.9 218.9 225 201.9 223.4C190.7 222.3 177.8 224.2 166.4 223.4C161.9 224.2 160 227.3 159.6 231.6C157.8 251.8 160.9 274.9 159.8 295.4C160.2 301.7 166.5 305.1 171.7 301C176.9 296.9 174.7 296.7 174.7 295.5V281.3C178 285.1 204.5 309.4 204.7 311.5C204.9 313.6 204.6 312.6 204.2 313L188.4 328.4C187.7 329.9 186.1 330.7 185.3 332.1C181.1 338.8 188.8 346.1 195.3 342.1L215.5 322.3L236.4 342.3C242.9 345.9 250.1 338.7 246.1 332.1L227.2 313.1L226.7 311.6C231.5 305 239.3 299.6 244.5 293.3C249.7 287 248.9 286.3 245.7 282.5C242.5 278.7 236.7 280.5 232.9 283.7C229.1 286.9 216.7 300.9 215.5 300.7L185.7 270.3ZM165.6 369.3C157.2 371.4 158.5 383 167 383.7H356.8C365.5 382.7 365.9 370.7 357.3 369.2H165.6V369.3ZM361.3 425.4C366 420.8 362.8 412.9 356.2 412.6H166.9C157.5 413.7 157.4 426.5 166.9 427.1L358.9 426.7C359.7 426.3 360.7 426 361.3 425.4ZM325.4 458.7C324.6 457.8 321.7 456.5 320.3 456.5L164.4 457C157.1 460 159.1 470.6 166.9 471H320.3C326.3 470.6 329.3 463 325.4 458.7ZM161.9 502.2C156.7 507.4 161.9 515.8 169 515H318.4C329.3 515.1 330.6 500.8 319.4 500H168C166.3 500.2 163.1 501 161.9 502.2Z" fill="#fff" />
      <path d="M349 544V587.5H294.3C292.8 587.5 288.3 585.4 286.8 584.5C272.9 576.4 272.5 555.9 286.2 547.4C299.9 538.9 293.3 544 294.3 544H349Z" fill="#fff" />
      <path d="M418.2 544C433.5 546.2 441.1 565.8 432.1 578.4C423.1 591 422.3 587.4 418.2 587.4H363.5V543.9H418.2V544Z" fill="#fff" />
      <path d="M434.2 513.9L418.6 529.5L392 529.3C384.8 522 375.6 514.6 369 506.8C351.4 485.8 378.6 459.7 399.2 476.6L434.8 512.7L434.2 513.8V513.9Z" fill="#fff" />
      <path d="M445.7 523L481.7 558.9C500.7 585.4 464.7 609.1 446.1 583.6C455.6 566.7 450.1 545.7 434.1 535.2L445.8 523H445.7Z" fill="#fff" />
      <path d="M348.3 245.3C345.7 244.9 341.6 241.9 341.6 239.1V197.9L388.8 244.4L388.3 245.4H348.3V245.3Z" fill="#fff" />
      <path d="M185.7 270.3L215.5 300.7C216.7 300.9 230.4 285.8 232.9 283.7C236.7 280.5 241.6 277.6 245.7 282.5C249.8 287.4 247.1 290 244.5 293.3C239.4 299.6 231.5 304.9 226.7 311.6L227.2 313.1L246.1 332.1C250.2 338.6 242.9 345.9 236.4 342.3L215.5 322.3L195.3 342.1C188.8 346.1 181.2 338.8 185.3 332.1C189.4 325.4 187.7 329.9 188.4 328.4L204.2 313C204.6 312.6 204.8 312.1 204.7 311.5C204.5 309.4 178 285 174.7 281.3V295.5C174.7 296.8 172.8 300.2 171.7 301C166.5 305 160.3 301.6 159.8 295.4C161 274.9 157.8 251.8 159.6 231.6C161.4 211.4 161.9 224.1 166.4 223.4C177.8 224.2 190.7 222.3 201.9 223.4C218.9 225.1 228.6 244.9 219.3 259.3C210 273.7 208.2 270.3 202.4 270.3H185.7ZM174.7 255.8H199.4C199.6 255.8 202.3 255.2 202.7 255.1C209.4 252.8 210.3 243.3 204.4 239.4C198.5 235.5 201.2 237.8 201 237.8H174.8V255.8H174.7Z" fill="#000" />
      <path d="M165.6 369.3H357.3C365.9 370.7 365.5 382.6 356.8 383.7H167C158.5 383 157.3 371.4 165.6 369.3Z" fill="#000" />
      <path d="M361.3 425.4C360.7 426 359.7 426.4 358.9 426.7L166.9 427.1C157.4 426.5 157.6 413.7 166.9 412.6H356.2C362.8 412.9 366 420.8 361.3 425.4Z" fill="#000" />
      <path d="M161.9 502.2C163.1 501 166.3 500.2 168 500H319.4C330.6 500.8 329.3 515.2 318.4 515H169C161.9 515.8 156.8 507.3 161.9 502.2Z" fill="#000" />
      <path d="M325.4 458.7C329.4 463.1 326.3 470.7 320.3 471.1H166.9C159.1 470.7 157.1 460 164.4 457.1L320.3 456.6C321.7 456.6 324.5 457.8 325.4 458.8V458.7Z" fill="#000" />
      <path d="M174.7 255.8V237.8H200.9C201.1 237.8 203.9 239.1 204.3 239.4C210.2 243.2 209.3 252.8 202.6 255.1C195.9 257.4 199.5 255.8 199.3 255.8H174.6H174.7Z" fill="#fff" />
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
