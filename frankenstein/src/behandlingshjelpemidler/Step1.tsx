import { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import type { Equipment } from './data';
import { EQUIPMENT_ICON } from './data';

interface Step1Props {
  equipment: Equipment[];
  quantities: Record<string, number[]>;
  orderedDates: Record<string, Date>;
  focusedEqId: string | null;
  onChangeQty: (eqId: string, idx: number, delta: number) => void;
  onNext: () => void;
  onBack: () => void;
}

function getUnavailableUntil(c: { nextOrderDate?: string }, orderedDates: Record<string, Date>, key: string): Date | null {
  if (orderedDates[key]) {
    const ordered = orderedDates[key];
    const cutoff = new Date(ordered.getTime() + 90 * 24 * 3600000);
    if (cutoff > new Date()) return cutoff;
  }
  if (c.nextOrderDate) {
    const next = new Date(c.nextOrderDate);
    if (next > new Date()) return next;
  }
  return null;
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface MachineAccordionProps {
  eq: Equipment;
  quantities: number[];
  orderedDates: Record<string, Date>;
  initialOpen: boolean;
  onChangeQty: (idx: number, delta: number) => void;
}

function MachineAccordion({ eq, quantities, orderedDates, initialOpen, onChangeQty }: MachineAccordionProps) {
  const [open, setOpen] = useState(initialOpen);

  const totalSelected = quantities.reduce((a, b) => a + b, 0);

  return (
    <div className={`order-machine${open ? ' order-machine--open' : ''}`}>
      <button className="order-machine__header" onClick={() => setOpen(!open)}>
        <span className="order-machine__icon">
          <img src={EQUIPMENT_ICON} alt="" aria-hidden="true" />
        </span>
        <span style={{ flex: 1 }}>
          <span className="order-machine__name">{eq.name}</span>
          <br />
          <span className="order-machine__model">{eq.model}</span>
        </span>
        {totalSelected > 0 && (
          <span
            style={{
              background: 'var(--blueberry-500)',
              color: '#fff',
              borderRadius: '99px',
              padding: '2px 8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              flexShrink: 0,
              marginRight: 4,
            }}
          >
            {totalSelected}
          </span>
        )}
        <span className="order-machine__chevron">
          <Icon svgIcon={ChevronDown} size={28} />
        </span>
      </button>
      {open && (
        <div className="order-machine__body">
          {eq.consumables.map((c, i) => {
            const unavailableKey = `${eq.id}-${i}`;
            const unavailableUntil = getUnavailableUntil(c, orderedDates, unavailableKey);
            const qty = quantities[i] ?? 0;

            return (
              <div className="order-consumable-row" key={i}>
                <div className="order-consumable-row__info">
                  <p className="order-consumable-row__name">{c.name}</p>
                  {unavailableUntil && (
                    <span className="order-consumable-row__wait">
                      Tilgjengelig fra {formatDateShort(unavailableUntil)}
                    </span>
                  )}
                  {c.activeOrder && !unavailableUntil && (
                    <span className="order-consumable-row__wait" style={{ background: 'var(--blueberry-50)', color: 'var(--blueberry-700)', borderColor: 'var(--blueberry-500)' }}>
                      Under levering
                    </span>
                  )}
                </div>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => onChangeQty(i, -1)}
                    disabled={qty === 0 || !!unavailableUntil || !!c.activeOrder}
                    aria-label="Reduser antall"
                  >
                    −
                  </button>
                  <span className="qty-display">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onChangeQty(i, 1)}
                    disabled={!!unavailableUntil || !!c.activeOrder}
                    aria-label="Øk antall"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Step1({
  equipment,
  quantities,
  orderedDates,
  focusedEqId,
  onChangeQty,
  onNext,
  onBack,
}: Step1Props) {
  const [showError, setShowError] = useState(false);

  const totalSelected = Object.values(quantities).reduce(
    (sum, arr) => sum + arr.reduce((a, b) => a + b, 0),
    0
  );

  const handleNext = () => {
    if (totalSelected === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onNext();
  };

  const activeEquipment = equipment.filter(e => !e.deaktivert);

  return (
    <div className="order-step">
      <h2 className="order-step__title">Velg forbruksmateriell</h2>
      <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)', margin: '0 0 var(--space-s) 0', fontSize: '1rem' }}>
        Velg antall for hvert produkt du vil bestille.
      </p>

      {showError && (
        <div className="step1-error" role="alert">
          Du må velge minst ett produkt før du kan gå videre.
        </div>
      )}

      {activeEquipment.map(eq => (
        <MachineAccordion
          key={eq.id}
          eq={eq}
          quantities={quantities[eq.id] ?? eq.consumables.map(() => 0)}
          orderedDates={orderedDates}
          initialOpen={eq.id === focusedEqId}
          onChangeQty={(idx, delta) => onChangeQty(eq.id, idx, delta)}
        />
      ))}

      <div className="order-step__actions">
        <button className="btn-primary" onClick={handleNext}>
          Neste: Levering
        </button>
        <button className="btn-outline" onClick={onBack}>
          Avbryt
        </button>
      </div>
    </div>
  );
}
