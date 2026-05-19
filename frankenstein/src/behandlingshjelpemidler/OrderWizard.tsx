import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
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
  onAbandonRequest: () => void;
  onAbandonConfirm: () => void;
  onAbandonCancel: () => void;
  onSubmit: () => void;
  onGoToStep: (step: 1 | 2 | 3 | 4) => void;
}

const STEP_LABELS = ['Produkter', 'Levering', 'Kommentar', 'Bekreft'];

function WizardBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="wizard-bar">
      <div className="wizard-bar__track">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum <= currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div key={stepNum} style={{ display: 'flex', alignItems: 'center', flex: i < STEP_LABELS.length - 1 ? '1' : undefined }}>
              <div className="wizard-pip">
                <div
                  className={
                    isCurrent
                      ? 'wizard-dot wizard-dot--current'
                      : isActive
                      ? 'wizard-dot wizard-dot--active'
                      : 'wizard-dot'
                  }
                />
                <span
                  className={`wizard-pip__label${isActive ? ' wizard-pip__label--active' : ''}`}
                >
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`wizard-seg${stepNum < currentStep ? ' wizard-seg--active' : ''}`}
                  style={{ flex: 1 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderWizard({
  currentStep,
  originLabel,
  equipment,
  quantities,
  orderedDates,
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
  onAbandonRequest,
  onAbandonConfirm,
  onAbandonCancel,
  onSubmit,
}: OrderWizardProps) {
  const backLabel = originLabel || 'Behandlingshjelpemidler';

  return (
    <>
      <div className="order-nav" style={{ padding: '0 4px' }}>
        <button className="order-nav__back" onClick={currentStep === 1 ? onAbandonRequest : onBack}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>{currentStep === 1 ? backLabel : 'Tilbake'}</span>
        </button>
      </div>
      <hr className="bhm-divider" />

      <WizardBar currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1
          equipment={equipment}
          quantities={quantities}
          orderedDates={orderedDates}
          focusedEqId={focusedEqId}
          onChangeQty={onChangeQty}
          onNext={onNext}
          onBack={onAbandonRequest}
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
