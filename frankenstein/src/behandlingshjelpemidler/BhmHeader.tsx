import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';

export default function BhmHeader() {
  return (
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
        <Avatar className="bhm-avatar" color="blueberry" size="xsmall">Tora Hansen</Avatar>
        <span className="profile-bar__name">Tora Hansen</span>
        <Icon svgIcon={ChevronDown} size={38} />
      </button>
    </header>
  );
}
