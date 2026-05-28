import { useState } from 'react';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import { Duolist, DuolistGroup } from '@helsenorge/designsystem-react/components/Duolist';
import type { Equipment, DeliveryForm } from './data';

interface Step4Props {
  equipment: Equipment[];
  quantities: Record<string, number[]>;
  delivery: DeliveryForm;
  comment: string;
  onSubmit: () => void;
  onBack: () => void;
}

function deliveryModeLabel(mode: string): string {
  if (mode === 'post') return 'Send i posten';
  if (mode === 'hentes') return 'Hentes på lokasjon1';
  if (mode === 'hentes2') return 'Hentes på lokasjon2';
  return '';
}

export default function Step4({ equipment, quantities, delivery, comment, onSubmit, onBack }: Step4Props) {
  const [openIds, setOpenIds] = useState(new Set(['forbruksvarer', 'levering', 'kommentar']));

  const toggle = (id: string, isExpanded: boolean) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (isExpanded) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectedItems: { eqName: string; consumableName: string; qty: number }[] = [];
  for (const eq of equipment) {
    if (eq.deaktivert) continue;
    const qtys = quantities[eq.id] ?? [];
    eq.consumables.forEach((c, i) => {
      const qty = qtys[i] ?? 0;
      if (qty > 0) selectedItems.push({ eqName: eq.model, consumableName: c.name, qty });
    });
  }

  return (
    <div className="order-step">
      <h2 className="order-step__title">Oppsummering</h2>
      <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)', margin: '0 0 var(--space-s) 0' }}>
        Sjekk at alt stemmer før du sender bestillingen.
      </p>

      <ExpanderList variant="line" color="white">
        <ExpanderList.Expander
          title="Forbruksvarer"
          expanded={openIds.has('forbruksvarer')}
          onExpand={isExpanded => toggle('forbruksvarer', isExpanded)}
        >
          {selectedItems.length === 0 ? (
            <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)', margin: 0 }}>
              Ingen produkter valgt.
            </p>
          ) : (
            <ul className="order-summary-list">
              {selectedItems.map((item, i) => (
                <li key={i} style={{ font: 'var(--mobile-body)' }}>
                  {item.qty}x {item.consumableName} til {item.eqName}
                </li>
              ))}
            </ul>
          )}
        </ExpanderList.Expander>

        <ExpanderList.Expander
          title="Levering"
          expanded={openIds.has('levering')}
          onExpand={isExpanded => toggle('levering', isExpanded)}
        >
          <Duolist boldColumn="first">
            <DuolistGroup term="Leveringsmåte" description={deliveryModeLabel(delivery.mode)} />
            {delivery.mode === 'post' && (
              <DuolistGroup
                term="Adresse"
                description={
                  <span>
                    {delivery.navn && <>{delivery.navn}<br /></>}
                    {delivery.gate}<br />
                    {`${delivery.postnr} ${delivery.sted}`.trim()}
                  </span>
                }
              />
            )}
            {delivery.telefon && (
              <DuolistGroup term="Telefon" description={delivery.telefon} />
            )}
          </Duolist>
        </ExpanderList.Expander>

        <ExpanderList.Expander
          title="Kommentar"
          expanded={openIds.has('kommentar')}
          onExpand={isExpanded => toggle('kommentar', isExpanded)}
        >
          {comment ? (
            <p style={{ font: 'var(--mobile-body)', margin: 0 }}>{comment}</p>
          ) : (
            <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)', margin: 0 }}>
              Ingen kommentar.
            </p>
          )}
        </ExpanderList.Expander>
      </ExpanderList>

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
