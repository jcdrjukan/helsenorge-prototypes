import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Stepper from '@helsenorge/designsystem-react/components/Stepper';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import type { Equipment, DeliveryForm } from './data';

interface OrderWizardProps {
  currentStep: 1 | 2 | 3 | 4;
  originLabel: string;
  equipment: Equipment[];
  quantities: Record<string, number[]>;
  orderedDates: Record<string, Date>;
  activeOrderKeys: Set<string>;
  focusedEqId: string | null;
  delivery: DeliveryForm;
  deliveryErrors: Partial<Record<keyof DeliveryForm, string>>;
  comment: string;
  showAbandonAlert: boolean;
  onChangeQty: (eqId: string, idx: number, delta: number) => void;
  onDeliveryChange: (field: keyof DeliveryForm, value: string) => void;
  onCommentChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
  onNoProductsAvailable: () => void;
  onAbandonRequest: () => void;
  onAbandonConfirm: () => void;
  onAbandonCancel: () => void;
  onSubmit: () => void;
  onGoToStep: (step: 1 | 2 | 3 | 4) => void;
}


export default function OrderWizard({
  currentStep,
  originLabel,
  equipment,
  quantities,
  orderedDates,
  activeOrderKeys,
  focusedEqId,
  delivery,
  deliveryErrors,
  comment,
  showAbandonAlert,
  onChangeQty,
  onDeliveryChange,
  onCommentChange,
  onNext,
  onBack,
  onNoProductsAvailable,
  onAbandonRequest,
  onAbandonConfirm,
  onAbandonCancel,
  onSubmit,
}: OrderWizardProps) {
  const backLabel = originLabel || 'Behandlingshjelpemidler';

  return (
    <>
      <div className="order-nav" style={{ padding: '0 4px' }}>
        <button className="order-nav__back" onClick={onAbandonRequest}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>{backLabel}</span>
        </button>
      </div>
      <hr className="bhm-divider" />

      <div style={{ padding: '0 var(--space-s)' }}>
        <Stepper value={currentStep} min={1} max={4} ariaLabel="Bestillingssteg" />
      </div>

      {currentStep === 1 && (
        <Step1
          equipment={equipment}
          quantities={quantities}
          orderedDates={orderedDates}
          activeOrderKeys={activeOrderKeys}
          focusedEqId={focusedEqId}
          onChangeQty={onChangeQty}
          onNext={onNext}
          onBack={onAbandonRequest}
          onNoProductsAvailable={onNoProductsAvailable}
        />
      )}
      {currentStep === 2 && (
        <Step2
          delivery={delivery}
          errors={deliveryErrors}
          onChange={onDeliveryChange}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {currentStep === 3 && (
        <Step3
          comment={comment}
          onChange={onCommentChange}
          onNext={onNext}
          onBack={onBack}
        />
      )}
      {currentStep === 4 && (
        <Step4
          equipment={equipment}
          quantities={quantities}
          delivery={delivery}
          comment={comment}
          onSubmit={onSubmit}
          onBack={onBack}
        />
      )}

      {/* Abandon alert overlay */}
      {showAbandonAlert && (
        <div className="ios-alert-overlay">
          <div className="ios-alert">
            <p className="ios-alert__title">Avbryt bestilling?</p>
            <p className="ios-alert__msg">
              Endringene dine vil ikke bli lagret hvis du avbryter nå.
            </p>
            <div className="ios-alert__actions">
              <button className="ios-alert__btn" onClick={onAbandonCancel}>
                Fortsett
              </button>
              <button className="ios-alert__btn ios-alert__btn--destructive" onClick={onAbandonConfirm}>
                Avbryt bestilling
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
