import { useState, useEffect, useMemo } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Button from '@helsenorge/designsystem-react/components/Button';
import Panel, { PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import Tag from '@helsenorge/designsystem-react/components/Tag';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import VisualCheckboxCloud from '@helsenorge/designsystem-react/components/VisualCheckboxCloud';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import ArrowUpRight from '@helsenorge/designsystem-react/components/Icons/ArrowUpRight';
import Publication from '@helsenorge/designsystem-react/components/Icons/Publication';
import PeopleTalking from '@helsenorge/designsystem-react/components/Icons/PeopleTalking';
import TrashCan from '@helsenorge/designsystem-react/components/Icons/TrashCan';
import TravelRoute from '@helsenorge/designsystem-react/components/Icons/TravelRoute';
import HealthClinic from '@helsenorge/designsystem-react/components/Icons/HealthClinic';
import EmergencyCall from '@helsenorge/designsystem-react/components/Icons/EmergencyCall';
import StarStroke from '@helsenorge/designsystem-react/components/Icons/StarStroke';
import StarFill from '@helsenorge/designsystem-react/components/Icons/StarFill';
import './style.css';

import {
  Q1_OPTIONS, Q2_OPTIONS,
  computeResults,
  markVeiviserCompleted, clearVeiviserCompleted,
  getAnswers, persistAnswers, clearAnswers,
  type Resource,
} from './data';

type View = 'front' | 'quiz1' | 'quiz2' | 'results' | 'avslutt';

export interface PsykiskHelseProps {
  /** Called when the user clicks the "Forside" breadcrumb — navigates back
   *  to the Forside hub. When omitted (e.g. running on this prototype's own
   *  dedicated single-prototype domain, with no Forside to go back to), the
   *  breadcrumb keeps its previous no-op behaviour on the results view. */
  onNavigateHome?: () => void;
  /** Called when "Veiviser til psykisk helsehjelp" (first item under "Ta
   *  kontakt" on the front page) is clicked — opens the mock Helsenorge
   *  article page. */
  onOpenArtikkel?: () => void;
  /** Called when "Finn kommunale tjenester" (first item under the results
   *  page's footer LinkList) is clicked — opens the Kommunale tjenester
   *  (Oslo) page. */
  onOpenKommunaleTjenester?: () => void;
}

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="ph-progress">
      <div className={`ph-progress__dot ${step > 1 ? 'ph-progress__dot--done' : 'ph-progress__dot--active'}`} />
      <div className={`ph-progress__line ${step > 1 ? 'ph-progress__line--done' : ''}`} />
      <div className={`ph-progress__dot ${step === 2 ? 'ph-progress__dot--active' : step > 2 ? 'ph-progress__dot--done' : ''}`} />
      <div className={`ph-progress__line ${step > 2 ? 'ph-progress__line--done' : ''}`} />
      <div className={`ph-progress__dot ${step === 3 ? 'ph-progress__dot--active' : ''}`} />
    </div>
  );
}

const TAG_LABELS: Record<string, string> = {
  'sove-bedre':          'SØVN',
  'angst':               'ANGST',
  'stress':              'STRESS',
  'nedstemthet':         'NEDSTEMTHET',
  'rus-og-avhengighet':  'AVHENGIGHET',
  'spilleavhengighet':   'SPILL',
  'ensomhet-relasjoner': 'RELASJONER',
  'generell-mestring':   'MESTRING',
  'fysisk-aktivitet':    'FYSISK AKTIVITET',
  'graviditet-barsel':   'GRAVIDITET/BARSEL',
  'konsentrasjon':       'KONSENTRASJON',
};

function CategoryTags({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {tags.map(tag => (
        <Tag key={tag} variant="normal">
          {TAG_LABELS[tag] ?? tag.toUpperCase()}
        </Tag>
      ))}
    </div>
  );
}

function openResource(url: string) {
  window.open(
    url,
    '_blank',
    'width=390,height=844,menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes,resizable=yes'
  );
}

// Real verktøy icons will come from third-party providers — all manner of
// colors and shapes, not just a uniform outlined glyph. Standing in for
// that with a deterministic (per resource.id, so it doesn't reshuffle on
// every re-render) colored shape, to give an impression of that variety
// against .ph-tool-card__icon-frame's fixed grey-bordered box, which stays
// visible regardless of what the icon itself looks like.
const PLACEHOLDER_ICON_COLORS = ['#E4572E', '#17BEBB', '#2E86AB', '#F4A259', '#76B041', '#7768AE', '#1B998B', '#D65DB1'];
type PlaceholderShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'hex';
const PLACEHOLDER_ICON_SHAPES: PlaceholderShape[] = ['circle', 'square', 'triangle', 'diamond', 'hex'];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function ToolPlaceholderIcon({ seed }: { seed: string }) {
  const h = hashSeed(seed);
  const background = PLACEHOLDER_ICON_COLORS[h % PLACEHOLDER_ICON_COLORS.length];
  const shape = PLACEHOLDER_ICON_SHAPES[Math.floor(h / PLACEHOLDER_ICON_COLORS.length) % PLACEHOLDER_ICON_SHAPES.length];
  return (
    <div className="ph-tool-card__icon-placeholder" style={{ background }} aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24">
        {shape === 'circle' && <circle cx="12" cy="12" r="9" fill="#fff" />}
        {shape === 'square' && <rect x="4" y="4" width="16" height="16" rx="3" fill="#fff" />}
        {shape === 'triangle' && <polygon points="12,3 21,20 3,20" fill="#fff" />}
        {shape === 'diamond' && <polygon points="12,2 22,12 12,22 2,12" fill="#fff" />}
        {shape === 'hex' && <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" fill="#fff" />}
      </svg>
    </div>
  );
}

// New expandable card design for Verktøy (Figma node 394:3898) — collapsed
// state shows the icon/title/favorite-star, short description and a filled
// CTA; expanding reveals the description again as a "Beskrivelse" section
// plus a secondary link. There's no separate long-form description or
// "Faglig ansvarlig" field in the data, so the expanded Beskrivelse reuses
// shortDescription and Faglig ansvarlig is omitted rather than inventing a
// value.
//
// Deliberately NOT using Panel.Title's own `icon` prop: that slot lives in
// a separate grid column with a negative margin, which forces every other
// piece of panel content onto a much deeper left indent to clear it. In
// the actual Figma design the icon+title+star sit in their own row, and
// everything below (description, button, expand toggle) shares the same
// left edge as the icon, not the title — so the header row is built by
// hand here, as ordinary content inside Panel.A alongside the rest.
function ToolCard({ resource }: { resource: Resource }) {
  const [favorited, setFavorited] = useState(false);

  return (
    <Panel color="white" className="ph-tool-card">
      <Panel.A>
        <div className="ph-tool-card__header">
          <div className="ph-tool-card__icon-frame">
            <ToolPlaceholderIcon seed={resource.id} />
          </div>
          <div className="ph-tool-card__heading">
            <Title htmlMarkup="h3" appearance="title3" className="ph-tool-card__title">
              {resource.title}
            </Title>
            <button
              type="button"
              className="ph-tool-card__favorite"
              aria-pressed={favorited}
              aria-label={favorited ? 'Fjern fra favoritter' : 'Legg til i favoritter'}
              onClick={() => setFavorited(f => !f)}
            >
              <Icon svgIcon={favorited ? StarFill : StarStroke} size={32} color="#126F87" />
            </button>
          </div>
        </div>
        <p className="ph-resource-card__desc">{resource.shortDescription}</p>
        <div style={{ marginTop: '1rem' }}>
          {resource.isApp ? (
            <Button variant="fill" onClick={() => openResource(resource.appStoreUrl ?? resource.url)}>
              {resource.ctaLabel ?? 'Last ned app'}
              <Icon svgIcon={ArrowUpRight} />
            </Button>
          ) : (
            <Button variant="fill" arrow="icon" onClick={() => openResource(resource.url)}>
              {resource.ctaLabel ?? 'Gå til verktøy'}
            </Button>
          )}
        </div>
      </Panel.A>
      <Panel.ExpandedContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <p className="ph-tool-card__section-title">Beskrivelse</p>
            <p className="ph-tool-card__section-body">{resource.shortDescription}</p>
          </div>
          <Button variant="borderless" arrow="icon" onClick={() => openResource(resource.url)}>
            Vis mer om verktøyet
          </Button>
        </div>
      </Panel.ExpandedContent>
    </Panel>
  );
}

function ResourceCard({
  resource,
}: {
  resource: Resource;
}) {
  if (resource.type === 'verktøy') {
    return <ToolCard resource={resource} />;
  }

  return (
    <Panel variant={PanelVariant.outline}>
      <Panel.Title
        title={resource.title}
        titleMarkup="h3"
        icon={<Icon svgIcon={resource.type === 'artikkel' ? Publication : PeopleTalking} size={48} />}
      />
      <Panel.A>
        <div style={{ marginTop: '0rem', marginBottom: '0.5rem' }}>
          <CategoryTags tags={resource.tags} />
        </div>
        <p className="ph-resource-card__desc">{resource.shortDescription}</p>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="outline" arrow="icon" onClick={() => openResource(resource.url)}>
            {resource.ctaLabel ?? (resource.type === 'artikkel' ? 'Gå til artikkel' : 'Gå til tjeneste')}
          </Button>
        </div>
      </Panel.A>
    </Panel>
  );
}

const HASH_TO_VIEW: Record<string, View> = {
  '':           'front',
  '#':          'front',
  '#forside':   'front',
  '#quiz1':     'quiz1',
  '#quiz2':     'quiz2',
  '#resultater':'results',
  '#avslutt':   'avslutt',
};

const VIEW_TO_HASH: Record<View, string> = {
  front:   '#forside',
  quiz1:   '#quiz1',
  quiz2:   '#quiz2',
  results: '#resultater',
  avslutt: '#avslutt',
};

function viewFromHash(): View {
  return HASH_TO_VIEW[window.location.hash] ?? 'front';
}

export default function PsykiskHelse({ onNavigateHome, onOpenArtikkel, onOpenKommunaleTjenester }: PsykiskHelseProps = {}) {
  const [view, setView]           = useState<View>(() => viewFromHash());
  const [q1, setQ1]               = useState<Set<string>>(() => getAnswers().q1);
  const [q2, setQ2]               = useState<Set<string>>(() => getAnswers().q2);

  // Sync view → hash
  useEffect(() => {
    const hash = VIEW_TO_HASH[view];
    if (window.location.hash !== hash) window.location.hash = hash;
  }, [view]);

  // Persist answers so navigating away (e.g. to Forside) and back via a
  // snarvei doesn't lose the selections — without this, hasCompletedVeiviser()
  // would still correctly deep-link to results, but results would compute
  // from empty answers instead of what the user actually picked.
  useEffect(() => {
    persistAnswers(q1, q2);
  }, [q1, q2]);

  // Reaching results at least once marks the veiviser "completed" — Forside
  // reads this flag to decide whether to deep-link straight to results.
  useEffect(() => {
    if (view === 'results') markVeiviserCompleted();
  }, [view]);

  // Sync hash → view (browser back/forward)
  useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Scroll to top on every navigation. Reset both scrollers: in the desktop
  // phone mockup .phone-frame__screen scrolls, but at phone width (<=480px,
  // i.e. a real phone) the frame stops scrolling and the browser window does
  // — resetting only one of them leaves the page mid-scroll on a real phone.
  useEffect(() => {
    const el = document.querySelector('.phone-frame__screen');
    if (el) el.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [view]);

  const results = useMemo(() => computeResults(q1, q2), [q1, q2]);

  const toggleQ1 = (label: string) => {
    setQ1(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const toggleQ2 = (label: string, exclusive?: boolean) => {
    setQ2(prev => {
      const next = new Set(prev);
      if (exclusive) {
        return next.has(label) ? new Set<string>() : new Set([label]);
      }
      // deselect exclusive option when picking anything else
      const exclusiveLabel = Q2_OPTIONS.find(o => o.exclusive)?.label;
      if (exclusiveLabel) next.delete(exclusiveLabel);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  // Deactivates the Forside "Psykisk helse" card immediately — it only
  // reappears once markVeiviserCompleted() fires again on reaching a new
  // results view (see the view==='results' effect above), not just from
  // having completed the veiviser at some point in the past.
  const retake = () => {
    clearVeiviserCompleted();
    setView('quiz1');
  };

  const isAuthenticated = true;

  const breadcrumbLabel = view === 'results' ? 'Forside' : view === 'front' ? 'Forside' : 'Psykisk helse';
  const breadcrumbAction = () => {
    if (view === 'results' || view === 'front') { onNavigateHome?.(); return; }
    else if (view === 'quiz2') setView('quiz1');
    else if (view === 'avslutt') setView('results');
  };

  return (
    <div className="ph-shell">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className={`header${!isAuthenticated ? ' ph-header--unauth' : ''}`}>
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
        {isAuthenticated && (
          <button className="profile-bar" aria-label="Brukermeny">
            <Avatar className="ph-avatar" color="blueberry" size="xsmall">Tora Hansen</Avatar>
            <span className="profile-bar__name">Tora Hansen</span>
            <Icon svgIcon={ChevronDown} size={38} />
          </button>
        )}
      </header>

      {/* ── Breadcrumb (not on quiz pages) ─────────────────────── */}
      {view !== 'quiz1' && view !== 'quiz2' && (
        <>
          <nav className="breadcrumb" aria-label="Brødsmulesti">
            <button className="breadcrumb__back" onClick={breadcrumbAction}>
              <Icon svgIcon={ChevronLeft} size={38} />
              <span>{breadcrumbLabel}</span>
            </button>
          </nav>
          <hr className="page-divider" />
        </>
      )}

      {/* ── Frontpage ──────────────────────────────────────────── */}
      {view === 'front' && (
        <main className="ph-front">

          <div className="ph-front__content">
            <h1 className="ph-hero-title">Psykisk helse</h1>
          </div>

          <div className="ph-front__hero ph-front__hero--dark" aria-hidden="true" />

          <div className="ph-front__content">
            <p className="ph-preamble">
              Det er vanlig å ha det vanskelig i perioder. Det er en del av å være et menneske. På Helsenorge finner du informasjon og verktøy som kan være til hjelp. Ta en kjapp quiz for å se selvhjelpsressurser tilpasset din situasjon.
            </p>
            <Button variant="fill" arrow="icon" fluid onClick={() => setView('quiz1')}>
              Start quiz
            </Button>
          </div>

          <div className="ph-front__hero ph-front__hero--warm" aria-hidden="true" />

          <div className="ph-front__content">
            <h2 className="ph-front__section-title">Om quiz</h2>
            <p className="ph-preamble">
              Denne quiz består av noen enkle spørsmål og finner informasjon og verktøy som er tilpasset din situasjon, for eksempel hvordan du kan
            </p>
            <ul className="ph-benefit-list">
              <li>sove bedre</li>
              <li>håndtere stress</li>
              <li>få mer kontroll på følelsene</li>
            </ul>
          </div>

          <div className="ph-front__content ph-front__content--contact">
            <LinkList chevron>
              <LinkList.Link href="#" icon={<Icon svgIcon={TravelRoute} />} onClick={e => { e.preventDefault(); onOpenArtikkel?.(); }}>
                <ElementHeader>
                  <ElementHeader.Text firstText="Veiviser til psykisk helsehjelp" firstTextEmphasised />
                  <ElementHeader.Text firstText="En oversikt over psykisk helse tjenestetilbud i Norge" subText />
                </ElementHeader>
              </LinkList.Link>
              <LinkList.Link href="tel:116123" icon={<Icon svgIcon={EmergencyCall} />}>
                <ElementHeader>
                  <ElementHeader.Text firstText="Akutt hjelp" firstTextEmphasised />
                  <ElementHeader.Text firstText="Ring 116 123 ved akutt behov for psykisk helsehjelp. Åpent hele døgnet." subText />
                </ElementHeader>
              </LinkList.Link>
            </LinkList>
          </div>

          <footer className="ph-footer">
            <div className="ph-footer__top">
              <div className="ph-footer__row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <div>
                  <p className="ph-footer__link-title">23 32 70 00</p>
                  <p className="ph-footer__link-sub">Veiledning helsenorge.no</p>
                </div>
              </div>
              <div className="ph-footer__row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p className="ph-footer__link-title">Hjelp og kontakt</p>
              </div>
              <div className="ph-footer__row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <div className="ph-footer__lang">
                  <span className="ph-footer__link-title">English</span>
                  <span className="ph-footer__lang-sep" />
                  <span className="ph-footer__link-title">Sámi</span>
                </div>
              </div>
            </div>
            <div className="ph-footer__divider" />
            <div className="ph-footer__links">
              <a href="#" className="ph-footer__link">Om Helsenorge</a>
              <a href="#" className="ph-footer__link">Personvern og nettsikkerhet</a>
              <a href="#" className="ph-footer__link">Tilgjengelighetserklæring</a>
            </div>
            <div className="ph-footer__divider" />
            <a href="#" className="ph-footer__link">Last ned Helsenorge-appen</a>
            <div className="ph-footer__divider" />
            <p className="ph-footer__brand">Drives av Norsk helsenett SF</p>
          </footer>

        </main>
      )}

      {/* ── Quiz step 1 ────────────────────────────────────────── */}
      {view === 'quiz1' && (
        <main className="ph-page ph-page--quiz">
          <ProgressBar step={1} />
          <h1 className="ph-quiz-title">Hvordan går det?</h1>
          <p className="ph-quiz-subtitle">Gjelder noen av disse for deg?</p>
          <VisualCheckboxCloud className="ph-quiz-cloud--stacked">
            {Q1_OPTIONS.map(opt => (
              <VisualCheckboxCloud.Checkbox
                key={opt.label}
                inputId={`q1-${opt.label}`}
                checked={q1.has(opt.label)}
                onChange={() => toggleQ1(opt.label)}
              >
                {opt.label}
              </VisualCheckboxCloud.Checkbox>
            ))}
          </VisualCheckboxCloud>
          <div className="ph-quiz-nav">
            <Button variant="fill" arrow="icon" onClick={() => setView('quiz2')}>Neste</Button>
            <Button variant="borderless" onClick={() => setView('front')}>Avbryt</Button>
          </div>
        </main>
      )}

      {/* ── Quiz step 2 ────────────────────────────────────────── */}
      {view === 'quiz2' && (
        <main className="ph-page ph-page--quiz">
          <ProgressBar step={2} />
          <h1 className="ph-quiz-title">Hva ønsker du å fokusere på nå?</h1>
          <VisualCheckboxCloud className="ph-quiz-cloud--stacked">
            {Q2_OPTIONS.map(opt => (
              <VisualCheckboxCloud.Checkbox
                key={opt.label}
                inputId={`q2-${opt.label}`}
                checked={q2.has(opt.label)}
                onChange={() => toggleQ2(opt.label, opt.exclusive)}
              >
                {opt.label}
              </VisualCheckboxCloud.Checkbox>
            ))}
          </VisualCheckboxCloud>
          <div className="ph-quiz-nav">
            <Button variant="outline" onClick={() => setView('quiz1')}>
              <Icon svgIcon={ChevronLeft} size={38} />
              Forrige
            </Button>
            <Button variant="fill" arrow="icon" onClick={() => setView('results')}>Neste</Button>
            <Button variant="borderless" onClick={() => setView('front')}>Avbryt</Button>
          </div>
        </main>
      )}

      {/* ── Results ────────────────────────────────────────────── */}
      {view === 'results' && (
        <main className="ph-page">
          <div>
            <h1 style={{ font: '600 2rem/120% "Source Sans Pro", sans-serif', margin: '0 0 8px' }}>
              Psykisk helse
            </h1>
            <p className="ph-results-intro">
              {results.isEmpty
                ? 'Basert på svarene dine kan disse ressursene være nyttige for deg. Du bestemmer selv hva du vil bruke. Alle ressurser er kvalitetssikret av Helsenorge. Dine resultater lagres fram til du avslutter tjenesten eller tar veiviseren på nytt.'
                : 'Basert på svarene dine kan disse ressursene være nyttige for deg. Du bestemmer selv hva du vil bruke. Alle ressurser er kvalitetssikret av Helsenorge. Dine resultater lagres fram til du avslutter tjenesten eller tar veiviseren på nytt.'}
            </p>
          </div>

          {results.verktøy.length > 0 && (
            <section className="ph-tool-section">
              <h2 className="ph-section-heading">Verktøy</h2>
              <ul className="ph-resource-list">
                {results.verktøy.map(r => (
                  <li key={r.id} style={{ marginBottom: '8px' }}>
                    <ResourceCard resource={r} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.artikler.length > 0 && (
            <section>
              <h2 className="ph-section-heading">Artikler</h2>
              <ul className="ph-resource-list">
                {results.artikler.map(r => (
                  <li key={r.id} style={{ marginBottom: '8px' }}>
                    <ResourceCard resource={r} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.veiledningstjenester.length > 0 && (
            <section>
              <h2 className="ph-section-heading">Veiledningstjenester</h2>
              <ul className="ph-resource-list">
                {results.veiledningstjenester.map(r => (
                  <li key={r.id} style={{ marginBottom: '8px' }}>
                    <ResourceCard resource={r} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div>
            <Button variant="outline" onClick={retake}>
              <Icon svgIcon={ArrowLeft} size={38} />
              Ta quiz på nytt
            </Button>
          </div>

          <section>
            <LinkList chevron>
              <LinkList.Link href="#" icon={<Icon svgIcon={HealthClinic} />} onClick={e => { e.preventDefault(); onOpenKommunaleTjenester?.(); }}>
                <ElementHeader>
                  <ElementHeader.Text firstText="Finn kommunale tjenester" firstTextEmphasised />
                  <ElementHeader.Text firstText="Psykisk helse tjenestetilbud i din kommune" subText />
                </ElementHeader>
              </LinkList.Link>
              <LinkList.Link href="tel:116123" icon={<Icon svgIcon={EmergencyCall} />}>
                <ElementHeader>
                  <ElementHeader.Text firstText="Akutt hjelp" firstTextEmphasised />
                  <ElementHeader.Text firstText="Ring 116 123 ved akutt behov for psykisk helsehjelp. Åpent hele døgnet." subText />
                </ElementHeader>
              </LinkList.Link>
            </LinkList>
          </section>

          <div>
            <Button variant="borderless" onClick={() => setView('avslutt')}>
              Avslutt tjenesten
              <Icon svgIcon={ChevronRight} size={38} />
            </Button>
          </div>
        </main>
      )}

      {/* ── Avslutt tjenesten ──────────────────────────────────── */}
      {view === 'avslutt' && (
        <main className="ph-page">
          <h1 style={{ font: '600 2rem/120% "Source Sans Pro", sans-serif', margin: '0 0 -1rem' }}>
            Avslutt tjenesten
          </h1>
          <p className="ph-results-intro">
            Når du avslutter tjenesten Psykisk helse, slettes dine resultater og alt nullstilles. Du kan når som helst starte veiviseren på nytt og ta tjenesten i bruk igjen.
          </p>
          <div style={{ marginTop: '-1rem' }}>
            <Button variant="outline" concept="destructive" onClick={() => { clearVeiviserCompleted(); clearAnswers(); setQ1(new Set()); setQ2(new Set()); onNavigateHome ? onNavigateHome() : setView('front'); }}>
              <Icon svgIcon={TrashCan} size={24} />
              Avslutt tjenesten
            </Button>
          </div>
        </main>
      )}
    </div>
  );
}
