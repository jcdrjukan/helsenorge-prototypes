interface Step3Props {
  comment: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3({ comment, onChange, onNext, onBack }: Step3Props) {
  return (
    <div className="order-step">
      <h2 className="order-step__title">Kommentar</h2>
      <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)', margin: '0 0 var(--space-s) 0', fontSize: '1rem' }}>
        Vil du legge inn en kommentar til bestillingen?
      </p>

      <div className="form-field">
        <label className="form-field__label" htmlFor="orderComment">
          Kommentar (valgfritt)
        </label>
        <textarea
          id="orderComment"
          className="form-field__textarea"
          value={comment}
          onChange={e => onChange(e.target.value)}
          placeholder="Skriv inn eventuelle kommentarer her..."
          rows={4}
        />
      </div>

      <div className="order-step__actions">
        <button className="btn-primary" onClick={onNext}>
          Neste: Oppsummering
        </button>
        <button className="btn-outline" onClick={onBack}>
          Tilbake
        </button>
      </div>
    </div>
  );
}
