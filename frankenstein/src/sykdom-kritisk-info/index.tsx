import { useState, useEffect } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Panel, { PanelStatus, PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import HighlightPanel from '@helsenorge/designsystem-react/components/HighlightPanel';
import Tag from '@helsenorge/designsystem-react/components/Tag';
import Expander, { ExpanderSize } from '@helsenorge/designsystem-react/components/Expander';
import EmptyState, { EmptyStateOnColor } from '@helsenorge/designsystem-react/components/EmptyState';
import Tabs from '@helsenorge/designsystem-react/components/Tabs';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Search from '@helsenorge/designsystem-react/components/Icons/Search';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import HandWaving from '@helsenorge/designsystem-react/components/Icons/HandWaving';
import './style.css';

import { CATEGORIES } from './data';

const SYKDOMSHISTORIKK = [
  { year: 2021, title: 'Hypertensjon', comment: 'Ingen kommentar' },
  { year: 2019, title: 'Diabetes type 2', comment: 'Behandles med Metformin' },
];

// Empty state and populated state are two separate Figma frames — give each its own
// shareable URL (hash) rather than an in-page toggle.
type DemoState = 'populated' | 'empty';

const HASH_TO_STATE: Record<string, DemoState> = {
  '': 'populated',
  '#': 'populated',
  '#populert': 'populated',
  '#tom': 'empty',
};

function stateFromHash(): DemoState {
  return HASH_TO_STATE[window.location.hash] ?? 'populated';
}

export default function SykdomKritiskInfo() {
  const [activeTab, setActiveTab] = useState(1);
  const [demoState, setDemoState] = useState<DemoState>(() => stateFromHash());

  useEffect(() => {
    const onHashChange = () => setDemoState(stateFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const registered = demoState === 'empty' ? [] : CATEGORIES.filter(c => c.registration);
  const emptyGroup1 = CATEGORIES.filter(c => (demoState === 'empty' || !c.registration) && c.group === 1);
  const emptyGroup2 = CATEGORIES.filter(c => (demoState === 'empty' || !c.registration) && c.group === 2);

  return (
    <div className="ski-shell">

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
        <button className="breadcrumb__back">
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="page-divider" />

      <main className="ski-page">
        <Title htmlMarkup="h1" appearance="title1">Sykdom og kritisk informasjon</Title>
        <p className="ski-preamble">
          Her vises helseopplysninger som helsepersonell skal kjenne til ved undersøkelser og behandling.
        </p>

        <Tabs activeTab={activeTab}>
          <Tabs.Tab title="Sykdomshistorikk" onTabClick={() => setActiveTab(0)}>
            <div className="ski-tabpanel">
              <div className="ski-section-header">
                <h2 className="ski-section-title">Egenregistrert sykdomshistorikk</h2>
                <a href="#" className="ski-endre-link">Endre ↗</a>
              </div>
              <p className="ski-tab-intro">
                Her kan du registrere sykdommer eller helsetilstander som du ønsker at helsepersonell skal kjenne til.
              </p>
              <div className="ski-history-list">
                {SYKDOMSHISTORIKK.map(item => (
                  <div className="ski-history-row" key={item.title}>
                    <span className="ski-history-year">{item.year}</span>
                    <strong className="ski-history-title">{item.title}</strong>
                    <span className="ski-history-comment">{item.comment}</span>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Tab>

          <Tabs.Tab title="Kritisk informasjon" onTabClick={() => setActiveTab(1)}>
            <div className="ski-tabpanel">
              <p className="ski-tab-intro">
                Her vises kritiske helseopplysninger som legen i samråd med deg har registrert i din kjernejournal. Er det feil eller mangler i opplysningene, ta kontakt med din fastlege.
              </p>

              {registered.length === 0 ? (
                <EmptyState
                  title="Det er ingen kritisk informasjon registrert på deg"
                  type="dashed"
                  size="compact"
                  onColor={EmptyStateOnColor.onwhite}
                />
              ) : (
                <div className="ski-panel-list">
                  {registered.map(cat => (
                    <Panel key={cat.id} variant={PanelVariant.outline} status={PanelStatus.none} color="neutral">
                      <Panel.A>
                        <div className="ski-panel-tags">
                          <Tag variant="normal">{`${cat.registration!.gjeldende} gjeldende`}</Tag>
                          {cat.registration!.avkreftet > 0 && (
                            <Tag variant="normal">{`${cat.registration!.avkreftet} avkreftet`}</Tag>
                          )}
                        </div>
                        <h3 className="ski-panel-title">{cat.title}</h3>
                        <p className="ski-panel-desc">{cat.description}</p>
                      </Panel.A>
                      <Panel.ExpandedContent>
                        <p className="ski-panel-detail">{cat.registration!.detail}</p>
                      </Panel.ExpandedContent>
                    </Panel>
                  ))}
                </div>
              )}

              <HighlightPanel color="blueberry" svgIcon={HandWaving} className="ski-missing-panel">
                <h2 className="ski-missing-title">Sjekk om noe mangler...</h2>
                <p className="ski-missing-text">
                  Du har ingen registreringer i de følgende kritiske kategoriene. At en kategori er tom kan bety at den ikke gjelder deg – eller at noe burde vært registrert, men ikke er det. Ta kontakt med din fastlege hvis du tror noe mangler.
                </p>

                {emptyGroup1.length > 0 && (
                  <div className="ski-expander-list">
                    {emptyGroup1.map(cat => (
                      <Expander key={cat.id} title={cat.title} size={ExpanderSize.small}>
                        <p className="ski-expander-desc">{cat.description}</p>
                      </Expander>
                    ))}
                  </div>
                )}
                {emptyGroup2.length > 0 && (
                  <div className="ski-expander-list">
                    {emptyGroup2.map(cat => (
                      <Expander key={cat.id} title={cat.title} size={ExpanderSize.small}>
                        <p className="ski-expander-desc">{cat.description}</p>
                      </Expander>
                    ))}
                  </div>
                )}
              </HighlightPanel>
            </div>
          </Tabs.Tab>
        </Tabs>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="ski-footer">
        <div className="ski-footer__top">
          <div className="ski-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <div>
              <p className="ski-footer__link-title">23 32 70 00</p>
              <p className="ski-footer__link-sub">Veiledning helsenorge.no</p>
            </div>
          </div>
          <div className="ski-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="ski-footer__link-title">Hjelp og kontakt</p>
          </div>
          <div className="ski-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div className="ski-footer__lang">
              <span className="ski-footer__link-title">English</span>
              <span className="ski-footer__lang-sep" />
              <span className="ski-footer__link-title">Sámi</span>
            </div>
          </div>
        </div>
        <div className="ski-footer__divider" />
        <div className="ski-footer__links">
          <a href="#" className="ski-footer__link">Om Helsenorge</a>
          <a href="#" className="ski-footer__link">Personvern og nettsikkerhet</a>
          <a href="#" className="ski-footer__link">Tilgjengelighetserklæring</a>
        </div>
        <div className="ski-footer__divider" />
        <a href="#" className="ski-footer__link">Last ned Helsenorge-appen</a>
        <div className="ski-footer__divider" />
        <p className="ski-footer__brand">Drives av Norsk helsenett SF</p>
      </footer>
    </div>
  );
}
