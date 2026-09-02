import Button from '@helsenorge/designsystem-react/components/Button';
import './style.css';

export interface IntroPageProps {
  onOpenPrototype: () => void;
}

// Cover screen for the demo — the site's root URL now lands here instead
// of straight on Forside, so a visitor sees this framing before the
// actual prototype. Deliberately standalone (no shared Helsenorge
// header/breadcrumb), unlike every other screen in this app.
export default function IntroPage({ onOpenPrototype }: IntroPageProps) {
  return (
    <div className="intro-page">
      <h1 className="intro-page__title">Psykisk helse på Helsenorge</h1>
      <p className="intro-page__text">
        Følgende prototype illustrerer løsningskonsepter. Tekster og innhold er ikke endelig.
      </p>
      <Button variant="fill" onColor="ondark" arrow="icon" onClick={onOpenPrototype}>
        Åpne prototype
      </Button>
    </div>
  );
}
