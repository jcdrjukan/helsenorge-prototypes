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
import Checkbox from '@helsenorge/designsystem-react/components/Checkbox';
import Duolist, { DuolistGroup } from '@helsenorge/designsystem-react/components/Duolist';
import AnchorLink from '@helsenorge/designsystem-react/components/AnchorLink';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import ArrowUpRight from '@helsenorge/designsystem-react/components/Icons/ArrowUpRight';
import ArrowRight from '@helsenorge/designsystem-react/components/Icons/ArrowRight';
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
  markVeiviserCompleted, clearVeiviserCompleted, hasCompletedVeiviser,
  getAnswers, persistAnswers, clearAnswers,
  serviceStatus,
  type Resource, type OpeningHours,
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

// Real tool images. Grubl and the self-help video thumbnail come from the
// Selvhjelpsverktøy design (Figma 402:7239); the other apps' icons are
// their App Store icons (fetched via Apple's public iTunes lookup API).
const APP_STORE_ICON_IDS = ['nettopp', 'opp', 'slutta-app', 'spillfri', 'tankevirus', 'ungspotlight'];

function toolImage(resource: Resource): { src: string; className: string } | null {
  if (resource.id === 'grubl') return { src: '/ph-tool-grubl.png', className: 'ph-tool-card__image ph-tool-card__image--grubl' };
  if (APP_STORE_ICON_IDS.includes(resource.id)) return { src: `/ph-tool-${resource.id}.png`, className: 'ph-tool-card__image ph-tool-card__image--app' };
  if (resource.id.startsWith('selvhjelpsvideo')) return { src: '/ph-tool-video.png', className: 'ph-tool-card__image ph-tool-card__image--video' };
  return null;
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

// Expandable tool card (Figma 394:3898, updated by 402:7239/402:7738) — collapsed
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
  const image = toolImage(resource);

  return (
    <Panel color="white" className="ph-tool-card">
      <Panel.A>
        <div className="ph-tool-card__header">
          {image ? (
            <div className={image.className} aria-hidden="true">
              <img src={image.src} alt="" />
            </div>
          ) : (
            <div className="ph-tool-card__icon-frame">
              <ToolPlaceholderIcon seed={resource.id} />
            </div>
          )}
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
            <Button variant="fill" onClick={() => openResource(resource.url)}>
              {resource.ctaLabel ?? 'Åpne verktøy'}
              <Icon svgIcon={ArrowUpRight} />
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
          <div style={{ alignSelf: 'flex-start' }}>
            <Button variant="borderless" onClick={() => openResource(resource.url)}>
              Vis mer om verktøyet
              <Icon svgIcon={ArrowRight} />
            </Button>
          </div>
        </div>
      </Panel.ExpandedContent>
    </Panel>
  );
}

// "Noen å snakke med" service card (Figma 402:7929/402:7979 Mental Helse,
// 402:7954/402:8145 Kirkens SOS). Same Panel shell as ToolCard, minus the
// favorite star. The open/closed line is computed live from the opening
// hours — the design frames show different example states for the same
// service, so it's a status, not fixed copy.
function formatHours(h: OpeningHours) {
  if (h === 'døgnåpen') return 'Døgnåpen';
  if (h === 'stengt') return 'Stengt';
  return h.map(([from, to], i) => <span key={i} className="ph-service-card__interval">{from}-{to}</span>);
}

function ServiceCard({ resource }: { resource: Resource }) {
  const service = resource.service!;
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const status = serviceStatus(service.hours, now);

  return (
    <Panel color="white" className="ph-tool-card ph-service-card">
      <Panel.A>
        <div className="ph-tool-card__header">
          <div className="ph-tool-card__image ph-service-card__image" aria-hidden="true">
            <img src={service.image} alt="" />
          </div>
          <div className="ph-tool-card__heading">
            <Title htmlMarkup="h3" appearance="title3" className="ph-tool-card__title">
              {resource.title}
            </Title>
          </div>
        </div>
        <p className="ph-service-card__status">
          <span className={status.open ? 'ph-service-card__status--open' : 'ph-service-card__status--closed'}>
            {status.open ? 'Åpen' : 'Stengt'}
          </span>
          {status.detail && <> - {status.detail}</>}
        </p>
        <p className="ph-resource-card__desc">{resource.shortDescription}</p>
        <div className="ph-service-card__buttons">
          <Button variant="fill" onClick={() => openResource(service.chatUrl)}>
            Åpne chat
            <Icon svgIcon={ArrowUpRight} />
          </Button>
          <Button variant="outline" onClick={() => { window.location.href = 'tel:' + service.phone.replace(/\s/g, ''); }}>
            Ring oss
            <Icon svgIcon={ArrowUpRight} />
          </Button>
        </div>
      </Panel.A>
      <Panel.ExpandedContent>
        <div className="ph-service-card__details">
          <div>
            <p className="ph-tool-card__section-title">Beskrivelse</p>
            <p className="ph-tool-card__section-body">{service.longDescription}</p>
          </div>
          <div>
            <p className="ph-tool-card__section-title">Bemanning</p>
            <p className="ph-tool-card__section-body">{service.bemanning}</p>
          </div>
          <div>
            <p className="ph-tool-card__section-title">Telefonnummer</p>
            <p className="ph-tool-card__section-body">{service.phone}</p>
          </div>
          <div className="ph-service-card__hours">
            <p className="ph-tool-card__section-title">Åpningstider</p>
            <Duolist variant="line" boldColumn="first">
              {service.hours.map(([day, h]) => (
                <DuolistGroup key={day} term={day} description={formatHours(h)} />
              ))}
            </Duolist>
          </div>
          <div>
            <AnchorLink href={service.website} target="_blank">Gå til nettside</AnchorLink>
          </div>
        </div>
      </Panel.ExpandedContent>
    </Panel>
  );
}

// Article card (Figma Psykisk helse 408:8108, "Artikkelvarianter"):
// card with a photo, title3 title, description, topic tags and a
// borderless "Les artikkel" with ArrowRight. The photos are only examples:
// the three from the Figma frame plus the two front-page photos, handed out
// by position in the list so no two articles on the page share one (until
// there are more than five).
const ARTICLE_IMAGES = [
  '/ph-art-samtale.png',
  '/ph-art-ettertanke.png',
  '/ph-art-tur.png',
  '/ph-hero-dark.jpg',
  '/ph-hero-warm.jpg',
];

// Section header visual (Figma Psykisk helse 419:19339, "Section"):
// 200px area, coloured band in the lower 100px, a blob and an illustration
// centred on top. The artwork comes from the Figma file (not in the DS).
function SectionVisual({ blob, illu, variant }: { blob: string; illu: string; variant: 'verktoy' | 'artikler' }) {
  return (
    <div className={`ph-sec__visual ph-sec__visual--${variant}`} aria-hidden="true">
      <div className="ph-sec__band" />
      <img className="ph-sec__blob" src={blob} alt="" />
      <img className="ph-sec__illu" src={illu} alt="" />
    </div>
  );
}

function ArticleCard({ resource, image }: { resource: Resource; image: string }) {
  return (
    <article className="ph-art-card">
      <div className="ph-art-card__image" aria-hidden="true">
        <img src={image} alt="" />
      </div>
      <div className="ph-art-card__body">
        <Title htmlMarkup="h3" appearance="title3" className="ph-art-card__title">
          {resource.title}
        </Title>
        <p className="ph-art-card__desc">{resource.shortDescription}</p>
        <CategoryTags tags={resource.tags} />
        <div>
          <Button variant="borderless" onClick={() => openResource(resource.url)}>
            {resource.ctaLabel ?? 'Les artikkel'}
            <Icon svgIcon={ArrowRight} />
          </Button>
        </div>
      </div>
    </article>
  );
}

function ResourceCard({
  resource,
  index = 0,
}: {
  resource: Resource;
  /** Position in its list — picks a distinct example photo for articles. */
  index?: number;
}) {
  if (resource.type === 'verktøy') {
    return <ToolCard resource={resource} />;
  }
  if (resource.service) {
    return <ServiceCard resource={resource} />;
  }

  if (resource.type === 'artikkel') {
    return <ArticleCard resource={resource} image={ARTICLE_IMAGES[index % ARTICLE_IMAGES.length]} />;
  }

  return (
    <Panel variant={PanelVariant.outline}>
      <Panel.Title
        title={resource.title}
        titleMarkup="h3"
        icon={<Icon svgIcon={PeopleTalking} size={48} />}
      />
      <Panel.A>
        <div style={{ marginTop: '0rem', marginBottom: '0.5rem' }}>
          <CategoryTags tags={resource.tags} />
        </div>
        <p className="ph-resource-card__desc">{resource.shortDescription}</p>
        <div style={{ marginTop: '1rem' }}>
          <Button variant="outline" arrow="icon" onClick={() => openResource(resource.url)}>
            {resource.ctaLabel ?? 'Gå til tjeneste'}
          </Button>
        </div>
      </Panel.A>
    </Panel>
  );
}

// "Veiviser til psykisk helsehjelp" link on the front page — hidden for now
// (2026-10-20, user request) but kept, as it will likely come back: set to
// true to show it again above "Akutt hjelp". The article page itself is still
// reachable from the Forside ("Veiviser til psykisk helsehjelp →").
const VIS_VEIVISER_LENKE = false;

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
  // Saved answers: what the results (and Forside) are computed from. Only
  // replaced when a quiz run is completed.
  const [q1, setQ1]               = useState<Set<string>>(() => getAnswers().q1);
  const [q2, setQ2]               = useState<Set<string>>(() => getAnswers().q2);
  // Draft answers for the quiz run in progress. Every (re)start begins
  // blank; aborting discards the draft, so earlier results are kept.
  const [d1, setD1]               = useState<Set<string>>(() => new Set());
  const [d2, setD2]               = useState<Set<string>>(() => new Set());

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
    setD1(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const toggleQ2 = (label: string, exclusive?: boolean) => {
    setD2(prev => {
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

  // Start (or restart) the quiz on a blank form. Restarting no longer
  // clears the "completed" flag: an aborted rerun keeps both the earlier
  // results and the Forside "Psykisk helse" card (2026-10-15).
  const startQuiz = () => {
    setD1(new Set());
    setD2(new Set());
    setView('quiz1');
  };
  const retake = startQuiz;
  // Completing the quiz: the draft becomes the saved answers (and reaching
  // results marks the veiviser completed, see the view==='results' effect).
  const fullfor = () => {
    setQ1(d1);
    setQ2(d2);
    setView('results');
  };
  // Aborting: drop the draft; previous results (if any) stay as they were.
  const avbryt = () => {
    setD1(new Set());
    setD2(new Set());
    setView(hasCompletedVeiviser() ? 'results' : 'front');
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
              Det er vanlig å ha det vanskelig i perioder. Det kan være en naturlig reaksjon på det som skjer i livet. På Helsenorge finner du informasjon og verktøy som kan være til hjelp. Svar på noen spørsmål og finn noe som passer til din situasjon.
            </p>
            <Button variant="fill" arrow="icon" fluid onClick={startQuiz}>
              Finn verktøy og informasjon som passer for deg
            </Button>
          </div>

          <div className="ph-front__hero ph-front__hero--warm" aria-hidden="true" />

          <div className="ph-front__content">
            <h2 className="ph-front__section-title">Om tjenesten Psykisk helse</h2>
            <p className="ph-preamble">
              Tjenesten hjelper deg med å finne relevante verktøy og informasjon tilpasset deg og hvordan du har det. Du kan for eksempel få råd om hvordan du kan:
            </p>
            <ul className="ph-benefit-list">
              <li>sove bedre</li>
              <li>håndtere stress</li>
              <li>få bedre kontroll over følelsene dine</li>
            </ul>
            <p className="ph-preamble">
              Svarene dine sendes ikke til noen og blir ikke lagret.
            </p>
          </div>

          <div className="ph-front__content ph-front__content--contact">
            <LinkList chevron>
              {VIS_VEIVISER_LENKE && (
                <LinkList.Link href="#" icon={<Icon svgIcon={TravelRoute} />} onClick={e => { e.preventDefault(); onOpenArtikkel?.(); }}>
                  <ElementHeader>
                    <ElementHeader.Text firstText="Veiviser til psykisk helsehjelp" firstTextEmphasised />
                    <ElementHeader.Text firstText="En oversikt over psykisk helse tjenestetilbud i Norge" subText />
                  </ElementHeader>
                </LinkList.Link>
              )}
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
          <p className="ph-quiz-subtitle">Gjelder noe av dette for deg?</p>
          <ul className="ph-checkbox-list" role="list">
            {Q1_OPTIONS.map(opt => (
              <li key={opt.label}>
                <Checkbox
                  label={opt.label}
                  inputId={`q1-${opt.label}`}
                  checked={d1.has(opt.label)}
                  onChange={() => toggleQ1(opt.label)}
                />
              </li>
            ))}
          </ul>
          <div className="ph-quiz-nav">
            <Button variant="fill" arrow="icon" onClick={() => setView('quiz2')}>Neste</Button>
            <Button variant="borderless" onClick={avbryt}>Avbryt</Button>
          </div>
        </main>
      )}

      {/* ── Quiz step 2 ────────────────────────────────────────── */}
      {view === 'quiz2' && (
        <main className="ph-page ph-page--quiz">
          <ProgressBar step={2} />
          <h1 className="ph-quiz-title">Hva ønsker du å fokusere på?</h1>
          <ul className="ph-checkbox-list" role="list">
            {Q2_OPTIONS.map(opt => (
              <li key={opt.label}>
                <Checkbox
                  label={opt.label}
                  inputId={`q2-${opt.label}`}
                  checked={d2.has(opt.label)}
                  onChange={() => toggleQ2(opt.label, opt.exclusive)}
                />
              </li>
            ))}
          </ul>
          <div className="ph-quiz-nav">
            <Button variant="outline" onClick={() => setView('quiz1')}>
              <Icon svgIcon={ChevronLeft} size={38} />
              Forrige
            </Button>
            <Button variant="fill" arrow="icon" onClick={fullfor}>Neste</Button>
            <Button variant="borderless" onClick={avbryt}>Avbryt</Button>
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
            <section className="ph-tool-section ph-sec ph-sec--blueberry" aria-labelledby="ph-tool-section-title">
              <SectionVisual blob="/ph-sec-blob-blueberry.svg" illu="/ph-sec-illu-verktoy.svg" variant="verktoy" />
              <h2 className="ph-tool-section__title" id="ph-tool-section-title">Verktøy</h2>
              <ul className="ph-resource-list ph-tool-section__list">
                {results.verktøy.map(r => (
                  <li key={r.id}>
                    <ResourceCard resource={r} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.artikler.length > 0 && (
            <section className="ph-tool-section ph-sec ph-sec--cherry" aria-labelledby="ph-article-section-title">
              <SectionVisual blob="/ph-sec-blob-cherry.svg" illu="/ph-sec-illu-artikler.svg" variant="artikler" />
              <h2 className="ph-tool-section__title" id="ph-article-section-title">Artikler</h2>
              <ul className="ph-resource-list ph-tool-section__list ph-art-list">
                {results.artikler.map((r, i) => (
                  <li key={r.id}>
                    <ResourceCard resource={r} index={i} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.veiledningstjenester.length > 0 && (
            <section className="ph-tool-section ph-sec ph-sec--neutral" aria-labelledby="ph-service-section-title">
              <div className="ph-sec__band ph-sec__band--icon" aria-hidden="true">
                <Icon svgIcon={PeopleTalking} size={64} />
              </div>
              <h2 className="ph-tool-section__title" id="ph-service-section-title">Noen å snakke med</h2>
              <ul className="ph-resource-list ph-tool-section__list">
                {results.veiledningstjenester.map(r => (
                  <li key={r.id}>
                    <ResourceCard resource={r} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div>
            <Button variant="outline" onClick={retake}>
              <Icon svgIcon={ArrowLeft} size={38} />
              Endre svarene dine
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
