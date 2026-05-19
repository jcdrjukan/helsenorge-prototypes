import { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import type { Equipment, SubmittedOrder, AppView } from './data';
import { EQUIPMENT_ICON } from './data';

interface OrderCardProps {
  order: SubmittedOrder;
}

function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false);

  const itemNames = order.equipmentItems
    .flatMap(({ eq, quantities }) =>
      eq.consumables
        .map((c, i) => ({ name: c.name, qty: quantities[i] ?? 0 }))
        .filter(x => x.qty > 0)
    )
    .map(x => `${x.name} × ${x.qty}`);

  const summaryText =
    itemNames.length > 0
      ? `${itemNames.length} produkt${itemNames.length !== 1 ? 'er' : ''}`
      : 'Bestilling';

  return (
    <div className={`order-card${open ? ' order-card--open' : ''}`}>
      <button className="order-card__toggle" onClick={() => setOpen(!open)}>
        <span className="order-card__title">Bestilling sendt {order.date}</span>
        <span className="order-card__date">{summaryText}</span>
        <span className="order-card__chevron">
          <Icon svgIcon={ChevronDown} size={28} />
        </span>
      </button>
      {open && (
        <div className="order-card__body">
          {order.equipmentItems.map(({ eq, quantities }) => {
            const selected = eq.consumables.filter((_, i) => (quantities[i] ?? 0) > 0);
            if (selected.length === 0) return null;
            return (
              <div key={eq.id} style={{ marginBottom: 'var(--space-xs)' }}>
                <div style={{ font: 'var(--mobile-sublabel)', color: 'var(--color-base-text-onlight-subdued)', marginBottom: '4px' }}>
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
                  ? 'Hentes på lager'
                  : 'Hentes på sykehus'}
              </span>
            </div>
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

interface ForsideProps {
  equipment: Equipment[];
  submittedOrders: SubmittedOrder[];
  onShowMachine: (eqId: string) => void;
  onStartOrder: (eqId: string | null, from: AppView) => void;
  onShowHistory: () => void;
}

export default function Forside({
  equipment,
  submittedOrders,
  onShowMachine,
  onStartOrder,
  onShowHistory,
}: ForsideProps) {
  const activeEquipment = equipment.filter(e => !e.deaktivert);
  const deaktivertEquipment = equipment.filter(e => e.deaktivert);

  const getEquipStatus = (eq: Equipment): 'active-order' | 'warning' | 'ok' | 'none' => {
    const hasActiveOrder = eq.consumables.some(c => c.activeOrder);
    if (hasActiveOrder) return 'active-order';
    const hasUpcoming = eq.consumables.some(
      c => c.nextOrderDate && new Date(c.nextOrderDate) <= new Date(Date.now() + 14 * 24 * 3600000)
    );
    if (hasUpcoming) return 'warning';
    return 'none';
  };

  const mostRecent = submittedOrders.length > 0 ? submittedOrders[submittedOrders.length - 1] : null;

  return (
    <div className="bhm-page-content">
      <nav className="order-nav" aria-label="Brødsmulesti">
        <button className="order-nav__back">
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="bhm-divider" />
      <div style={{ height: 'var(--space-s)' }} />

      <h1 className="page-title">Behandlings&shy;hjelpemidler</h1>
      <p className="page-intro">
        Her finner du utstyret ditt, kan bestille forbruksmateriell og se bestillingshistorikk.
      </p>

      {mostRecent && (
        <div className="notification-panel notification-panel--success">
          <p className="notification-panel__title">Bestilling er mottatt</p>
          <p className="notification-panel__body">
            Bestillingen din fra {mostRecent.date} er registrert. Du får bekreftelse på e-post.
          </p>
        </div>
      )}

      {submittedOrders.length > 0 && (
        <section>
          <h2 className="section-h2">Aktive bestillinger</h2>
          {[...submittedOrders].reverse().map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </section>
      )}

      <section>
        <h2 className="section-h2">Ditt utstyr</h2>
        <ul className="equip-list">
          {activeEquipment.map(eq => {
            const status = getEquipStatus(eq);
            return (
              <li key={eq.id}>
                <button
                  className="equip-list__item"
                  onClick={() => onShowMachine(eq.id)}
                >
                  {status === 'warning' && (
                    <span className="equip-list__status-strip equip-list__status-strip--warning" />
                  )}
                  {status === 'active-order' && (
                    <span className="equip-list__status-strip equip-list__status-strip--active-order" />
                  )}
                  <span className="equip-list__icon" style={{ paddingLeft: status !== 'none' ? '4px' : 0 }}>
                    <img src={EQUIPMENT_ICON} alt="" aria-hidden="true" />
                  </span>
                  <span className="equip-list__info">
                    <span className="equip-list__name">{eq.name}</span>
                    <span className="equip-list__model">{eq.model}</span>
                  </span>
                  {status === 'warning' && (
                    <span className="equip-list__badge equip-list__badge--warning">Bestill snart</span>
                  )}
                  {status === 'active-order' && (
                    <span className="equip-list__badge equip-list__badge--active">Under levering</span>
                  )}
                </button>
              </li>
            );
          })}
          {deaktivertEquipment.map(eq => (
            <li key={eq.id}>
              <button
                className="equip-list__item equip-list__item--deaktivert"
                onClick={() => onShowMachine(eq.id)}
              >
                <span className="equip-list__icon">
                  <img src={EQUIPMENT_ICON} alt="" aria-hidden="true" />
                </span>
                <span className="equip-list__info">
                  <span className="equip-list__name">{eq.name}</span>
                  <span className="equip-list__model">{eq.model}</span>
                </span>
                <span className="equip-list__badge equip-list__badge--deaktivert">Deaktivert</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div style={{ height: 'var(--space-s)' }} />

      <button className="btn-primary" onClick={() => onStartOrder(null, 'forside')}>
        Bestill forbruksmateriell
      </button>

      <div style={{ height: 'var(--space-xs)' }} />

      <button className="btn-borderless" onClick={onShowHistory}>
        Se bestillingshistorikk
      </button>

      <footer className="bhm-footer" style={{ marginTop: 'var(--space-l)' }}>
        <a href="#" className="bhm-footer__link">Personvern</a>
        <span className="bhm-footer__divider">|</span>
        <a href="#" className="bhm-footer__link">Om tjenesten</a>
        <span className="bhm-footer__divider">|</span>
        <a href="#" className="bhm-footer__link">Kontakt</a>
      </footer>
    </div>
  );
}
