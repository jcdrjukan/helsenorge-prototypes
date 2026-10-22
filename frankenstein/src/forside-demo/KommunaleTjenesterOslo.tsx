import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ArrowUpRight from '@helsenorge/designsystem-react/components/Icons/ArrowUpRight';
import ArrowRight from '@helsenorge/designsystem-react/components/Icons/ArrowRight';
import AnchorLink from '@helsenorge/designsystem-react/components/AnchorLink';
import Button from '@helsenorge/designsystem-react/components/Button';
import Tag from '@helsenorge/designsystem-react/components/Tag';
import VisualRadioCloud from '@helsenorge/designsystem-react/components/VisualRadioCloud';
import Person from '@helsenorge/designsystem-react/components/Icons/Person';
import VideoCamera from '@helsenorge/designsystem-react/components/Icons/VideoCamera';
import FirstAidKit from '@helsenorge/designsystem-react/components/Icons/FirstAidKit';
import HeartHands from '@helsenorge/designsystem-react/components/Icons/HeartHands';
import BeerAndPills from '@helsenorge/designsystem-react/components/Icons/BeerAndPills';
import PersonWithBrain from '@helsenorge/designsystem-react/components/Icons/PersonWithBrain';
import Pregnant from '@helsenorge/designsystem-react/components/Icons/Pregnant';
import Baby from '@helsenorge/designsystem-react/components/Icons/Baby';
import ChildPlaying from '@helsenorge/designsystem-react/components/Icons/ChildPlaying';
import Teenagers from '@helsenorge/designsystem-react/components/Icons/Teenagers';
import Vaccine from '@helsenorge/designsystem-react/components/Icons/Vaccine';
import Home from '@helsenorge/designsystem-react/components/Icons/Home';
import Recovery from '@helsenorge/designsystem-react/components/Icons/Recovery';
import ArmFlexing from '@helsenorge/designsystem-react/components/Icons/ArmFlexing';
import Hospital from '@helsenorge/designsystem-react/components/Icons/Hospital';
import ElderlyPerson from '@helsenorge/designsystem-react/components/Icons/ElderlyPerson';
import Group from '@helsenorge/designsystem-react/components/Icons/Group';
import SpeechBubble from '@helsenorge/designsystem-react/components/Icons/SpeechBubble';
import LightBulb from '@helsenorge/designsystem-react/components/Icons/LightBulb';
import Calendar from '@helsenorge/designsystem-react/components/Icons/Calendar';
import Envelope from '@helsenorge/designsystem-react/components/Icons/Envelope';
import { useState } from 'react';
import type { SvgIcon } from '@helsenorge/designsystem-react/components/Icon';
import {
  KATEGORIER, KATEGORI_LABEL, KONTAKTER, HELSETILBUD,
  type Helsetilbud, type IkonNavn, type Kategori,
} from './kommunaleHelsetilbud';
import './style.css';

export interface KommunaleTjenesterOsloProps {
  onNavigateBack: () => void;
}


const IKONER: Record<IkonNavn, SvgIcon> = {
  person: Person, video: VideoCamera, legevakt: FirstAidKit, psykisk: HeartHands,
  rus: BeerAndPills, friskliv: PersonWithBrain, svangerskap: Pregnant, barn: Baby,
  skole: ChildPlaying, ungdom: Teenagers, vaksine: Vaccine, hjem: Home, rehab: Recovery,
  fysio: ArmFlexing, korttid: Hospital, demens: ElderlyPerson, barnekoord: Group,
  logoped: SpeechBubble, mestring: LightBulb,
};

const KOMMUNE_URL = 'https://www.oslo.kommune.no/';

function Tittel({ t }: { t: Helsetilbud }) {
  return (
    <span className="kt-item__head">
      <span className="kt-item__title">{t.title}</span>
      <span className="kt-item__desc">{t.desc}</span>
      {t.tags && t.tags.length > 0 && (
        <span className="kt-item__tags">
          {t.tags.map(k => <Tag key={k}>{KATEGORI_LABEL[k]}</Tag>)}
        </span>
      )}
    </span>
  );
}

// Opened card: what the offer helps with, how to get it, contact details,
// links and actions, in that order (drawing 5a).
function Innhold({ t }: { t: Helsetilbud }) {
  return (
    <div className="kt-body">
      {t.sections.map((sec, i) => (
        <div key={sec.heading}>
          <h3 className="kt-body__h">{sec.heading}</h3>
          {sec.text.map(p => <p key={p} className="kt-body__p">{p}</p>)}
          {i === 0 && t.underTilbud && (
            <div className="kt-body__under">
              <h3 className="kt-body__h">Dette tilbyr kommunen din</h3>
              <ul className="kt-under-list">
                {t.underTilbud.map(u => (
                  <li key={u.title}>
                    <span className="kt-under-list__title">{u.title}</span>
                    <span className="kt-body__p">{u.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      {t.contact && (
        <dl className="kt-contact">
          {t.contact.map(c => (
            <div key={c.label}>
              <dt>{c.label}:</dt>{' '}
              <dd>{c.href ? <a href={c.href}>{c.value}</a> : c.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {t.links && (
        <div className="kt-links">
          {t.links.map(l => l.external
            ? <AnchorLink key={l.text} href={KOMMUNE_URL} target="_blank">{l.text}</AnchorLink>
            : <AnchorLink key={l.text} href="#" onClick={e => e?.preventDefault()}>{l.text}</AnchorLink>)}
        </div>
      )}
      {t.buttons && (
        <div className="kt-buttons">
          {t.buttons.map(b => (
            <Button key={b.text} onClick={() => {}}>
              <Icon svgIcon={b.icon === 'kalender' ? Calendar : Envelope} />
              {b.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

// Destination for the "Kommunale tjenester" links on the Artikkel page and
// Psykisk helse. Layout and content from drawing 5a (kommunale-helsetilbud.html).
export default function KommunaleTjenesterOslo({ onNavigateBack }: KommunaleTjenesterOsloProps) {
  // One category at a time ('alle' = no filter), drawing 5a.
  const [kategori, setKategori] = useState<'alle' | Kategori>('alle');
  const antall = (k: 'alle' | Kategori) => k === 'alle' ? HELSETILBUD.length : HELSETILBUD.filter(t => t.tags?.includes(k)).length;
  const synlige = kategori === 'alle' ? HELSETILBUD : HELSETILBUD.filter(t => t.tags?.includes(kategori));

  return (
    <div className="fs-shell">
      {/* "Konseptskisse" banner removed 2026-10-22 (user request). */}

      <header className="header">
        <div className="top-bar">
          <Logo size={80} />
          <nav className="top-nav">
            <button className="nav-icon-btn" aria-label="Åpne meny">
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

      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={onNavigateBack}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Tilbake</span>
        </button>
      </nav>
      <hr className="page-divider" />

      <main className="fs-page">
        {/* Title + ingress since 2026-10-22 (user request); was "Psykisk helse
            tjenestetilbud i Oslo kommune" with no ingress. */}
        <div className="kt-intro">
          <h1 className="fs-h1">Helsetjenester kommunen tilbyr</h1>
          <p className="kt-ingress">
            For å få en helhetlig oversikt over alle helsetjenester Oslo kommune tilbyr, gå til{' '}
            <a className="kt-ingress__link" href="https://www.oslo.kommune.no/" target="_blank" rel="noopener noreferrer">
              kommunenes nettsider<Icon svgIcon={ArrowUpRight} size={24} color="#06596C" />
            </a>
          </p>
        </div>

        {/* Rebuilt from drawing 5a in kommunale-helsetilbud.html (2026-10-22). */}
        <section className="kt-section" aria-labelledby="kt-kontakter">
          <h2 className="kt-h2" id="kt-kontakter">Dine kontakter</h2>
          <ExpanderList variant="fill" color="blueberry" className="kt-kontakter">
            {KONTAKTER.map(t => (
              <ExpanderList.Expander key={t.id} title={<Tittel t={t} />} icon={<Icon svgIcon={IKONER[t.icon]} size={38} />}>
                <Innhold t={t} />
              </ExpanderList.Expander>
            ))}
          </ExpanderList>
          <AnchorLink href="#" onClick={e => e?.preventDefault()} className="kt-arrow-link">
            Se alle dine helsekontakter<Icon svgIcon={ArrowRight} size={24} color="#06596C" />
          </AnchorLink>
        </section>

        <section className="kt-section" aria-labelledby="kt-andre">
          <h2 className="kt-h2" id="kt-andre">Andre helsetilbud i kommunen</h2>
          <VisualRadioCloud
            name="kt-kategori"
            value={kategori}
            onChange={(_e, v) => setKategori(v as 'alle' | Kategori)}
            aria-labelledby="kt-andre"
            className="kt-chips"
          >
            {[{ id: 'alle' as const, label: 'Alle helsetilbud' }, ...KATEGORIER].map(k => (
              <VisualRadioCloud.Radio key={k.id} value={k.id}>
                {k.label}<span className="kt-sr-only"> ({antall(k.id)} tilbud)</span>
              </VisualRadioCloud.Radio>
            ))}
          </VisualRadioCloud>
          <p className="kt-count" aria-live="polite">{synlige.length} tilbud</p>
          <ExpanderList variant="line" color="white" className="kt-tilbud">
            {synlige.map(t => (
              <ExpanderList.Expander key={t.id} title={<Tittel t={t} />} icon={<Icon svgIcon={IKONER[t.icon]} size={38} />}>
                <Innhold t={t} />
              </ExpanderList.Expander>
            ))}
          </ExpanderList>
        </section>
      </main>
    </div>
  );
}
