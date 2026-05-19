import Select from '@helsenorge/designsystem-react/components/Select';
import Input from '@helsenorge/designsystem-react/components/Input';
import type { DeliveryForm } from './data';

interface Step2Props {
  delivery: DeliveryForm;
  errors: Partial<Record<keyof DeliveryForm, string>>;
  onChange: (field: keyof DeliveryForm, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2({ delivery, errors, onChange, onNext, onBack }: Step2Props) {
  return (
    <div className="order-step">
      <h2 className="order-step__title">Leveringsdetaljer</h2>

      <Select
        label="Leveringsmåte"
        selectId="deliverySelect"
        value={delivery.mode}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('mode', e.target.value)}
      >
        <option value="post">Send i posten</option>
        <option value="hentes">Hentes på lager</option>
        <option value="hentes2">Hentes på sykehus</option>
      </Select>

      {delivery.mode === 'post' && (
        <div className="delivery-address-form">
          <span className="field-tag field-tag--required">Alle felt må fylles ut</span>

          <Input
            label="Fullt navn"
            inputId="deliveryNavn"
            value={delivery.navn}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('navn', e.target.value)}
            error={!!errors.navn}
            errorText={errors.navn}
            placeholder="Fornavn Etternavn"
          />

          <Input
            label="Gateadresse"
            inputId="deliveryGate"
            value={delivery.gate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('gate', e.target.value)}
            error={!!errors.gate}
            errorText={errors.gate}
            placeholder="Gatenavn og husnummer"
          />

          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <div style={{ flex: '0 0 100px' }}>
              <Input
                label="Postnr."
                inputId="deliveryPostnr"
                value={delivery.postnr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('postnr', e.target.value)}
                error={!!errors.postnr}
                errorText={errors.postnr}
                placeholder="0000"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label="Poststed"
                inputId="deliverySted"
                value={delivery.sted}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('sted', e.target.value)}
                error={!!errors.sted}
                errorText={errors.sted}
                placeholder="Poststed"
              />
            </div>
          </div>

          <Input
            label="Telefonnummer"
            inputId="deliveryTelefon"
            value={delivery.telefon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('telefon', e.target.value)}
            error={!!errors.telefon}
            errorText={errors.telefon}
            placeholder="8 siffer"
            type="tel"
          />
        </div>
      )}

      {delivery.mode === 'hentes' && (
        <div style={{ marginTop: 'var(--space-s)', padding: 'var(--space-xs) var(--space-s)', background: 'var(--neutral-50)', borderRadius: 'var(--radius-m)', border: '1px solid var(--neutral-200)' }}>
          <p style={{ font: 'var(--mobile-sublabel)', color: 'var(--color-base-text-onlight)', margin: 0 }}>
            Medisinsk utstyrssentralen
          </p>
          <p style={{ font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight-subdued)', margin: '4px 0 0 0' }}>
            St. Olavs sykehus, Øst for Eir-bygget<br />
            Åpningstider: Man–fre 08:00–15:30
          </p>
        </div>
      )}

      {delivery.mode === 'hentes2' && (
        <div style={{ marginTop: 'var(--space-s)', padding: 'var(--space-xs) var(--space-s)', background: 'var(--neutral-50)', borderRadius: 'var(--radius-m)', border: '1px solid var(--neutral-200)' }}>
          <p style={{ font: 'var(--mobile-sublabel)', color: 'var(--color-base-text-onlight)', margin: 0 }}>
            Poliklinisk skranke
          </p>
          <p style={{ font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight-subdued)', margin: '4px 0 0 0' }}>
            St. Olavs sykehus, Hjerte-lunge-senteret<br />
            Åpningstider: Man–fre 08:00–15:00
          </p>
        </div>
      )}

      <div className="order-step__actions">
        <button className="btn-primary" onClick={onNext}>
          Neste: Kommentar
        </button>
        <button className="btn-outline" onClick={onBack}>
          Tilbake
        </button>
      </div>
    </div>
  );
}
