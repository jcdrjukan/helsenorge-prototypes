import { useState, useEffect } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Button from '@helsenorge/designsystem-react/components/Button';
import Badge from '@helsenorge/designsystem-react/components/Badge';
import Toggle from '@helsenorge/designsystem-react/components/Toggle';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import StatusDot, { StatusDotVariant } from '@helsenorge/designsystem-react/components/StatusDot';
import HighlightPanel from '@helsenorge/designsystem-react/components/HighlightPanel';
import HelpExpanderStandalone from '@helsenorge/designsystem-react/components/HelpExpanderStandalone';
import Select from '@helsenorge/designsystem-react/components/Select';
import Tabs from '@helsenorge/designsystem-react/components/Tabs';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import Tag from '@helsenorge/designsystem-react/components/Tag';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Medicine from '@helsenorge/designsystem-react/components/Icons/Medicine';
import Printer from '@helsenorge/designsystem-react/components/Icons/Printer';
import Settings from '@helsenorge/designsystem-react/components/Icons/Settings';
import PaperPlane from '@helsenorge/designsystem-react/components/Icons/PaperPlane';
import './style.css';

import {
  MEDICATIONS, PRESCRIPTIONS, PLL_FAST, PLL_BEHOV, PLL_AVSLUTTET, PLL_SIST_OPPDATERT,
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
        {multidose && <Tag variant="normal">Multidose</Tag>}
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
          <Title htmlMarkup="h1" appearance="title1">Legemidler</Title>
          <p className="ll-preamble">
            Medisiner som er forskrevet for deg og hvordan du skal bruke dem.
          </p>

          <LinkList variant="fill" color="neutral" chevron>
            <LinkList.Link
              href="#resepter"
              onClick={(e) => { e.preventDefault(); goTo('resepter', '#resepter'); }}
            >
              <ElementHeader>
                <ElementHeader.Text firstText="Hva kan jeg hente på apoteket?" firstTextEmphasised />
                <ElementHeader.Text firstText="Se dine resepter, sjekk status og forny." subText />
              </ElementHeader>
            </LinkList.Link>
            <LinkList.Link
              href="#pll"
              onClick={(e) => { e.preventDefault(); goTo('pll', '#pll'); }}
            >
              <ElementHeader>
                <ElementHeader.Text firstText="Hva skal jeg bruke, og hvordan?" firstTextEmphasised />
                <ElementHeader.Text firstText="Se legemiddellisten din, godkjent av lege." subText />
              </ElementHeader>
            </LinkList.Link>
          </LinkList>

          <div className="ll-privacy-section">
            <Title htmlMarkup="h2" appearance="title2" className="ll-privacy-section__title">Personvern for Resepter</Title>
            <LinkList variant="line" color="white" size="small">
              <LinkList.Link href="#">Logg over bruk for Reseptformidleren</LinkList.Link>
              <LinkList.Link href="#">Personverninnstillinger for Reseptformidleren</LinkList.Link>
              <LinkList.Link href="#">Logg over bruk for resepter i Kjernejournal</LinkList.Link>
              <LinkList.Link href="#">Personverninnstilling for resepter i Kjernejournal</LinkList.Link>
            </LinkList>
          </div>
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

          <HelpExpanderStandalone
            className="ll-help-expander-mobile"
            triggerText="Trenger du hjelp til å hente medisiner?"
            expanded={helpOpen}
            onExpand={setHelpOpen}
          >
            <p>Du kan gi andre fullmakt til å hente medisiner og andre reseptbelagte varer for deg på apotek og hos bandasjist.</p>
            <Button variant="outline">
              <Icon svgIcon={Settings} size={24} /> Gi fullmakt
            </Button>
          </HelpExpanderStandalone>

          <Tabs activeTab={resepterTab}>
            <Tabs.Tab title="Resepter" onTabClick={() => setResepterTab(0)}>
              <div className="ll-tabpanel">
                <p className="ll-tab-intro">
                  Her vises aktive resepter og resepter med utlevering siste 12 måneder.
                </p>

                <div className="ll-filter-panel">
                  <Toggle
                    label={[{ text: 'Vis kun aktive resepter', type: 'subdued' }]}
                    checked={visAktiveKun}
                    onChange={() => setVisAktiveKun(v => !v)}
                  />
                  <Toggle
                    label={[{ text: 'Vis kun resepter med refusjon', type: 'subdued' }]}
                    checked={visRefusjonKun}
                    onChange={() => setVisRefusjonKun(v => !v)}
                  />
                </div>

                <Select label="Sortering:" defaultValue="standard">
                  <option value="standard">Standard</option>
                  <option value="navn">Navn</option>
                  <option value="rekvirert-dato">Rekvirert dato</option>
                  <option value="gyldig-til">Gyldig til</option>
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

                <Button variant="outline" wrapperClassName="ll-print-button">
                  <Icon svgIcon={Printer} size={24} /> Vis utskriftsvennlig side
                </Button>

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

          <ExpanderList variant="outline">
            <ExpanderList.Expander
              title={
                <span className="ll-expander-title">
                  Avsluttet legemidler <Badge color="blueberry">{PLL_AVSLUTTET.length}</Badge>
                </span>
              }
            >
              <div className="ll-expander-body">
                <p className="ll-expander-body__intro">
                  Disse medisinene skal du ikke bruke lenger. Har du mer igjen av medisinen kan du levere det tilbake til apoteket.
                </p>
                {PLL_AVSLUTTET.map(entry => (
                  <PllRow key={entry.medicationId} entry={entry} extra={<p>Sluttdato: {entry.sluttdato}</p>} />
                ))}
              </div>
            </ExpanderList.Expander>
          </ExpanderList>

          <HighlightPanel color="blueberry" className="ll-message-panel">
            <p className="ll-message-panel__text">
              Er det et legemiddel på listen som du har sluttet å ta, eller tar du et legemiddel som ikke står på listen? Send en melding til din fastlege om det.
            </p>
            <Button variant="outline">
              <Icon svgIcon={PaperPlane} size={24} /> Send melding til fastlegen
            </Button>
          </HighlightPanel>
        </main>
      )}
    </div>
  );
}
