import Button from '@helsenorge/designsystem-react/components/Button';
import StepButtons from '@helsenorge/designsystem-react/components/StepButtons/StepButtons';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';

interface Step3Props {
  comment: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3({ comment, onChange, onNext, onBack }: Step3Props) {
  return (
    <div className="order-step">
      <h2 className="order-step__title">Noe du vil legge til?</h2>

      <div className="form-field">
        <label className="form-field__label" htmlFor="orderComment">
          Kommentar til bestillingen
        </label>
        <textarea
          id="orderComment"
          className="form-field__textarea"
          value={comment}
          onChange={e => onChange(e.target.value)}
          rows={4}
        />
      </div>

      <StepButtons
        forwardButton={<Button onClick={onNext} arrow="icon">Neste</Button>}
        backButton={<Button onClick={onBack}><Icon svgIcon={ArrowLeft} />Tilbake</Button>}
      />
    </div>
  );
}
