import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';

export default function BhmHeader() {
  return (
    <header className="bhm-header">
      <div className="bhm-header__top">
        <Logo size={80} />
        <nav className="bhm-top-nav">
          <button className="bhm-icon-btn" aria-label="Åpne meny">
            <Icon svgIcon={Menu} size={38} />
            <span className="bhm-icon-btn__label">Meny</span>
          </button>
          <button className="bhm-icon-btn" aria-label="Varsler">
            <Icon svgIcon={Bell} size={38} />
            <span className="bhm-icon-btn__label">Varsler</span>
          </button>
          <button className="bhm-icon-btn" aria-label="Logg ut">
            <Icon svgIcon={Logout} size={38} />
            <span className="bhm-icon-btn__label">Logg ut</span>
          </button>
        </nav>
      </div>
      <button className="bhm-profile-bar" aria-label="Brukermeny">
        <Avatar color="blueberry" size="xsmall">Tore Hansen</Avatar>
        <span className="bhm-profile-bar__name">Tore Hansen</span>
        <Icon svgIcon={ChevronDown} size={38} />
      </button>
    </header>
  );
}
