import { useState, useEffect } from 'react';
import ForsideDemo from './forside-demo';
import PsykiskHelseDemo from './psykisk-helse-demo';
import { applyPrototypeMeta } from './prototypeMeta';
import './App.css';

// psykiskhelse-demo branch: a deliberately minimal App.tsx with only two
// prototypes — standalone copies of Forside and Psykisk helse, kept
// disconnected from one another (see forside-demo/index.tsx and
// psykisk-helse-demo/index.tsx). No shared state, no navigation between
// them: ForsideDemo's onGoToTjeneste is a no-op, and PsykiskHelseDemo gets
// no onNavigateHome, so its "Forside" breadcrumb/Avslutt flow just goes
// back to its own front page instead of leaving the prototype.
type Prototype = 'forside-demo' | 'psykisk-helse-demo';

function getInitialPrototype(): Prototype {
  const hash = window.location.hash.slice(1);
  if (hash === 'psykisk-helse-demo') return 'psykisk-helse-demo';
  return 'forside-demo';
}

function App() {
  const [prototype, setPrototype] = useState<Prototype>(getInitialPrototype);

  useEffect(() => {
    applyPrototypeMeta(prototype);
  }, [prototype]);

  const switchPrototype = (p: Prototype) => {
    setPrototype(p);
    window.location.hash = p;
  };

  return (
    <div className="phone-wrapper">
      <div className="prototype-switcher">
        <span className="prototype-switcher__label">Prototype:</span>
        <button
          className={`prototype-switcher__btn${prototype === 'forside-demo' ? ' prototype-switcher__btn--active' : ''}`}
          onClick={() => switchPrototype('forside-demo')}
        >
          Forside
        </button>
        <button
          className={`prototype-switcher__btn${prototype === 'psykisk-helse-demo' ? ' prototype-switcher__btn--active' : ''}`}
          onClick={() => switchPrototype('psykisk-helse-demo')}
        >
          Psykisk helse
        </button>
      </div>

      <div className="phone-frame">
        <div className="phone-frame__screen">
          {prototype === 'forside-demo' && <ForsideDemo onGoToTjeneste={() => {}} />}
          {prototype === 'psykisk-helse-demo' && <PsykiskHelseDemo />}
        </div>
        <div className="phone-frame__home" />
      </div>
    </div>
  );
}

export default App;
