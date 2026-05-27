import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import { Duolist, DuolistGroup } from '@helsenorge/designsystem-react/components/Duolist';
import EyebrowHeader from '@helsenorge/designsystem-react/components/EyebrowHeader';
import HelpExpanderStandalone from '@helsenorge/designsystem-react/components/HelpExpanderStandalone';
import Button from '@helsenorge/designsystem-react/components/Button';
import Panel from '@helsenorge/designsystem-react/components/Panel';
import { PanelVariant } from '@helsenorge/designsystem-react/components/Panel';
import StatusDot from '@helsenorge/designsystem-react/components/StatusDot';
import type { Equipment, AppView } from './data';

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

      <div style={{ marginTop: '48px' }}>
        <EyebrowHeader>
          <EyebrowHeader.Subtitle>Ditt utstyr</EyebrowHeader.Subtitle>
          <h1 style={{ font: 'var(--mobile-h1)', margin: 0 }}>{eq.model}</h1>
        </EyebrowHeader>
      </div>

      {eq.deaktivert && (
        <div className="deaktivert-banner">
          Dette utstyret er deaktivert. Du kan ikke bestille forbruksmateriell til det.
        </div>
      )}

      {/* Details duolist */}
      <section style={{ marginBottom: 'var(--space-m)' }}>
        <Duolist boldColumn="first">
          <DuolistGroup term="Type" description={eq.details.type} />
          <DuolistGroup term="Produsent" description={eq.details.produsent} />
          {eq.modelNo && <DuolistGroup term="Modellnr." description={eq.modelNo} />}
          {!eq.units && eq.details.serial && <DuolistGroup term="Serienr." description={eq.details.serial} />}
          {!eq.units && eq.details.deliveryDate && <DuolistGroup term="Utlevert" description={formatDate(eq.details.deliveryDate)} />}
          {!eq.units && eq.details.owner && <DuolistGroup term="Eier" description={eq.details.owner} />}
        </Duolist>
      </section>

      {/* Multiple units */}
      {eq.units && eq.units.length > 0 && (
        <section style={{ marginBottom: 'var(--space-m)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          {eq.units.map(unit => (
            <Panel key={unit.serial} variant={PanelVariant.outline}>
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
      <div className="consumable-section">
        <h2 style={{ font: 'var(--mobile-h2)', margin: '0 0 var(--space-s) 0' }}>Forbruksmateriell</h2>
        {eq.consumables.map((c, i) => {
          const status = getConsumableStatus(c.nextOrderDate, c.lastOrder, c.activeOrder, orderedDates);
          return (
            <div key={i} style={{ marginBottom: 'var(--space-s)' }}>
              <p style={{ margin: 0, font: 'var(--mobile-body)' }}>{c.name}</p>
              {c.lastOrder && (
                <p style={{ margin: 0, font: 'var(--mobile-body)', color: 'var(--color-base-text-onlight-subdued)' }}>
                  Sist bestilt: {formatDate(c.lastOrder)}
                </p>
              )}
              {status === 'active'
                ? <StatusDot variant="inprocess" text="Under levering" />
                : <StatusDot variant="success" text="Kan bestilles" />
              }
            </div>
          );
        })}
      </div>

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
