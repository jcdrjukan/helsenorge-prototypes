import { useState } from 'react';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import StatusDot from '@helsenorge/designsystem-react/components/StatusDot';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import TreatmentAids from '@helsenorge/designsystem-react/components/Icons/TreatmentAids';
import { IconSize } from '@helsenorge/designsystem-react/constants';
import Button from '@helsenorge/designsystem-react/components/Button';
import StepButtons from '@helsenorge/designsystem-react/components/StepButtons/StepButtons';
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

// The "Tilgjengelig fra <dato>" pill and its button-disabling are
// discontinued — this style of message is no longer used. Kept here
// (commented) for quick reinclusion if that changes:
// function getUnavailableUntil(c: { nextOrderDate?: string }, orderedDates: Record<string, Date>, key: string): Date | null {
//   if (orderedDates[key]) {
//     const ordered = orderedDates[key];
//     const cutoff = new Date(ordered.getTime() + 90 * 24 * 3600000);
//     if (cutoff > new Date()) return cutoff;
//   }
//   if (c.nextOrderDate) {
//     const next = new Date(c.nextOrderDate);
//     if (next > new Date()) return next;
//   }
//   return null;
// }
//
// function formatDateShort(d: Date): string {
//   return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
// }

// orderedDates is only read by the commented-out unavailability logic above
// — kept in the prop signature (unused for now) so callers don't need to change.
export default function Step1({
  equipment,
  quantities,
  orderedDates: _orderedDates,
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
      <h2 className="order-step__title">Velg antall forbruksmateriell</h2>

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
              icon={<Icon svgIcon={TreatmentAids} size={IconSize.XXSmall} />}
              expanded={openIds.has(eq.id)}
              onExpand={(isExpanded) => toggleOpen(eq.id, isExpanded)}
            >
              {eq.consumables.map((c, i) => {
                const qty = eqQtys[i] ?? 0;

                return (
                  <div className="order-consumable-row" key={i}>
                    {c.activeOrder ? (
                      <div className="qty-control" />
                    ) : (
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => onChangeQty(eq.id, i, -1)}
                          disabled={qty === 0}
                          aria-label="Reduser antall"
                        >
                          −
                        </button>
                        <span className="qty-display">{qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onChangeQty(eq.id, i, 1)}
                          aria-label="Øk antall"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <div className="order-consumable-row__info">
                      <p className="order-consumable-row__name">{c.name}</p>
                      {c.activeOrder && (
                        <StatusDot variant="inprocess" text="aktiv bestilling" />
                      )}
                    </div>
                  </div>
                );
              })}
            </ExpanderList.Expander>
          );
        })}
      </ExpanderList>

      {showError && (
        <p role="alert" style={{ margin: 'var(--space-m) 0 0 0', font: 'var(--mobile-label)', color: 'var(--cherry-700)' }}>
          Du må velge minst et produkt
        </p>
      )}
      <StepButtons
        forwardButton={<Button onClick={handleNext} arrow="icon">Neste</Button>}
        backButton={<Button onClick={onBack}>Avbryt</Button>}
      />
    </div>
  );
}
