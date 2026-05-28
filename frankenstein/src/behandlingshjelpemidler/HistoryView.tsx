import React, { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import type { SubmittedOrder, DeliveryMode } from './data';

interface HistoryCardProps {
  order: SubmittedOrder;
  initialOpen?: boolean;
}

function deliveryLabel(mode: DeliveryMode): string {
  if (mode === 'post') return 'Send i posten';
  return 'Hentes';
}

function HistoryCard({ order, initialOpen = false }: HistoryCardProps) {
  const [open, setOpen] = useState(initialOpen);

  const allItems = order.equipmentItems.flatMap(({ eq, quantities }) =>
    eq.consumables
      .map((c, i) => ({ name: c.name, qty: quantities[i] ?? 0 }))
      .filter(x => x.qty > 0)
  );

  const itemCount = allItems.length;

  const titleEl = (
    <span>
      <span style={{ display: 'block', font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)' }}>{order.date}</span>
      <span style={{ display: 'block', font: 'var(--mobile-body)' }}>
        {itemCount} forbruksvare{itemCount !== 1 ? 'r' : ''}
      </span>
    </span>
  );

  const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => {
    if (!value) return null;
    return (
      <div>
        <p style={{ font: 'var(--mobile-body-strong)', margin: 0 }}>{label}</p>
        <p style={{ font: 'var(--mobile-body)', margin: 0 }}>{value}</p>
      </div>
    );
  };

  return (
    <ExpanderList variant="line" color="white">
      <ExpanderList.Expander title={titleEl} expanded={open} onExpand={setOpen}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field label="Ordredato" value={order.date} />
          <Field label="Leveringsmåte" value={deliveryLabel(order.delivery)} />
          <Field label="Adresse" value={
            order.delivery === 'post'
              ? <>{order.navn && <>{order.navn}<br /></>}{order.addr}<br />{order.poststed}</>
              : order.addr
          } />
          {order.comment && (
            <>
              <Field label="Kommentar til bestilling" value={order.comment} />
              <Field label="Tilbakemelding fra saksbehandler" value={order.saksbehandlerKommentar} />
            </>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--neutral-200)', margin: '1rem 0' }} />

        <ul className="order-summary-list">
          {allItems.map((item, i) => (
            <li key={i} style={{ font: 'var(--mobile-body)' }}>{item.qty}x {item.name}</li>
          ))}
        </ul>
      </ExpanderList.Expander>
    </ExpanderList>
  );
}

interface HistoryViewProps {
  submittedOrders: SubmittedOrder[];
  historyEntries: SubmittedOrder[];
  onBack: () => void;
}

export default function HistoryView({ submittedOrders, historyEntries, onBack }: HistoryViewProps) {
  const allOrders = [...[...submittedOrders].reverse(), ...historyEntries];

  return (
    <>
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={onBack}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Behandlingshjelpemidler</span>
        </button>
      </nav>
      <hr className="page-divider" />
      <div className="bhm-page-content">

        <h1 style={{ font: 'var(--mobile-h1)', margin: '48px 0 0 0' }}>Bestillingshistorikk</h1>
        <p style={{ font: 'var(--mobile-preamble)', margin: 0 }}>
          Her finner du tidligere bestillinger av forbruksmateriell.
        </p>

        {allOrders.length === 0 ? (
          <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)' }}>
            Ingen tidligere bestillinger.
          </p>
        ) : (
          <div className="history-list" style={{ marginTop: '1rem' }}>
            {allOrders.map((order, i) => (
              <HistoryCard
                key={order.id}
                order={order}
                initialOpen={i === 0 && submittedOrders.length > 0}
              />
            ))}
          </div>
        )}

        <div style={{ height: 'var(--space-l)' }} />
      </div>
    </>
  );
}
