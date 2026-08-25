import { useState } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import Tile from '@helsenorge/designsystem-react/components/Tile/Tile';
import PromoPanel from '@helsenorge/designsystem-react/components/PromoPanel/PromoPanel';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronUp from '@helsenorge/designsystem-react/components/Icons/ChevronUp';
import StarStroke from '@helsenorge/designsystem-react/components/Icons/StarStroke';
import Edit from '@helsenorge/designsystem-react/components/Icons/Edit';
import './style.css';

import {
  FIXED_SNARVEIER, TJENESTER_TILES, TJENESTE_GROUPS, VALGBARE_TJENESTER,
  type ValgbarTjenesteId,
} from './data';
import { hasCompletedVeiviser } from '../psykisk-helse/data';

export interface ForsideProps {
  activatedTjenester: Set<ValgbarTjenesteId>;
  onGoToTjeneste: (id: ValgbarTjenesteId) => void;
}

export default function Forside({ activatedTjenester, onGoToTjeneste }: ForsideProps) {
  const [showAllTjenester, setShowAllTjenester] = useState(false);

  // Base fixed snarveier, with any activated valgbare tjenester spliced in —
  // Gravid at the same position the Figma reference shows it (between
  // Vaksiner and Pasientjournal); Psykisk helse/Småbarnsliv appended after,
  // in canonical order, when active. Psykisk helse's "activated" isn't a
  // manually toggled flag like the other two — it's derived straight from
  // hasCompletedVeiviser() (has a results page), per the user's framing:
  // completing the veiviser creates the snarvei, confirming Avslutt
  // (which clears that flag) removes it — no separate state to keep in sync.
  const [sykdom, helsekontakter, vaksiner, pasientjournal] = FIXED_SNARVEIER;
  const gravidTjeneste = VALGBARE_TJENESTER.find(t => t.id === 'gravid')!;
  const psykiskHelseTjeneste = VALGBARE_TJENESTER.find(t => t.id === 'psykisk-helse')!;
  const smabarnslivTjeneste = VALGBARE_TJENESTER.find(t => t.id === 'smabarnsliv')!;

  const snarveier = [
    sykdom,
    helsekontakter,
    vaksiner,
    ...(activatedTjenester.has('gravid') ? [{ id: gravidTjeneste.id, label: gravidTjeneste.label, icon: gravidTjeneste.icon }] : []),
    pasientjournal,
    ...(hasCompletedVeiviser() ? [{ id: psykiskHelseTjeneste.id, label: psykiskHelseTjeneste.label, icon: psykiskHelseTjeneste.icon }] : []),
    ...(activatedTjenester.has('smabarnsliv') ? [{ id: smabarnslivTjeneste.id, label: smabarnslivTjeneste.label, icon: smabarnslivTjeneste.icon }] : []),
  ];

  const isValgbarId = (id: string): id is ValgbarTjenesteId =>
    id === 'psykisk-helse' || id === 'gravid' || id === 'smabarnsliv';

  return (
    <div className="fs-shell">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="header">
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
        <button className="profile-bar" aria-label="Brukermeny">
          <Avatar color="blueberry" size="xsmall" className="fs-avatar">Tora Hansen</Avatar>
          <span className="profile-bar__name">Tora Hansen</span>
          <Icon svgIcon={ChevronDown} size={38} />
        </button>
      </header>

      <main className="fs-page">
        <div className="fs-hero">
          <h1 className="fs-h1">Hva ser du etter?</h1>

          {/* ── Snarveier ──────────────────────────────────────────── */}
          <section>
            <div className="fs-section-header">
              <span className="fs-section-header__title">
                <Icon svgIcon={StarStroke} size={24} /> Snarveier
              </span>
              <span className="fs-edit-link">
                <Icon svgIcon={Edit} size={24} color="currentColor" /> Rediger
              </span>
            </div>
            <LinkList variant="fill" color="white" chevron>
              {snarveier.map(row => (
                <LinkList.Link
                  key={row.id}
                  href="#"
                  icon={<Icon svgIcon={row.icon} />}
                  onClick={e => {
                    e.preventDefault();
                    if (isValgbarId(row.id)) onGoToTjeneste(row.id);
                  }}
                >
                  {row.label}
                </LinkList.Link>
              ))}
            </LinkList>
          </section>

          {/* ── Tjenester ──────────────────────────────────────────── */}
          <section>
            <h2 className="fs-section-title">Tjenester</h2>
            <div className="fs-tile-grid">
              {TJENESTER_TILES.map(t => (
                <Tile key={t.id} href="#" icon={<Icon svgIcon={t.icon} />} title={<Tile.Title>{t.label}</Tile.Title>} />
              ))}
            </div>

            <button className="fs-toggle-tjenester" onClick={() => setShowAllTjenester(v => !v)}>
              <Icon svgIcon={showAllTjenester ? ChevronUp : ChevronDown} size={32} color="currentColor" />
              {showAllTjenester ? 'Vis færre tjenester' : 'Se alle tjenester'}
            </button>

            {showAllTjenester && (
              <div className="fs-expanded-tjenester">
                {TJENESTE_GROUPS.map(group => (
                  <div key={group.heading} className="fs-tjeneste-group">
                    <h2 className="fs-section-title">{group.heading}</h2>
                    <LinkList variant="line" color="white" chevron>
                      {group.rows.map(row => (
                        <LinkList.Link key={row.id} href="#" icon={<Icon svgIcon={row.icon} />}>
                          {row.label}
                        </LinkList.Link>
                      ))}
                    </LinkList>
                  </div>
                ))}

                {/* ── Valgbare tjenester (new) — pure navigation, no
                    activation control; same plain-row layout as every
                    other group above. ─────────────────────────────── */}
                <div className="fs-tjeneste-group">
                  <h2 className="fs-section-title">Situasjonstjenester</h2>
                  <LinkList variant="line" color="white" chevron>
                    {VALGBARE_TJENESTER.map(t => (
                      <LinkList.Link
                        key={t.id}
                        href="#"
                        icon={<Icon svgIcon={t.icon} />}
                        onClick={e => {
                          e.preventDefault();
                          if (t.hasPrototype) onGoToTjeneste(t.id);
                        }}
                      >
                        {t.label}
                      </LinkList.Link>
                    ))}
                  </LinkList>
                </div>

                <button className="fs-toggle-tjenester" onClick={() => setShowAllTjenester(false)}>
                  <Icon svgIcon={ChevronUp} size={32} color="currentColor" />
                  Vis færre tjenester
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Din fastlege ─────────────────────────────────────────── */}
        {/* Real PromoPanel — the purpose-built component for this exact
            pattern (illustration + link title + subtext + trailing
            arrow), rather than the hand-rolled HighlightPanel+Illustration
            layout used before. */}
        <div className="fs-fastlege-panel">
          <PromoPanel title="Din fastlege" illustration="Doctor" color="cherry" href="#">
            Kontakt fastlegen og se alle tjenestene
          </PromoPanel>
        </div>

        {/* ── Kvalitetssikret helseinformasjon ─────────────────────── */}
        <section>
          <h2 className="fs-section-title fs-section-title--kvalitetssikret">Kvalitetssikret helseinformasjon</h2>
          <hr className="fs-section-divider" />
          <div className="fs-article-list">
            <article className="fs-article">
              <h3 className="fs-article__title">Husk å ta med Europeisk helsetrygdkort på ferie</h3>
              <p className="fs-article__body">
                Skal du på ferie i EU/EØS, Sveits eller Storbritania? Husk å ta med helsetrygdkort. Kortet gir deg rett til nødvendig helsehjelp i det offentlige helsevesenet på samme vilkår som innbyggerne i landet du besøker.
              </p>
              <a className="fs-article__link" href="#">Les mer og søk om Europeisk helsetrygdkort →</a>
            </article>
            <article className="fs-article">
              <h3 className="fs-article__title">Finn en klinisk studie</h3>
              <p className="fs-article__body">
                I kliniske studier blir effekten av nye legemidler, behandlinger, bivirkninger og diagnostiske metoder undersøkt. Her finner du oversikten over kliniske studier ved sykehusene i Norge.
              </p>
              <a className="fs-article__link" href="#">Vil du delta? →</a>
            </article>
            <article className="fs-article">
              <h3 className="fs-article__title">Helfo vurderer tidligere avvisning eller avslag på nytt</h3>
              <p className="fs-article__body">
                Har du tidligere fått avvisning eller avslag fra Helfo på dekning av helseutgifter fordi du sendte inn kravet for sent? Eller lot du være å sende inn et krav fordi du trodde fristen var gått ut? Nå kan du ha rett til en ny vurdering.
              </p>
              <a className="fs-article__link" href="#">Finn ut om du kan ha rett til en ny vurdering →</a>
            </article>
          </div>
        </section>

        {/* ── Search ────────────────────────────────────────────────── */}
        <section className="fs-search-panel">
          <h2 className="fs-search-panel__title">Søk i kvalitetssikret helseinformasjon</h2>
          <div className="fs-search-row">
            <input className="fs-search-input" type="text" aria-label="Søk" />
            <button className="fs-search-btn">Søk</button>
          </div>
          <a className="fs-search-panel__link" href="#">Innhold A til Å →</a>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="fs-footer">
        <div className="fs-footer__top">
          <div className="fs-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <div>
              <p className="fs-footer__link-title">23 32 70 00</p>
              <p className="fs-footer__link-sub">Veiledning helsenorge.no</p>
            </div>
          </div>
          <div className="fs-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="fs-footer__link-title">Hjelp og kontakt</p>
          </div>
          <div className="fs-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div className="fs-footer__lang">
              <span className="fs-footer__link-title">English</span>
              <span className="fs-footer__lang-sep" />
              <span className="fs-footer__link-title">Davvisámegillii</span>
            </div>
          </div>
        </div>
        <div className="fs-footer__divider" />
        <div className="fs-footer__links">
          <a href="#" className="fs-footer__link">Personvern</a>
          <a href="#" className="fs-footer__link">Tilgjengelegheitserklæring</a>
          <a href="#" className="fs-footer__link">Endre samtykke for informasjonskapsler</a>
        </div>
        <div className="fs-footer__divider" />
        <div className="fs-footer__links">
          <a href="#" className="fs-footer__link">Last ned Helsenorge-appen</a>
          <a href="#" className="fs-footer__link">Om Helsenorge</a>
          <a href="#" className="fs-footer__link">Svindelforsøk og trygg bruk av Helsenorge</a>
        </div>
        <div className="fs-footer__divider" />
        <p className="fs-footer__brand">Drives av Norsk helsenett SF</p>
      </footer>
    </div>
  );
}
