import Select from '@helsenorge/designsystem-react/components/Select';
import Input from '@helsenorge/designsystem-react/components/Input';
import FormFieldTag from '@helsenorge/designsystem-react/components/FormFieldTag';
import Label from '@helsenorge/designsystem-react/components/Label';
import Panel from '@helsenorge/designsystem-react/components/Panel';
import { PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import Button from '@helsenorge/designsystem-react/components/Button';
import StepButtons from '@helsenorge/designsystem-react/components/StepButtons/StepButtons';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import PlusSmall from '@helsenorge/designsystem-react/components/Icons/PlusSmall';
import { useEffect, useRef, useState } from 'react';

/** C/O field variants to compare (2026-10-16). Pick one with ?co=… in the
 *  URL (before the #): "legg-til" (default) hides the field behind an
 *  "Legg til c/o-adresse" button; "synlig" always shows it (previous). */
type CoVariant = 'legg-til' | 'synlig';
const CO_VARIANT: CoVariant =
  new URLSearchParams(window.location.search).get('co') === 'synlig' ? 'synlig' : 'legg-til';
import { PICKUP_LOCATIONS, LEVERINGSMATE, tilAdresse, type DeliveryForm, type DeliveryMode } from './data';

interface Step2Props {
  delivery: DeliveryForm;
  errors: Partial<Record<keyof DeliveryForm, string>>;
  onChange: (field: keyof DeliveryForm, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onAbandonRequest: () => void;
}

export default function Step2({ delivery, errors, onChange, onNext, onBack, onAbandonRequest }: Step2Props) {
  // "legg-til": hidden until asked for — but kept open if it already has a value.
  const [visCo, setVisCo] = useState(CO_VARIANT === 'synlig' || delivery.co.trim() !== '');
  const fokuserCo = useRef(false);
  useEffect(() => {
    if (visCo && fokuserCo.current) { fokuserCo.current = false; document.getElementById('deliveryCo')?.focus(); }
  }, [visCo]);
  return (
    <div className="order-step">
      <h2 className="order-step__title">Leveringsdetaljer</h2>

      <div style={{ marginBottom: 'var(--space-s)' }}>
        <Select
          label="Leveringsmåte"
          selectId="deliverySelect"
          value={delivery.mode}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('mode', e.target.value)}
        >
          {(Object.keys(LEVERINGSMATE) as DeliveryMode[]).map(m => (
            <option key={m} value={m}>{LEVERINGSMATE[m]}</option>
          ))}
        </Select>
      </div>

      {tilAdresse(delivery.mode) && (
        <div className="delivery-address-form">
          {/* The logged-in user is the only possible recipient: name shown, not editable. */}
          <div className="delivery-address-form__fixed">
            <Label htmlMarkup="span" labelId="deliveryNavnLabel" labelTexts={[{ text: 'Navn' }]} />
            <p className="delivery-address-form__value" aria-labelledby="deliveryNavnLabel">{delivery.navn}</p>
          </div>

          {visCo ? (
            <Input
              label={<Label htmlFor="deliveryCo" labelTexts={[{ text: 'C/O' }]} formFieldTag={<FormFieldTag level="optional" />} />}
              inputId="deliveryCo"
              value={delivery.co}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('co', e.target.value)}
            />
          ) : (
            <div>
              <Button variant="borderless" onClick={() => { fokuserCo.current = true; setVisCo(true); }}>
                <Icon svgIcon={PlusSmall} />
                Legg til c/o-adresse
              </Button>
            </div>
          )}

          <Input
            label="Gateadresse"
            inputId="deliveryGate"
            value={delivery.gate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('gate', e.target.value)}
            error={!!errors.gate}
            errorText={errors.gate}
            placeholder="Gatenavn og husnummer"
          />

          <Input
            label="Postnr."
            inputId="deliveryPostnr"
            value={delivery.postnr}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('postnr', e.target.value)}
            error={!!errors.postnr}
            errorText={errors.postnr}
            placeholder="0000"
            width={4}
          />

          <Input
            label="Poststed"
            inputId="deliverySted"
            value={delivery.sted}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('sted', e.target.value)}
            error={!!errors.sted}
            errorText={errors.sted}
            placeholder="Poststed"
            width={28}
          />

          <Input
            label="Telefonnummer"
            inputId="deliveryTelefon"
            value={delivery.telefon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('telefon', e.target.value)}
            error={!!errors.telefon}
            errorText={errors.telefon}
            placeholder="8 siffer"
            type="tel"
            width={16}
          />
        </div>
      )}

      {(delivery.mode === 'hentes' || delivery.mode === 'hentes2') && (() => {
        const loc = PICKUP_LOCATIONS[delivery.mode];
        return (
          <Panel variant={PanelVariant.outline}>
            <Panel.A>
              <p style={{ font: 'var(--mobile-label)', margin: '0 0 4px 0' }}>{loc.name}</p>
              <p style={{ font: 'var(--mobile-label-subdued)', color: 'var(--color-base-text-onlight-subdued)', margin: 0 }}>
                {loc.gate}<br />
                {loc.postnr} {loc.sted}<br />
                Telefon: {loc.telefon}
              </p>
            </Panel.A>
          </Panel>
        );
      })()}

      <StepButtons
        forwardButton={<Button onClick={onNext} arrow="icon">Neste</Button>}
        backButton={<Button onClick={onBack}><Icon svgIcon={ArrowLeft} />Tilbake</Button>}
        cancelButton={<Button onClick={onAbandonRequest}>Avbryt</Button>}
      />
    </div>
  );
}
