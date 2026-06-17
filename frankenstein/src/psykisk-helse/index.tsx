import { useState, useEffect, useMemo } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Button from '@helsenorge/designsystem-react/components/Button';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import Tag from '@helsenorge/designsystem-react/components/Tag';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import Checkbox from '@helsenorge/designsystem-react/components/Checkbox';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import './style.css';

import {
  Q1_OPTIONS, Q2_OPTIONS,
  computeResults, getSeenIds, persistSeen,
  type Resource,
} from './data';

type View = 'front' | 'quiz1' | 'quiz2' | 'results';

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
};

function CategoryTags({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {tags.map(tag => (
        <Tag key={tag} variant="normal" color="blueberry">
          {TAG_LABELS[tag] ?? tag.toUpperCase()}
        </Tag>
      ))}
    </div>
  );
}

function ResourceCard({
  resource,
  seen,
  onSeen,
}: {
  resource: Resource;
  seen: boolean;
  onSeen: (id: string) => void;
}) {
  return (
    <Panel
      variant={PanelVariant.outline}
      status={seen ? PanelStatus.none : PanelStatus.new}
    >
      <Panel.Title title={resource.title} titleMarkup="h3" />
      <Panel.A>
        <div style={{ marginTop: '0rem', marginBottom: '0.5rem' }}>
          <CategoryTags tags={resource.tags} />
        </div>
        <p className="ph-resource-card__desc">{resource.shortDescription}</p>
        <div style={{ marginTop: '1rem' }}>
          <Button
            variant="outline"
            arrow="icon"
            onClick={() => {
              onSeen(resource.id);
              window.open(
                resource.url,
                '_blank',
                'width=390,height=844,menubar=no,toolbar=no,location=yes,status=no,scrollbars=yes,resizable=yes'
              );
            }}
          >
            {resource.type === 'verktøy' ? 'Gå til verktøy' : 'Gå til artikkel'}
          </Button>
        </div>
      </Panel.A>
    </Panel>
  );
}

export default function PsykiskHelse() {
  const [view, setView]           = useState<View>('front');
  const [q1, setQ1]               = useState<Set<string>>(new Set());
  const [q2, setQ2]               = useState<Set<string>>(new Set());
  const [seenIds, setSeenIds]     = useState<Set<string>>(() => getSeenIds());

  // Scroll to top on every navigation
  useEffect(() => {
    const el = document.querySelector('.phone-frame__screen');
    if (el) el.scrollTop = 0;
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

  const markSeen = (id: string) => {
    setSeenIds(prev => {
      const next = new Set([...prev, id]);
      persistSeen(next);
      return next;
    });
  };

  const retake = () => {
    setView('quiz1');
  };

  const isAuthenticated = true;

  const breadcrumbLabel = view === 'front' ? 'Forside' : 'Psykisk helse';
  const breadcrumbAction = () => {
    if (view === 'quiz2') setView('quiz1');
    else setView('front');
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
        {isAuthenticated && (
          <button className="profile-bar" aria-label="Brukermeny">
            <Avatar color="blueberry" size="xsmall">Tora Hansen</Avatar>
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
              Det er normalt å ha det vanskelig i perioder. Det er en del av å være et menneske. For deg som har det ekstratøft for tida, tilbyr Helsenorge en rekke kvalitetssikrede forslag som kan hjelpe. Prøv veiviseren og se hva vi kan tilby.
            </p>
            <Button variant="fill" arrow="icon" fluid onClick={() => setView('quiz1')}>
              Prøv veiviseren
            </Button>
          </div>

          <div className="ph-front__hero ph-front__hero--warm" aria-hidden="true" />

          <div className="ph-front__content">
            <h2 className="ph-front__section-title">Om veiviseren</h2>
            <p className="ph-preamble">
              Veiviseren består av noen enkle spørsmål (tar ca 1 minutt) og kan tilby hjelp nå – i ditt tempo, helt uforpliktende og helt anonym.
            </p>
            <p className="ph-cta-text">Du kan blant annet få hjelp til:</p>
            <ul className="ph-benefit-list">
              <li>bedre søvn</li>
              <li>bedre stresshåndtering</li>
              <li>mer kontroll over dine følelser</li>
            </ul>
          </div>

          <div className="ph-front__content">
            <a href="tel:116123" className="ph-emergency">
              <div className="ph-emergency__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12 19.79 19.79 0 0 1 1.08 3.44 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="ph-emergency__body">
                <p className="ph-emergency__title">Ring 116 123</p>
                <p className="ph-emergency__text">Ved akutt behov for psykisk helsehjelp. Åpent hele døgnet.</p>
              </div>
              <div style={{ color: '#126F87', alignSelf: 'center', flexShrink: 0 }}>
                <Icon svgIcon={ChevronRight} size={38} />
              </div>
            </a>
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
          <ul className="ph-checkbox-list" role="list">
            {Q1_OPTIONS.map(opt => (
              <li key={opt.label}>
                <Checkbox
                  label={opt.label}
                  inputId={`q1-${opt.label}`}
                  checked={q1.has(opt.label)}
                  onChange={() => toggleQ1(opt.label)}
                />
              </li>
            ))}
          </ul>
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
          <h1 className="ph-quiz-title">Hva ønsker du hjelp med nå?</h1>
          <ul className="ph-checkbox-list" role="list">
            {Q2_OPTIONS.map(opt => (
              <li key={opt.label}>
                <Checkbox
                  label={opt.label}
                  inputId={`q2-${opt.label}`}
                  checked={q2.has(opt.label)}
                  onChange={() => toggleQ2(opt.label, opt.exclusive)}
                />
              </li>
            ))}
          </ul>
          <div className="ph-quiz-nav">
            <Button variant="outline" onClick={() => setView('quiz1')}>
              <Icon svgIcon={ChevronLeft} size={38} />
              forrige
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
                ? 'Her er noen ressurser som kan være nyttige for psykisk helse generelt. Du bestemmer selv hva du vil bruke. Alle ressurser er kvalitetssikret av Helsenorge.'
                : 'Basert på dine svar har vi valgt ut noen ressurser som kan hjelpe deg. Du bestemmer selv hva du vil bruke. Alle ressurser er kvalitetssikret av Helsenorge.'}
            </p>
          </div>

          {results.verktøy.length > 0 && (
            <section>
              <h2 className="ph-section-heading">Verktøy</h2>
              <ul className="ph-resource-list">
                {results.verktøy.map(r => (
                  <li key={r.id} style={{ marginBottom: '8px' }}>
                    <ResourceCard
                      resource={r}
                      seen={seenIds.has(r.id)}
                      onSeen={markSeen}
                    />
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
                    <ResourceCard
                      resource={r}
                      seen={seenIds.has(r.id)}
                      onSeen={markSeen}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div>
            <Button variant="outline" onClick={retake}>
              <Icon svgIcon={ArrowLeft} size={38} />
              Start veiviseren på nytt
            </Button>
          </div>

          <section>
            <h2 className="ph-contact-title">Ta kontakt</h2>
            <LinkList chevron>
              <LinkList.Link href="#">
                <ElementHeader>
                  <ElementHeader.Text firstText="Snakk med din fastlege" firstTextEmphasised />
                  <ElementHeader.Text firstText="Om langvarige psykiske helseutfordringer" subText />
                </ElementHeader>
              </LinkList.Link>
              <LinkList.Link href="tel:116123">
                <ElementHeader>
                  <ElementHeader.Text firstText="Ring 116 123" firstTextEmphasised />
                  <ElementHeader.Text firstText="Ved akutt behov for psykisk helsehjelp. Åpent hele døgnet." subText />
                </ElementHeader>
              </LinkList.Link>
            </LinkList>
          </section>
        </main>
      )}
    </div>
  );
}
