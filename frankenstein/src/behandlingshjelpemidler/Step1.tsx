import { useState } from 'react';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import { EQUIPMENT_ICON } from './data';
import type { Equipment } from './data';

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

  const activeEquipment = equipment.filter(e => !e.deaktivert);

  const initOpenIds = () =>
    focusedEqId === null
      ? new Set(activeEquipment.map(e => e.id))
      : new Set([focusedEqId]);

  const [openIds, setOpenIds] = useState<Set<string>>(initOpenIds);

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

  const toggleOpen = (eqId: string, isExpanded: boolean) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (isExpanded) next.add(eqId);
      else next.delete(eqId);
      return next;
    });
  };

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

      <ExpanderList variant="line" color="white">
        {activeEquipment.map(eq => {
          const eqQtys = quantities[eq.id] ?? eq.consumables.map(() => 0);

          const titleEl = (
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', font: 'var(--mobile-body-strong)' }}>{eq.model}</span>
              <span style={{ display: 'block', font: 'var(--mobile-label-subdued)', color: 'var(--color-base-text-onlight-subdued)' }}>{eq.name}</span>
            </span>
          );

          return (
            <ExpanderList.Expander
              key={eq.id}
              title={titleEl}
              icon={<img src={EQUIPMENT_ICON} alt="" aria-hidden="true" width={32} height={32} />}
              expanded={openIds.has(eq.id)}
              onExpand={(isExpanded) => toggleOpen(eq.id, isExpanded)}
            >
              {eq.consumables.map((c, i) => {
                const unavailableKey = `${eq.id}-${i}`;
                const unavailableUntil = getUnavailableUntil(c, orderedDates, unavailableKey);
                const qty = eqQtys[i] ?? 0;

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
                        onClick={() => onChangeQty(eq.id, i, -1)}
                        disabled={qty === 0 || !!unavailableUntil || !!c.activeOrder}
                        aria-label="Reduser antall"
                      >
                        −
                      </button>
                      <span className="qty-display">{qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onChangeQty(eq.id, i, 1)}
                        disabled={!!unavailableUntil || !!c.activeOrder}
                        aria-label="Øk antall"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </ExpanderList.Expander>
          );
        })}
      </ExpanderList>

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
