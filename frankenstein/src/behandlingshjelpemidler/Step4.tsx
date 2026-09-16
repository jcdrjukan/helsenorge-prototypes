import { useState } from 'react';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import { Duolist, DuolistGroup } from '@helsenorge/designsystem-react/components/Duolist';
import Button from '@helsenorge/designsystem-react/components/Button';
import StepButtons from '@helsenorge/designsystem-react/components/StepButtons/StepButtons';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ArrowLeft from '@helsenorge/designsystem-react/components/Icons/ArrowLeft';
import { PICKUP_LOCATIONS, type Equipment, type DeliveryForm } from './data';

interface Step4Props {
  equipment: Equipment[];
  quantities: Record<string, number[]>;
  delivery: DeliveryForm;
  comment: string;
  onSubmit: () => void;
  onBack: () => void;
  onAbandonRequest: () => void;
}

export default function Step4({ equipment, quantities, delivery, comment, onSubmit, onBack, onAbandonRequest }: Step4Props) {
  const [openIds, setOpenIds] = useState(new Set(['forbruksvarer', 'levering', 'kommentar']));

  const toggle = (id: string, isExpanded: boolean) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (isExpanded) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectedItems: { consumableName: string; qty: number }[] = [];
  for (const eq of equipment) {
    if (eq.deaktivert) continue;
    const qtys = quantities[eq.id] ?? [];
    eq.consumables.forEach((c, i) => {
      const qty = qtys[i] ?? 0;
      if (qty > 0) selectedItems.push({ consumableName: c.name, qty });
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
            <Duolist boldColumn="first">
              {selectedItems.map((item, i) => (
                <DuolistGroup key={i} term={`${item.qty} stk.`} description={item.consumableName} />
              ))}
            </Duolist>
          )}
        </ExpanderList.Expander>

        <ExpanderList.Expander
          title="Levering"
          expanded={openIds.has('levering')}
          onExpand={isExpanded => toggle('levering', isExpanded)}
        >
          <Duolist boldColumn="first">
            {delivery.mode === 'post' && (
              <DuolistGroup
                term="Sendes til"
                description={
                  <span>
                    {delivery.navn && <>{delivery.navn}<br /></>}
                    {delivery.gate}<br />
                    {`${delivery.postnr} ${delivery.sted}`.trim()}<br />
                    Telefon: {delivery.telefon}
                  </span>
                }
              />
            )}
            {(delivery.mode === 'hentes' || delivery.mode === 'hentes2') && (() => {
              const loc = PICKUP_LOCATIONS[delivery.mode];
              return (
                <DuolistGroup
                  term="Hentested"
                  description={
                    <span>
                      {loc.name}<br />
                      {loc.gate}<br />
                      {loc.postnr} {loc.sted}<br />
                      Telefon: {loc.telefon}
                    </span>
                  }
                />
              );
            })()}
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

      <StepButtons
        forwardButton={<Button onClick={onSubmit} arrow="icon">Send</Button>}
        backButton={<Button onClick={onBack}><Icon svgIcon={ArrowLeft} />Tilbake</Button>}
        cancelButton={<Button onClick={onAbandonRequest}>Avbryt</Button>}
      />
    </div>
  );
}
