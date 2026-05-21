import { useState } from 'react';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import MobilePhone from '@helsenorge/designsystem-react/components/Icons/MobilePhone';
import HelpSign from '@helsenorge/designsystem-react/components/Icons/HelpSign';
import Globe from '@helsenorge/designsystem-react/components/Icons/Globe';
import Button from '@helsenorge/designsystem-react/components/Button';
import LinkList from '@helsenorge/designsystem-react/components/LinkList';
import ElementHeader from '@helsenorge/designsystem-react/components/ElementHeader';
import StatusDot from '@helsenorge/designsystem-react/components/StatusDot';
import NotificationPanel from '@helsenorge/designsystem-react/components/NotificationPanel';
import ExpanderList from '@helsenorge/designsystem-react/components/ExpanderList';
import { Duolist, DuolistGroup } from '@helsenorge/designsystem-react/components/Duolist';
import type { Equipment, SubmittedOrder, AppView } from './data';
import { EQUIPMENT_ICON } from './data';

interface OrderCardProps {
  order: SubmittedOrder;
}

function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false);

  const titleEl = (
    <span>
      <StatusDot variant="inprocess" text="Under levering" />
      <span style={{ display: 'block', font: 'var(--mobile-body-strong)', marginTop: '2px' }}>
        Bestilling sendt {order.date}
      </span>
    </span>
  );

  return (
    <ExpanderList variant="line" color="white">
      <ExpanderList.Expander
        title={titleEl}
        expanded={open}
        onExpand={setOpen}
      >
        {order.equipmentItems.map(({ eq, quantities }) => {
          const selected = eq.consumables.filter((_, i) => (quantities[i] ?? 0) > 0);
          if (selected.length === 0) return null;
          return (
            <div key={eq.id} style={{ marginBottom: 'var(--space-xs)' }}>
              <p style={{ font: 'var(--mobile-label-subdued)', color: 'var(--color-base-text-onlight-subdued)', margin: '0 0 4px 0' }}>
                {eq.model}
              </p>
              <ul className="order-summary-list">
                {eq.consumables.map((c, i) => {
                  const qty = quantities[i] ?? 0;
                  if (qty === 0) return null;
                  return <li key={i} style={{ font: 'var(--mobile-body)' }}>{qty}x {c.name}</li>;
                })}
              </ul>
            </div>
          );
        })}
        <div style={{ marginTop: 'var(--space-xs)' }}><Duolist boldColumn="first">
          <DuolistGroup
            term="Levering"
            description={
              order.delivery === 'post' ? order.addr
              : order.delivery === 'hentes' ? 'Hentes på lokasjon1'
              : 'Hentes på lokasjon2'
            }
          />
          {order.telefon && <DuolistGroup term="Telefon" description={order.telefon} />}
          {order.comment && <DuolistGroup term="Kommentar" description={order.comment} />}
        </Duolist></div>
      </ExpanderList.Expander>
    </ExpanderList>
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
    <>
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back">
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="page-divider" />
      <div className="bhm-page-content">

      <h1 style={{ font: 'var(--mobile-h1)', margin: 0 }}>Behandlings&shy;hjelpemidler</h1>
      <p style={{ font: 'var(--mobile-preamble)', margin: 0 }}>
        Her finner du utstyret ditt, kan bestille forbruksmateriell og se bestillingshistorikk.
      </p>

      {mostRecent && (
        <div style={{ marginTop: '1rem' }}>
          <NotificationPanel variant="success" label="Bestilling er mottatt">
            Bestillingen din fra {mostRecent.date} er registrert. Du får bekreftelse på e-post.
          </NotificationPanel>
        </div>
      )}

      <section>
        <h2 className="section-h2">Ditt utstyr</h2>
        <LinkList variant="line" color="white" chevron>
          {activeEquipment.map(eq => {
            const status = getEquipStatus(eq);
            return (
              <LinkList.Link
                key={eq.id}
                htmlMarkup="button"
                onClick={() => onShowMachine(eq.id)}
                icon={<img src={EQUIPMENT_ICON} alt="" aria-hidden="true" width={40} height={40} />}
              >
                <ElementHeader>
                  {status === 'active-order' && <StatusDot variant="inprocess" text="Under levering" />}
                  <ElementHeader.Text firstText={eq.name} firstTextEmphasised />
                  <ElementHeader.Text firstText={eq.model} subText />
                </ElementHeader>
              </LinkList.Link>
            );
          })}
          {deaktivertEquipment.map(eq => (
            <LinkList.Link
              key={eq.id}
              htmlMarkup="button"
              onClick={() => onShowMachine(eq.id)}
              icon={<img src={EQUIPMENT_ICON} alt="" aria-hidden="true" width={40} height={40} />}
            >
              <ElementHeader>
                <StatusDot variant="cancelled" text="Deaktivert" />
                <ElementHeader.Text firstText={eq.name} firstTextEmphasised />
                <ElementHeader.Text firstText={eq.model} subText />
              </ElementHeader>
            </LinkList.Link>
          ))}
        </LinkList>
      </section>

      <div style={{ height: 'var(--space-s)' }} />

      <div style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
        <Button variant="fill" onClick={() => onStartOrder(null, 'forside')}>
          Bestill forbruksvarer
        </Button>
      </div>

      <div style={{ height: 'var(--space-xs)' }} />

      {submittedOrders.length > 0 && (
        <section>
          <h2 className="section-h2">Aktive bestillinger</h2>
          {[...submittedOrders].reverse().map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </section>
      )}

      <button className="btn-borderless" onClick={onShowHistory} style={{ marginTop: '2rem', alignSelf: 'flex-start' }}>
        Bestillingshistorikk
      </button>

      </div>

      <footer style={{
        background: '#2B2C2B',
        color: '#fff',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: 'var(--space-l)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>
            <Icon svgIcon={MobilePhone} size={24} color="white" />
            <span>23 32 70 00 / Veiledning Helsenorge</span>
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>
            <Icon svgIcon={HelpSign} size={24} color="white" />
            <span>Hjelp og kontakt</span>
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>
            <Icon svgIcon={Globe} size={24} color="white" />
            <span>English | Davvisámegillii</span>
          </a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #fff', margin: 0, opacity: 0.3 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>Personvern</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>Tilgjengelegheitserklæring</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>Endre samtykke og reservasjoner</a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #fff', margin: 0, opacity: 0.3 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>Last ned appen</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>Om Helsenorge</a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none', font: 'var(--mobile-body)' }}>Svindelforsøk og falske nettsider</a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #fff', margin: 0, opacity: 0.3 }} />

        <p style={{ margin: 0, font: 'var(--mobile-body-strong)', color: '#fff' }}>Drives av Norsk helsenett SF</p>
      </footer>
    </>
  );
}
