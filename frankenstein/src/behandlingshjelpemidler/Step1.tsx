import { useState } from 'react';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import StatusDot from '@helsenorge/designsystem-react/components/StatusDot';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import TreatmentAids from '@helsenorge/designsystem-react/components/Icons/TreatmentAids';
import { IconSize } from '@helsenorge/designsystem-react/constants';
import Button from '@helsenorge/designsystem-react/components/Button';
import NotificationPanel from '@helsenorge/designsystem-react/components/NotificationPanel';
import StepButtons from '@helsenorge/designsystem-react/components/StepButtons/StepButtons';
import type { Equipment } from './data';

interface Step1Props {
  equipment: Equipment[];
  quantities: Record<string, number[]>;
  orderedDates: Record<string, Date>;
  activeOrderKeys: Set<string>;
  focusedEqId: string | null;
  onChangeQty: (eqId: string, idx: number, delta: number) => void;
  onNext: () => void;
  onAbandonRequest: () => void;
  onNoProductsAvailable: () => void;
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
  activeOrderKeys,
  focusedEqId,
  onChangeQty,
  onNext,
  onAbandonRequest,
  onNoProductsAvailable,
}: Step1Props) {
  const [showError, setShowError] = useState(false);

  const activeEquipment = equipment.filter(e => !e.deaktivert);

  const isInActiveOrder = (eqId: string, idx: number) => activeOrderKeys.has(`${eqId}:${idx}`);

  // True when every orderable consumable is already tied to an active
  // order, i.e. no +/- control is rendered anywhere on this step.
  const allInActiveOrder =
    activeEquipment.length > 0 &&
    activeEquipment.every(eq => eq.consumables.every((_c, i) => isInActiveOrder(eq.id, i)));

  const initOpenIds = () =>
    focusedEqId === null
      ? new Set(activeEquipment.map(e => e.id))
      : new Set([focusedEqId]);

  const [openIds, setOpenIds] = useState<Set<string>>(initOpenIds);

  // Forbruksmateriell that fits several utstyr has the same ID, so it's
  // listed under each of them. Group the occurrences by name (the prototype's
  // stand-in for that shared ID) so each row can say where else it's shown
  // and how many are ordered (Figma 133:915, 2026-10-22).
  const occurrences = new Map<string, { eq: Equipment; idx: number }[]>();
  for (const eq of activeEquipment) {
    eq.consumables.forEach((c, idx) => {
      const list = occurrences.get(c.name) ?? [];
      list.push({ eq, idx });
      occurrences.set(c.name, list);
    });
  }
  // Machine-neutral wording since 2026-10-22 (user request); it no longer
  // names the other utstyr or the count.
  const sharedNote = (name: string): string | null => {
    const list = occurrences.get(name) ?? [];
    if (list.length < 2) return null;
    const total = Math.max(...list.map(o => (quantities[o.eq.id] ?? [])[o.idx] ?? 0));
    if (total === 0) return null;
    return 'Denne forbruksvaren passer til flere av dine utstyr og tallet her viser den samlede bestillingen.';
  };

  const totalSelected = Object.values(quantities).reduce(
    (sum, arr) => sum + arr.reduce((a, b) => a + b, 0),
    0
  );

  const handleNext = () => {
    if (allInActiveOrder) {
      onNoProductsAvailable();
      return;
    }
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
              {/* Second line only when it adds something (not for "Forbruksmateriell uten utstyr", whose name is the title). */}
              {(eq.subtitle ?? (eq.name !== eq.model ? eq.name : '')) && (
                <span style={{ display: 'block', font: 'var(--mobile-label-subdued)', color: 'var(--color-base-text-onlight-subdued)' }}>{eq.subtitle ?? eq.name}</span>
              )}
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
                const isActive = isInActiveOrder(eq.id, i);
                const note = isActive ? null : sharedNote(c.name);

                return (
                  <div className="order-consumable-row" key={i}>
                    {isActive ? (
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
                      {isActive && (
                        <StatusDot variant="inprocess" text="Allerede bestilt" />
                      )}
                    </div>
                    {note && (
                      <div className="order-consumable-row__shared">
                        <NotificationPanel variant="info" compactVariant="outline" fluid>
                          {note}
                        </NotificationPanel>
                      </div>
                    )}
                  </div>
                );
              })}
            </ExpanderList.Expander>
          );
        })}
      </ExpanderList>

      {showError && (
        <p role="alert" style={{ margin: 'var(--space-m) 0 0 0', font: 'var(--mobile-label)', color: 'var(--cherry-700)' }}>
          Du må velge minst ett forbruksmateriell
        </p>
      )}
      <StepButtons
        forwardButton={<Button onClick={handleNext} arrow="icon">Neste</Button>}
        cancelButton={<Button onClick={onAbandonRequest}>Avbryt</Button>}
      />
    </div>
  );
}
