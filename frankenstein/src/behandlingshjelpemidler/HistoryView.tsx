import { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import type { SubmittedOrder, Equipment } from './data';

interface HistoryCardProps {
  order: SubmittedOrder;
  initialOpen?: boolean;
}

function HistoryCard({ order, initialOpen = false }: HistoryCardProps) {
  const [open, setOpen] = useState(initialOpen);

  const allItems: { eq: Equipment; consumableName: string; qty: number }[] = order.equipmentItems.flatMap(
    ({ eq, quantities }) =>
      eq.consumables
        .map((c, i) => ({ eq, consumableName: c.name, qty: quantities[i] ?? 0 }))
        .filter(x => x.qty > 0)
  );

  const summaryText =
    allItems.length > 0
      ? allItems
          .slice(0, 2)
          .map(x => x.consumableName.split(' ').slice(0, 3).join(' '))
          .join(', ') + (allItems.length > 2 ? ` +${allItems.length - 2}` : '')
      : 'Bestilling';

  return (
    <div className={`history-card${open ? ' history-card--open' : ''}`}>
      <button className="history-card__toggle" onClick={() => setOpen(!open)}>
        <span className="history-card__date">{order.date}</span>
        <span className="history-card__summary">{summaryText}</span>
        <span className="history-card__chevron">
          <Icon svgIcon={ChevronDown} size={24} />
        </span>
      </button>
      {open && (
        <div className="history-card__body">
          {order.equipmentItems.map(({ eq, quantities }) => {
            const selected = eq.consumables.filter((_, i) => (quantities[i] ?? 0) > 0);
            if (selected.length === 0) return null;
            return (
              <div key={eq.id} style={{ marginBottom: 'var(--space-xs)' }}>
                <div
                  style={{
                    font: 'var(--mobile-sublabel)',
                    color: 'var(--color-base-text-onlight-subdued)',
                    marginBottom: 4,
                  }}
                >
                  {eq.model}
                </div>
                <ul className="order-summary-list">
                  {eq.consumables.map((c, i) => {
                    const qty = quantities[i] ?? 0;
                    if (qty === 0) return null;
                    return (
                      <li key={i}>
                        {c.name} × {qty}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <div className="duolist" style={{ marginTop: 'var(--space-xs)' }}>
            <div className="duolist__row">
              <span className="duolist__key">Levering</span>
              <span className="duolist__value">
                {order.delivery === 'post'
                  ? order.addr
                  : order.delivery === 'hentes'
                  ? 'Hentet på lager'
                  : 'Hentet på sykehus'}
              </span>
            </div>
            {order.navn && (
              <div className="duolist__row">
                <span className="duolist__key">Navn</span>
                <span className="duolist__value">{order.navn}</span>
              </div>
            )}
            {order.telefon && (
              <div className="duolist__row">
                <span className="duolist__key">Telefon</span>
                <span className="duolist__value">{order.telefon}</span>
              </div>
            )}
            {order.comment && (
              <div className="duolist__row">
                <span className="duolist__key">Kommentar</span>
                <span className="duolist__value">{order.comment}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
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
    <div className="bhm-page-content">
      <nav className="order-nav" aria-label="Brødsmulesti">
        <button className="order-nav__back" onClick={onBack}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Behandlingshjelpemidler</span>
        </button>
      </nav>
      <hr className="bhm-divider" />
      <div style={{ height: 'var(--space-s)' }} />

      <h1 className="page-title">Bestillingshistorikk</h1>
      <p className="page-intro">Her finner du tidligere bestillinger av forbruksmateriell.</p>

      {allOrders.length === 0 ? (
        <p style={{ font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)' }}>
          Ingen tidligere bestillinger.
        </p>
      ) : (
        allOrders.map((order, i) => (
          <HistoryCard
            key={order.id}
            order={order}
            initialOpen={i === 0 && submittedOrders.length > 0}
          />
        ))
      )}

      <div style={{ height: 'var(--space-l)' }} />
    </div>
  );
}
