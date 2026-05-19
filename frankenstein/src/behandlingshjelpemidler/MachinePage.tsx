import { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import type { Equipment, AppView } from './data';
import { EQUIPMENT_ICON } from './data';

function formatDate(iso: string): string {
  // If already formatted as dd.mm.yyyy return as-is
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getConsumableStatus(
  nextOrderDate?: string,
  lastOrder?: string,
  activeOrder?: boolean,
  orderedDates?: Record<string, Date>
): 'active' | 'soon' | 'ok' | 'none' {
  if (activeOrder) return 'active';
  if (orderedDates) {
    // recently ordered means ok
  }
  if (nextOrderDate) {
    const next = new Date(nextOrderDate);
    const now = new Date();
    const diffDays = (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 14) return 'soon';
    return 'ok';
  }
  if (lastOrder) return 'ok';
  return 'none';
}

interface MachinePageProps {
  eq: Equipment;
  orderedDates: Record<string, Date>;
  onBack: () => void;
  onStartOrder: (eqId: string, from: AppView) => void;
}

export default function MachinePage({ eq, orderedDates, onBack, onStartOrder }: MachinePageProps) {
  const [helpOpen, setHelpOpen] = useState(false);

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

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)', marginBottom: 'var(--space-xs)' }}>
        <div style={{ width: 48, height: 48, flexShrink: 0 }}>
          <img src={EQUIPMENT_ICON} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <div style={{ font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight-subdued)' }}>{eq.name}</div>
          <h1 className="page-title" style={{ margin: 0 }}>{eq.model}</h1>
        </div>
      </div>

      {eq.deaktivert && (
        <div className="deaktivert-banner">
          Dette utstyret er deaktivert. Du kan ikke bestille forbruksmateriell til det.
        </div>
      )}

      {/* Details duolist */}
      <section style={{ marginBottom: 'var(--space-m)' }}>
        <div className="duolist">
          <div className="duolist__row">
            <span className="duolist__key">Type</span>
            <span className="duolist__value">{eq.details.type}</span>
          </div>
          <div className="duolist__row">
            <span className="duolist__key">Produsent</span>
            <span className="duolist__value">{eq.details.produsent}</span>
          </div>
          {eq.modelNo && (
            <div className="duolist__row">
              <span className="duolist__key">Modellnr.</span>
              <span className="duolist__value">{eq.modelNo}</span>
            </div>
          )}
          {/* If single unit (no units array, serial is in details) */}
          {!eq.units && eq.details.serial && (
            <div className="duolist__row">
              <span className="duolist__key">Serienr.</span>
              <span className="duolist__value">{eq.details.serial}</span>
            </div>
          )}
          {!eq.units && eq.details.deliveryDate && (
            <div className="duolist__row">
              <span className="duolist__key">Utlevert</span>
              <span className="duolist__value">{formatDate(eq.details.deliveryDate)}</span>
            </div>
          )}
          {!eq.units && eq.details.owner && (
            <div className="duolist__row">
              <span className="duolist__key">Eier</span>
              <span className="duolist__value">{eq.details.owner}</span>
            </div>
          )}
        </div>
      </section>

      {/* Multiple units */}
      {eq.units && eq.units.length > 0 && (
        <section style={{ marginBottom: 'var(--space-m)' }}>
          <h2 style={{ font: 'var(--mobile-sublabel)', fontSize: '1rem', marginBottom: 'var(--space-xs)', color: 'var(--color-base-text-onlight-subdued)' }}>
            Enheter ({eq.units.length})
          </h2>
          {eq.units.map(unit => (
            <div className="unit-card" key={unit.serial}>
              {unit.label && <div className="unit-card__label">{unit.label}</div>}
              <div className="duolist">
                <div className="duolist__row">
                  <span className="duolist__key">Serienr.</span>
                  <span className="duolist__value">{unit.serial}</span>
                </div>
                <div className="duolist__row">
                  <span className="duolist__key">Utlevert</span>
                  <span className="duolist__value">{formatDate(unit.deliveryDate)}</span>
                </div>
                <div className="duolist__row">
                  <span className="duolist__key">Eier</span>
                  <span className="duolist__value">{unit.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Help expander */}
      <div className={`help-expander${helpOpen ? ' help-expander--open' : ''}`}>
        <button className="help-expander__btn" onClick={() => setHelpOpen(!helpOpen)}>
          <span>Om dette utstyret</span>
          <span className="help-expander__chevron">
            <Icon svgIcon={ChevronDown} size={24} />
          </span>
        </button>
        {helpOpen && (
          <div className="help-expander__body">
            <p style={{ margin: 0 }}>
              For spørsmål om utstyret, kontakt din behandler eller helseforetaket som eier utstyret.
              Serienummer og eierinformasjon finner du i oversikten over.
            </p>
          </div>
        )}
      </div>

      {/* Consumable section */}
      <div className="consumable-section">
        <h2 className="consumable-section__title">Forbruksmateriell</h2>
        {eq.consumables.map((c, i) => {
          const status = getConsumableStatus(c.nextOrderDate, c.lastOrder, c.activeOrder, orderedDates);
          return (
            <div className="consumable-status-row" key={i}>
              <div className="consumable-status-row__info">
                <p className="consumable-status-row__name">{c.name}</p>
                {c.nextOrderDate && (
                  <p className="consumable-status-row__meta">
                    Neste bestilling: {formatDate(c.nextOrderDate)}
                  </p>
                )}
                {c.lastOrder && !c.nextOrderDate && (
                  <p className="consumable-status-row__meta">
                    Sist bestilt: {formatDate(c.lastOrder)}
                  </p>
                )}
              </div>
              {status === 'active' && (
                <span className="consumable-status-badge consumable-status-badge--active">Under levering</span>
              )}
              {status === 'soon' && (
                <span className="consumable-status-badge consumable-status-badge--warning">Bestill snart</span>
              )}
              {status === 'ok' && (
                <span className="consumable-status-badge consumable-status-badge--ok">OK</span>
              )}
            </div>
          );
        })}
      </div>

      {!eq.deaktivert && (
        <>
          <div style={{ height: 'var(--space-m)' }} />
          <button className="btn-primary" onClick={() => onStartOrder(eq.id, 'machine')}>
            Bestill forbruksmateriell
          </button>
        </>
      )}

      <div style={{ height: 'var(--space-l)' }} />
    </div>
  );
}
