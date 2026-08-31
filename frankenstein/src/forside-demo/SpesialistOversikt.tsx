import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import DotQuestionMark from '@helsenorge/designsystem-react/components/Icons/DotQuestionMark';
import MentalHealthChild from '@helsenorge/designsystem-react/components/Icons/MentalHealthChild';
import MentalHealthAdult from '@helsenorge/designsystem-react/components/Icons/MentalHealthAdult';
import BeerAndPills from '@helsenorge/designsystem-react/components/Icons/BeerAndPills';
import type { SvgIcon } from '@helsenorge/designsystem-react/components/Icon';
import './style.css';

export interface SpesialistOversiktProps {
  onNavigateBack: () => void;
}

interface Behandlingsgruppe {
  title: string;
  icon: SvgIcon;
  items: string[];
}

// Transcribed from https://www.figma.com/design/OOhkNC18f5jrwa1C3TT4wV/Psykisk-helse?node-id=333-3684
// ("Behandlinger og undersøkelser med ventetider") — the Figma node itself
// is a single flattened screenshot (no real layer structure to pull code
// from), so this is a faithful manual recreation using this project's own
// design-system components rather than an extracted/adapted export.
const GRUPPER: Behandlingsgruppe[] = [
  {
    title: 'Psykisk helse, barn og unge',
    icon: MentalHealthChild,
    items: [
      'Angstlidelser, barn og unge',
      'Atferds- og følelsesmessige forstyrrelser, barn og unge',
      'Bipolar lidelse, barn og unge',
      'Depressiv lidelse, barn og unge',
      'Hyperaktivitet og konsentrasjonsvansker (ADHD), barn og unge',
      'Psykoselidelse, barn og unge',
      'Samtidige alvorlige psykiske lidelser og rusmiddelproblemer, psykisk helsevern, barn og unge',
      'Spilleavhengighet, psykisk helsevern, barn og unge',
      'Spiseforstyrrelser, barn og unge',
    ],
  },
  {
    title: 'Psykisk helse, voksne',
    icon: MentalHealthAdult,
    items: [
      'Alderspsykiatri',
      'Angst, fobier, tvangslidelser, traumelidelser, voksne',
      'Atferdsforstyrrelser, hyperaktivitet og konsentrasjonsvansker (ADHD), voksne',
      'Bipolar lidelse, voksne',
      'Depressiv lidelse, voksne',
      'Komplekse traumer/dissosiative lidelser, voksne',
      'Personlighetsforstyrrelser, voksne',
      'Psykoselidelse, voksne',
      'Samtidige alvorlige psykiske lidelser og rusmiddelproblemer (ROP-lidelser), psykisk helsevern, voksne',
      'Spilleavhengighet, psykisk helsevern, voksne',
      'Spiseforstyrrelser, voksne',
      'Tilpasningsforstyrrelser, voksne',
    ],
  },
  {
    title: 'Rus og avhengighet',
    icon: BeerAndPills,
    items: [
      'Alkoholproblemer, rus- og avhengighetsbehandling',
      'Dopingproblemer, rus- og avhengighetsbehandling',
      'Legemiddelassistert rehabilitering (LAR)',
      'Problemer med illegale rusmidler, rus- og avhengighetsbehandling',
      'Problemer med vanedannende legemidler, rus- og avhengighetsbehandling',
      'Samtidige alvorlige rusmiddelproblemer og psykiske lidelser (ROP-lidelser), rus- og avhengighetsbehandling',
      'Spilleavhengighet, rus- og avhengighetsbehandling',
      'Tilbakehold i institusjon på grunnlag av samtykke, rus- og avhengighetsbehandling',
      'Tvang overfor gravide med rusmiddelproblemer, rus- og avhengighetsbehandling',
      'Tvang overfor personer med rusmiddelproblemer, rus- og avhengighetsbehandling',
    ],
  },
];

export default function SpesialistOversikt({ onNavigateBack }: SpesialistOversiktProps) {
  return (
    <div className="fs-shell">

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
        <h1 className="fs-h1 spesialist-title">
          Behandlinger og undersøkelser med ventetider
          <Icon svgIcon={DotQuestionMark} size={24} color="#5B22A6" />
        </h1>

        <div className="spesialist-search">
          <label htmlFor="spesialist-search-input" className="spesialist-search__label">
            Søk etter behandlinger, for eksempel røntgen eller allergiutredning
          </label>
          <input id="spesialist-search-input" type="text" className="spesialist-search__input" />
        </div>

        <h2 className="fs-section-title">Psykisk helse, rus og avhengighet</h2>

        <ExpanderList variant="line">
          {GRUPPER.map(g => (
            <ExpanderList.Expander
              key={g.title}
              title={g.title}
              icon={<Icon svgIcon={g.icon} size={32} />}
              expanded
            >
              <ul className="spesialist-liste">
                {g.items.map(item => (
                  <li key={item}>
                    <a href="#" className="spesialist-link">{item}</a>
                  </li>
                ))}
              </ul>
            </ExpanderList.Expander>
          ))}
        </ExpanderList>
      </main>
    </div>
  );
}
