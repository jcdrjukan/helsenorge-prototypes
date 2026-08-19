import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import NotificationPanel from '@helsenorge/designsystem-react/components/NotificationPanel';
import Button from '@helsenorge/designsystem-react/components/Button';

interface CannotOrderViewProps {
  onBack: () => void;
}

export default function CannotOrderView({ onBack }: CannotOrderViewProps) {
  return (
    <>
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={onBack}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Behandlingshjelpemidler</span>
        </button>
      </nav>
      <hr className="page-divider" />
      <div className="bhm-page-content">
        <NotificationPanel variant="info" label="Du kan ikke bestille mer forbruksmateriell">
          <p style={{ margin: 0 }}>
            Alt tilgjengelig forbruksmateriell ligger allerede i en aktiv bestilling.
          </p>
        </NotificationPanel>

        <div style={{ marginTop: 'var(--space-m)' }}>
          <Button variant="outline" onClick={onBack}><Icon svgIcon={ArrowLeft} />Tilbake</Button>
        </div>
      </div>
    </>
  );
}
