import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import { Duolist, DuolistGroup } from '@helsenorge/designsystem-react/components/Duolist';
import EyebrowHeader from '@helsenorge/designsystem-react/components/EyebrowHeader';
import HelpExpanderStandalone from '@helsenorge/designsystem-react/components/HelpExpanderStandalone';
import Button from '@helsenorge/designsystem-react/components/Button';
import Panel from '@helsenorge/designsystem-react/components/Panel';
import { PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
// StatusDot is only needed by the commented-out order-status block below —
// re-add this import when that block is restored.
// import StatusDot from '@helsenorge/designsystem-react/components/StatusDot';
import NotificationPanel from '@helsenorge/designsystem-react/components/NotificationPanel';
import type { Equipment, AppView } from './data';

function formatDate(iso: string): string {
  // If already formatted as dd.mm.yyyy return as-is
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(iso)) return iso;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// getConsumableStatus is only needed by the commented-out order-status
// block below — re-add this function when that block is restored.
// function getConsumableStatus(
//   nextOrderDate?: string,
//   lastOrder?: string,
//   activeOrder?: boolean,
//   orderedDates?: Record<string, Date>
// ): 'active' | 'soon' | 'ok' | 'none' {
//   if (activeOrder) return 'active';
//   if (orderedDates) {
//     // recently ordered means ok
//   }
//   if (nextOrderDate) {
//     const next = new Date(nextOrderDate);
//     const now = new Date();
//     const diffDays = (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
//     if (diffDays <= 14) return 'soon';
//     return 'ok';
//   }
//   if (lastOrder) return 'ok';
//   return 'none';
// }

interface MachinePageProps {
  eq: Equipment;
  orderedDates: Record<string, Date>;
  onBack: () => void;
  onStartOrder: (eqId: string, from: AppView) => void;
}

// orderedDates is only read by the commented-out order-status block below —
// kept in the prop signature (unused for now) so callers don't need to change.
export default function MachinePage({ eq, orderedDates: _orderedDates, onBack, onStartOrder }: MachinePageProps) {
  // Equipment with a real units[] list has one entry per physical device.
  // Equipment without one still has a single device's serial/delivery/owner
  // on eq.details — normalize that into the same shape so both cases render
  // through the same one-panel-per-unit UI below.
  const units = eq.units && eq.units.length > 0
    ? eq.units
    : eq.details.serial && eq.details.deliveryDate && eq.details.owner
      ? [{ serial: eq.details.serial, deliveryDate: eq.details.deliveryDate, owner: eq.details.owner }]
      : [];

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

      <div style={{ marginTop: '32px' }}>
        <EyebrowHeader>
          <EyebrowHeader.Subtitle>Ditt utstyr</EyebrowHeader.Subtitle>
          <h1 style={{ font: 'var(--mobile-h1)', margin: 0 }}>{eq.model}</h1>
        </EyebrowHeader>
      </div>

      {eq.deaktivert && (
        <NotificationPanel variant="error" className="bhm-deaktivert-panel">
          <p style={{ margin: 0, fontWeight: 400 }}>
            {eq.deaktivertMessage ?? 'Dette utstyret er deaktivert. Du kan ikke bestille forbruksmateriell til det.'}
          </p>
        </NotificationPanel>
      )}

      {/* Details duolist */}
      <section style={{ marginBottom: 'var(--space-m)' }}>
        <Duolist boldColumn="first">
          <DuolistGroup term="Type" description={eq.details.type} />
          <DuolistGroup term="Produsent" description={eq.details.produsent} />
          {eq.modelNo && <DuolistGroup term="Modellnr." description={eq.modelNo} />}
        </Duolist>
      </section>

      {/* Device-specific info (Serienr./Utlevert/Eier) — always shown as its
          own panel box, one per physical unit, even when there's only one. */}
      {units.length > 0 && (
        <section style={{ marginBottom: 'var(--space-m)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {units.map(unit => (
            <Panel key={unit.serial} variant={PanelVariant.outline} className="bhm-unit-panel">
              <Panel.A>
                <Duolist boldColumn="first">
                  <DuolistGroup term="Serienr." description={unit.serial} />
                  <DuolistGroup term="Utlevert" description={formatDate(unit.deliveryDate)} />
                  <DuolistGroup term="Eier" description={unit.owner} />
                </Duolist>
              </Panel.A>
            </Panel>
          ))}
        </section>
      )}

      {/* Help expander */}
      <HelpExpanderStandalone triggerText="Har du spørsmål om dette produktet?">
        <p style={{ margin: 0 }}>
          For spørsmål om utstyret, kontakt din behandler eller helseforetaket som eier utstyret.
          Serienummer og eierinformasjon finner du i oversikten over.
        </p>
      </HelpExpanderStandalone>

      {/* Consumable section */}
      {!eq.deaktivert && (
        <div className="consumable-section">
          <h2 style={{ font: 'var(--mobile-h2)', margin: '0 0 var(--space-s) 0' }}>Forbruksmateriell</h2>
          {eq.consumables.map((c, i) => {
            return (
              <div key={i} style={{ marginBottom: 'var(--space-s)' }}>
                <p style={{ margin: 0, font: 'var(--mobile-body)' }}>{c.name}</p>
                {c.lastOrder && (
                  <p style={{ margin: 0, font: 'var(--mobile-sublabel-subdued)', color: 'var(--color-base-text-onlight-subdued)' }}>
                    Sist bestilt: {formatDate(c.lastOrder)}
                  </p>
                )}
                {/* Order status ("kan bestilles" / "aktiv bestilling") is temporarily
                    hidden everywhere except the actual order form (Step1), to keep
                    this browsing view uncluttered. Uncomment to bring it back:
                {getConsumableStatus(c.nextOrderDate, c.lastOrder, c.activeOrder, orderedDates) === 'active'
                  ? <StatusDot variant="inprocess" text="aktiv bestilling" />
                  : <StatusDot variant="active" text="kan bestilles" />
                }
                */}
              </div>
            );
          })}
        </div>
      )}

      {!eq.deaktivert && (
        <>
          <div style={{ height: 'var(--space-m)' }} />
          <div style={{ alignSelf: 'flex-start' }}>
            <Button variant={PanelVariant.outline} onClick={() => onStartOrder(eq.id, 'machine')}>
              Bestill
            </Button>
          </div>
        </>
      )}

      <div style={{ height: 'var(--space-l)' }} />
    </div>
    </>
  );
}
