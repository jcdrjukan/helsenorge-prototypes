import { useState } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Button from '@helsenorge/designsystem-react/components/Button';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import StatusDot from '@helsenorge/designsystem-react/components/StatusDot';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import Checkbox from '@helsenorge/designsystem-react/components/Checkbox';
import './style.css';

import { RESOURCES, Q1_OPTIONS, Q2_OPTIONS } from './data';

export type View = 'front' | 'quiz1' | 'quiz2' | 'results';

function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="ph-progress">
      <div className={`ph-progress__dot ${step >= 1 ? (step > 1 ? 'ph-progress__dot--done' : 'ph-progress__dot--active') : ''}`} />
      <div className={`ph-progress__line ${step > 1 ? 'ph-progress__line--done' : ''}`} />
      <div className={`ph-progress__dot ${step >= 2 ? (step > 2 ? 'ph-progress__dot--done' : 'ph-progress__dot--active') : ''}`} />
      <div className={`ph-progress__line ${step > 2 ? 'ph-progress__line--done' : ''}`} />
      <div className={`ph-progress__dot ${step >= 3 ? 'ph-progress__dot--active' : ''}`} />
    </div>
  );
}

export default function PsykiskHelse() {
  const [view, setView] = useState<View>('front');
  const [q1, setQ1] = useState<Set<string>>(new Set());
  const [q2, setQ2] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  const toggleQ1 = (opt: string) => {
    setQ1(prev => {
      const next = new Set(prev);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return next;
    });
  };

  const toggleQ2 = (opt: string) => {
    setQ2(prev => {
      const next = new Set(prev);
      next.has(opt) ? next.delete(opt) : next.add(opt);
      return next;
    });
  };

  const visitResource = (id: string) => {
    setVisited(prev => new Set([...prev, id]));
  };

  const removeResource = (id: string) => {
    setRemoved(prev => new Set([...prev, id]));
  };

  const breadcrumbLabel = view === 'results' ? 'Forside' : 'Mental helse';
  const breadcrumbAction = () => {
    if (view === 'quiz2') setView('quiz1');
    else if (view === 'results') setView('front');
    else setView('front');
  };

  const visibleResources = RESOURCES.filter(r => !removed.has(r.id));
  const verktøy = visibleResources.filter(r => r.category === 'verktøy');
  const artikler = visibleResources.filter(r => r.category === 'artikkel');

  return (
    <div className="ph-shell">
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

      {/* ── Breadcrumb (not on front) ───────────────────────────── */}
      {view !== 'front' && (
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

      {/* ── Front page ─────────────────────────────────────────── */}
      {view === 'front' && (
        <main className="ph-page">
          <h1 className="ph-hero-title">Forbedre din psykiske helse</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p className="ph-preamble">
              Mange opplever perioder med stress, søvnproblemer eller lav stemning. Du er ikke alene – og det finnes hjelp.
            </p>
            <p className="ph-preamble">Helsenorge tilbyr kvalitetssikrede selvhjelpsressurser som kan bidra til:</p>
            <ul className="ph-benefit-list">
              <li>bedre søvn</li>
              <li>bedre stresshåndtering</li>
              <li>mer kontroll over dine følelser</li>
            </ul>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p className="ph-cta-text">Ta en kort quiz så kan vi sette sammen noen nyttige tips til deg:</p>
            <Button variant="fill" arrow="icon" onClick={() => setView('quiz1')}>
              Start quiz
            </Button>
          </div>

          {/* Emergency panel */}
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
            <div className="ph-emergency__chevron">
              <Icon svgIcon={ChevronRight} size={38} />
            </div>
          </a>
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
              <li key={opt}>
                <Checkbox
                  label={opt}
                  inputId={`q1-${opt}`}
                  checked={q1.has(opt)}
                  onChange={() => toggleQ1(opt)}
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
          <h1 className="ph-quiz-title">Er noen av disse relevant for deg?</h1>
          <p className="ph-quiz-subtitle">Hva vil du ha hjelp med?</p>
          <ul className="ph-checkbox-list" role="list">
            {Q2_OPTIONS.map(opt => (
              <li key={opt}>
                <Checkbox
                  label={opt}
                  inputId={`q2-${opt}`}
                  checked={q2.has(opt)}
                  onChange={() => toggleQ2(opt)}
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
            <h1 style={{ font: '600 2rem/120% "Source Sans Pro", sans-serif', margin: '0 0 8px' }}>Mental helse</h1>
            <p className="ph-results-intro">
              På denne siden finner du ulike ting som kan være relevant for deg.
            </p>
            <p className="ph-results-sub" style={{ marginTop: '8px' }}>
              Basert på dine svar, foreslår vi følgende som har hjulpet andre i lignende situasjoner. Du bestemmer selv hva du vil bruke.
            </p>
          </div>

          {/* Verktøy */}
          {verktøy.length > 0 && (
            <section>
              <h2 className="ph-section-heading">Verktøy</h2>
              <ul className="ph-resource-list">
                {verktøy.map(r => (
                  <li key={r.id} className="ph-resource-card">
                    <div className="ph-resource-card__header">
                      <h3 className="ph-resource-card__title">{r.title}</h3>
                      {!visited.has(r.id) && (
                        <StatusDot variant="inprocess" text="Ikke lest" />
                      )}
                    </div>
                    <p className="ph-resource-card__time">{r.timeLabel}</p>
                    <p className="ph-resource-card__desc">{r.description}</p>
                    <div className="ph-resource-card__footer">
                      <Button
                        variant="outline"
                        arrow="icon"
                        htmlMarkup="a"
                        href={r.ctaUrl}
                        onClick={() => visitResource(r.id)}
                      >
                        {r.ctaLabel}
                      </Button>
                      <Button
                        variant="borderless"
                        onClick={() => removeResource(r.id)}
                        ariaLabel={`Fjern ${r.title}`}
                      >
                        × Fjern
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Artikler */}
          {artikler.length > 0 && (
            <section>
              <h2 className="ph-section-heading">Artikler</h2>
              <ul className="ph-resource-list">
                {artikler.map(r => (
                  <li key={r.id} className="ph-resource-card">
                    <div className="ph-resource-card__header">
                      <h3 className="ph-resource-card__title">{r.title}</h3>
                      {!visited.has(r.id) && (
                        <StatusDot variant="inprocess" text="Ikke lest" />
                      )}
                    </div>
                    <p className="ph-resource-card__time">{r.timeLabel}</p>
                    <p className="ph-resource-card__desc">{r.description}</p>
                    <div className="ph-resource-card__footer">
                      <Button
                        variant="outline"
                        arrow="icon"
                        htmlMarkup="a"
                        href={r.ctaUrl}
                        onClick={() => visitResource(r.id)}
                      >
                        {r.ctaLabel}
                      </Button>
                      <Button
                        variant="borderless"
                        onClick={() => removeResource(r.id)}
                        ariaLabel={`Fjern ${r.title}`}
                      >
                        × Fjern
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Retake */}
          <div className="ph-retake-wrap">
            <Button variant="outline" onClick={() => setView('quiz1')}>Start quiz på nytt</Button>
          </div>

          {/* Ta kontakt */}
          <section className="ph-contact-section">
            <h2 className="ph-contact-title">Ta kontakt</h2>
            <LinkList chevron>
              <LinkList.Link href="#">
                <ElementHeader>
                  <ElementHeader.Text firstText="Snakk med din fastlege" firstTextEmphasised />
                  <ElementHeader.Text firstText="Om langvarige psykiske helseutfordringer" subText />
                </ElementHeader>
              </LinkList.Link>
              <LinkList.Link href="#">
                <ElementHeader>
                  <ElementHeader.Text firstText="Nesodden kommune" firstTextEmphasised />
                  <ElementHeader.Text firstText="Se psykisk helse-tilbud i din kommune" subText />
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
