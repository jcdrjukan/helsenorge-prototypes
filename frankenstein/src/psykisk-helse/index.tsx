import { useState, useEffect } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Button from '@helsenorge/designsystem-react/components/Button';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import Login from '@helsenorge/designsystem-react/components/Icons/Login';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ChevronRight from '@helsenorge/designsystem-react/components/Icons/ChevronRight';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import Checkbox from '@helsenorge/designsystem-react/components/Checkbox';
import './style.css';

import { RESOURCES, Q1_OPTIONS, Q2_OPTIONS } from './data';

export type View = 'front' | 'loginSelect' | 'bankid' | 'quiz1' | 'quiz2' | 'results';

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

  useEffect(() => {
    const el = document.querySelector('.phone-frame__screen');
    if (el) el.scrollTop = 0;
  }, [view]);

  const visitResource = (id: string) => {
    setVisited(prev => new Set([...prev, id]));
  };

  const breadcrumbLabel = (() => {
    if (view === 'front' || view === 'results') return 'Forside';
    if (view === 'loginSelect' || view === 'bankid') return 'Helsenorge';
    return 'Mental helse';
  })();
  const breadcrumbAction = () => {
    if (view === 'bankid') setView('loginSelect');
    else if (view === 'quiz2') setView('quiz1');
    else if (view === 'results') setView('front');
    else setView('front');
  };

  const visibleResources = RESOURCES;
  const verktøy = visibleResources.filter(r => r.category === 'verktøy');
  const artikler = visibleResources.filter(r => r.category === 'artikkel');

  return (
    <div className="ph-shell">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className={`header${(view === 'front' || view === 'loginSelect' || view === 'bankid') ? ' ph-header--unauth' : ''}`}>
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
            {(view === 'front' || view === 'loginSelect' || view === 'bankid') ? (
              <button className="nav-icon-btn" aria-label="Logg inn" onClick={() => setView('loginSelect')}>
                <Icon svgIcon={Login} size={38} />
                <span className="nav-icon-btn__label">Logg inn</span>
              </button>
            ) : (
              <button className="nav-icon-btn" aria-label="Logg ut">
                <Icon svgIcon={Logout} size={38} />
                <span className="nav-icon-btn__label">Logg ut</span>
              </button>
            )}
          </nav>
        </div>
        {view !== 'front' && view !== 'loginSelect' && view !== 'bankid' && (
          <button className="profile-bar" aria-label="Brukermeny">
            <Avatar color="blueberry" size="xsmall">Tora Hansen</Avatar>
            <span className="profile-bar__name">Tora Hansen</span>
            <Icon svgIcon={ChevronDown} size={38} />
          </button>
        )}
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={breadcrumbAction}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>{breadcrumbLabel}</span>
        </button>
      </nav>
      <hr className="page-divider" />

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
            <p className="ph-cta-text">Ta en kort quiz så kan vi sette sammen noen nyttige tips til deg:</p>
            <Button variant="fill" arrow="icon" onClick={() => setView('loginSelect')}>
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

      {/* ── Login: velg innloggingsmetode ──────────────────────── */}
      {view === 'loginSelect' && (
        <main className="ph-login">
          <div className="ph-login__header">
            <h1 className="ph-login__heading">Velg innloggingsmetode</h1>
          </div>
          <ul className="ph-login__methods">
            <li>
              <button className="ph-login__method" onClick={() => setView('bankid')}>
                <div className="ph-login__logo ph-login__logo--bankid">
                  <svg width="52" height="20" viewBox="0 0 90 36" fill="none" aria-hidden="true"><rect width="90" height="36" rx="4" fill="#1B1B4B"/><text x="8" y="26" fill="white" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold">bankID</text></svg>
                </div>
                <div className="ph-login__method-text">
                  <span className="ph-login__method-title">BankID</span>
                  <span className="ph-login__method-sub">Bruk BankID-app eller kodebrikke</span>
                </div>
                <Icon svgIcon={ChevronRight} size={38} />
              </button>
            </li>
            <li>
              <button className="ph-login__method">
                <div className="ph-login__logo ph-login__logo--buypass">
                  <span style={{ fontWeight: 700, fontSize: 12, color: '#fff', letterSpacing: '-0.3px' }}>buypass</span>
                </div>
                <div className="ph-login__method-text">
                  <span className="ph-login__method-title">Buypass</span>
                  <span className="ph-login__method-sub">Bruk Buypass ID på smartkort, mobil eller nøkkel</span>
                </div>
                <Icon svgIcon={ChevronRight} size={38} />
              </button>
            </li>
            <li>
              <button className="ph-login__method">
                <div className="ph-login__logo ph-login__logo--commfides">
                  <span style={{ fontSize: 9, color: '#333', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>COMMFIDES</span>
                </div>
                <div className="ph-login__method-text">
                  <span className="ph-login__method-title">Commfides</span>
                  <span className="ph-login__method-sub">Med smartkort</span>
                </div>
                <Icon svgIcon={ChevronRight} size={38} />
              </button>
            </li>
          </ul>
          <div style={{ padding: '16px 16px 0' }}>
            <a href="#" className="ph-link">Slik skaffer du deg elektronisk ID</a>
          </div>
          <div className="ph-idporten">
            <div className="ph-idporten__logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="#000" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" fill="#000"/>
                <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="ph-idporten__name">ID-porten</span>
            </div>
            <p className="ph-idporten__desc">ID-porten er en felles innloggingsløsning til offentlige digitale tjenester.</p>
            <h2 className="ph-idporten__links-title">Viktige lenker</h2>
            <ul className="ph-idporten__links">
              <li><a href="#" className="ph-link">Sikkerhet og personvern</a></li>
              <li><a href="#" className="ph-link">Slik skaffer du deg elektronisk ID</a></li>
            </ul>
          </div>
        </main>
      )}

      {/* ── BankID authentication ───────────────────────────────── */}
      {view === 'bankid' && (
        <main className="ph-bankid">
          <div className="ph-bankid__header">
            <svg width="80" height="32" viewBox="0 0 90 36" fill="none" aria-label="BankID" role="img">
              <rect width="90" height="36" rx="4" fill="#1B1B4B"/>
              <text x="8" y="26" fill="white" fontFamily="serif" fontSize="20" fontWeight="bold">bankID</text>
            </svg>
          </div>
          <div className="ph-bankid__body">
            <h1 className="ph-bankid__title">Logg inn med BankID</h1>
            <p className="ph-bankid__desc">Åpne BankID-appen og godkjenn påloggingen.</p>
            <div className="ph-bankid__animation">
              <div className="ph-bankid__phone-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B1B4B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="2" width="14" height="20" rx="2"/>
                  <circle cx="12" cy="17" r="1" fill="#1B1B4B"/>
                </svg>
              </div>
              <p className="ph-bankid__wait">Venter på godkjenning…</p>
            </div>
            <Button
              variant="fill"
              onClick={() => setView('quiz1')}
              fluid
              className="ph-bankid__btn"
            >
              Fortsett
            </Button>
            <button className="ph-btn-link" style={{ alignSelf: 'center', marginTop: '8px' }} onClick={() => setView('loginSelect')}>
              Avbryt
            </button>
          </div>
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
          <h1 className="ph-quiz-title">Hva ønsker du hjelp med nå?</h1>
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
                  <li key={r.id} style={{ marginBottom: '8px' }}>
                    <Panel
                      variant={PanelVariant.outline}
                      status={visited.has(r.id) ? PanelStatus.none : PanelStatus.new}
                    >
                      <Panel.Title title={r.title} titleMarkup="h3" />
                      <Panel.A>
                        <p className="ph-resource-card__time">{r.timeLabel}</p>
                        <p className="ph-resource-card__desc">{r.description}</p>
                        <div className="ph-resource-card__footer" style={{ marginTop: '1rem' }}>
                          <Button
                            variant="outline"
                            arrow="icon"
                            htmlMarkup="a"
                            href={r.ctaUrl}
                            onClick={() => visitResource(r.id)}
                          >
                            Gå til verktøy
                          </Button>
                        </div>
                      </Panel.A>
                    </Panel>
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
                  <li key={r.id} style={{ marginBottom: '8px' }}>
                    <Panel
                      variant={PanelVariant.outline}
                      status={visited.has(r.id) ? PanelStatus.none : PanelStatus.new}
                    >
                      <Panel.Title title={r.title} titleMarkup="h3" />
                      <Panel.A>
                        <p className="ph-resource-card__time">{r.timeLabel}</p>
                        <p className="ph-resource-card__desc">{r.description}</p>
                        <div className="ph-resource-card__footer" style={{ marginTop: '1rem' }}>
                          <Button
                            variant="outline"
                            arrow="icon"
                            htmlMarkup="a"
                            href={r.ctaUrl}
                            onClick={() => visitResource(r.id)}
                          >
                            {r.ctaLabel}
                          </Button>
                        </div>
                      </Panel.A>
                    </Panel>
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
