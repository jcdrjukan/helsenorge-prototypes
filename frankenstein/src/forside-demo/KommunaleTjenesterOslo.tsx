import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import './style.css';

export interface KommunaleTjenesterOsloProps {
  onNavigateBack: () => void;
}

const SEKSJONER = [
  {
    title: 'Kortvarige og moderate psykiske utfordringer',
    text: 'Lavterskeltilbud og tjenester for deg med milde til moderate psykiske utfordringer.',
  },
  {
    title: 'Langvarige og alvorlige psykiske utfordringer',
    text: 'Tilbud og tjenester for deg med alvorlige og langvarige psykiske utfordringer.',
  },
  {
    title: 'Psykisk helsehjelp til barn, unge og familier',
    text: 'Tilbud og tjenester for barn, ungdom og familier som trenger psykisk helsehjelp.',
  },
  {
    title: 'Akutt psykisk helsehjelp',
    text: 'Ved alvorlig depresjon, selvmordsfare, psykose og forvirring kan du kontakte legevakta.',
  },
  {
    title: 'Selvmordstanker og selvmord',
    text: 'Råd og informasjon enten du selv har selvmordstanker, eller er bekymret for noen du kjenner.',
  },
  {
    title: 'TryggEst - Vern for risikoutsatte voksne',
    text: 'Hva er TryggEst? Kontaktinformasjon til bydeler med TryggEst-team.',
  },
];

// Placeholder destination for the "Kommunale tjenester" links on both the
// Artikkel page and Psykisk helse's "Ta kontakt" section — content TBD
// beyond the title and this section overview.
export default function KommunaleTjenesterOslo({ onNavigateBack }: KommunaleTjenesterOsloProps) {
  return (
    <div className="fs-shell">

      <div className="illustration-banner">
        Kun konseptskisse
      </div>

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
        <h1 className="fs-h1">Psykisk helse tjenestetilbud i Oslo kommune</h1>

        <ExpanderList variant="outline">
          {SEKSJONER.map(s => (
            <ExpanderList.Expander key={s.title} title={s.title}>
              <p className="fs-article__body">{s.text}</p>
            </ExpanderList.Expander>
          ))}
        </ExpanderList>
      </main>
    </div>
  );
}
