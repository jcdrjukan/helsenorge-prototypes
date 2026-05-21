import { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import type { SubmittedOrder } from './data';

interface HistoryCardProps {
  order: SubmittedOrder;
  initialOpen?: boolean;
}

function HistoryCard({ order, initialOpen = false }: HistoryCardProps) {
  const [open, setOpen] = useState(initialOpen);

  const activeItems = order.equipmentItems.filter(({ quantities }) => quantities.some(q => q > 0));

  const machineNames = activeItems.map(({ eq }) => eq.model).join(', ');

  const produktnavn = activeItems.map(({ eq }) => eq.model).join(', ');
  const type = activeItems.map(({ eq }) => eq.details.type).join(', ');

  const allItems = order.equipmentItems.flatMap(({ eq, quantities }) =>
    eq.consumables
      .map((c, i) => ({ name: c.name, qty: quantities[i] ?? 0 }))
      .filter(x => x.qty > 0)
  );

  const titleEl = (
    <span>
      <span style={{ display: 'block', font: 'var(--mobile-body)' }}>{order.date}</span>
      <span style={{ display: 'block', font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)' }}>{machineNames}</span>
    </span>
  );

  const Field = ({ label, value }: { label: string; value?: string }) => {
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
          <Field label="Produktnavn" value={produktnavn} />
          <Field label="Type" value={type} />
          <Field label="Bestilt" value={order.date} />
          <Field label="Levert" value={order.levert} />
          <Field label="Saksbehandler kommentar" value={order.saksbehandlerKommentar} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--neutral-200)', margin: '1rem 0' }} />

        <div>
          <p style={{ font: 'var(--mobile-body-strong)', margin: '0 0 0.5rem 0' }}>Forbruksvarer</p>
          <ul className="order-summary-list">
            {allItems.map((item, i) => (
              <li key={i} style={{ font: 'var(--mobile-body)' }}>{item.qty}x {item.name}</li>
            ))}
          </ul>
        </div>
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

        <h1 style={{ font: 'var(--mobile-h1)', margin: 0 }}>Bestillingshistorikk</h1>
        <p style={{ font: 'var(--mobile-preamble)', margin: 0 }}>
          Her finner du tidligere bestillinger av forbruksmateriell.
        </p>

        {allOrders.length === 0 ? (
          <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)' }}>
            Ingen tidligere bestillinger.
          </p>
        ) : (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' }}>
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
