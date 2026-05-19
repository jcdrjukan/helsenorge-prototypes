import type { Equipment, DeliveryForm } from './data';

interface Step4Props {
  equipment: Equipment[];
  quantities: Record<string, number[]>;
  delivery: DeliveryForm;
  comment: string;
  onSubmit: () => void;
  onBack: () => void;
}

function deliveryLabel(mode: string, delivery: DeliveryForm): string {
  if (mode === 'post') {
    const parts = [delivery.gate, `${delivery.postnr} ${delivery.sted}`.trim()].filter(Boolean);
    return parts.join(', ');
  }
  if (mode === 'hentes') return 'Hentes på lager – St. Olavs sykehus';
  if (mode === 'hentes2') return 'Hentes på sykehus – poliklinisk skranke';
  return '';
}

export default function Step4({ equipment, quantities, delivery, comment, onSubmit, onBack }: Step4Props) {
  const selectedItems: { eqName: string; consumableName: string; qty: number }[] = [];

  for (const eq of equipment) {
    if (eq.deaktivert) continue;
    const qtys = quantities[eq.id] ?? [];
    eq.consumables.forEach((c, i) => {
      const qty = qtys[i] ?? 0;
      if (qty > 0) {
        selectedItems.push({ eqName: eq.model, consumableName: c.name, qty });
      }
    });
  }

  return (
    <div className="order-step">
      <h2 className="order-step__title">Oppsummering</h2>
      <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)', margin: '0 0 var(--space-s) 0', fontSize: '1rem' }}>
        Sjekk at alt stemmer før du sender bestillingen.
      </p>

      {/* Forbruksvarer */}
      <div className="summary-section">
        <div className="summary-section__header">Forbruksvarer</div>
        <div className="summary-section__body">
          {selectedItems.length === 0 ? (
            <p style={{ font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight-subdued)', margin: 0 }}>
              Ingen produkter valgt.
            </p>
          ) : (
            <ul className="order-summary-list">
              {selectedItems.map((item, i) => (
                <li key={i}>
                  <span>
                    <span style={{ fontWeight: 600 }}>{item.consumableName}</span>
                    {' '}× {item.qty}
                    <span style={{ color: 'var(--color-base-text-onlight-subdued)', fontWeight: 400 }}>
                      {' '}({item.eqName})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Levering */}
      <div className="summary-section">
        <div className="summary-section__header">Levering</div>
        <div className="summary-section__body">
          <div className="duolist">
            <div className="duolist__row">
              <span className="duolist__key">Leveringsmåte</span>
              <span className="duolist__value">
                {delivery.mode === 'post' && 'Post'}
                {delivery.mode === 'hentes' && 'Hentes på lager'}
                {delivery.mode === 'hentes2' && 'Hentes på sykehus'}
              </span>
            </div>
            {delivery.mode === 'post' && delivery.navn && (
              <div className="duolist__row">
                <span className="duolist__key">Navn</span>
                <span className="duolist__value">{delivery.navn}</span>
              </div>
            )}
            <div className="duolist__row">
              <span className="duolist__key">Adresse</span>
              <span className="duolist__value">{deliveryLabel(delivery.mode, delivery)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Telefon */}
      {delivery.telefon && (
        <div className="summary-section">
          <div className="summary-section__header">Telefon</div>
          <div className="summary-section__body">
            <span style={{ font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight)' }}>
              {delivery.telefon}
            </span>
          </div>
        </div>
      )}

      {/* Kommentar */}
      {comment && (
        <div className="summary-section">
          <div className="summary-section__header">Kommentar</div>
          <div className="summary-section__body">
            <p style={{ font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight)', margin: 0 }}>
              {comment}
            </p>
          </div>
        </div>
      )}

      <div className="order-step__actions">
        <button className="btn-primary" onClick={onSubmit}>
          Bekreft og send bestilling
        </button>
        <button className="btn-outline" onClick={onBack}>
          Endre bestilling
        </button>
      </div>
    </div>
  );
}
