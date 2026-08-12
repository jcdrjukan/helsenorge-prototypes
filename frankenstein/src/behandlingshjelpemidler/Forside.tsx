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
import type { Equipment, SubmittedOrder, AppView } from './data';
import { EQUIPMENT_ICON } from './data';

interface OrderCardProps {
  order: SubmittedOrder;
}

function OrderCard({ order }: OrderCardProps) {
  const [open, setOpen] = useState(false);

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
      <span style={{ display: 'block', font: 'var(--mobile-body-strong)' }}>{machineNames}</span>
      <span style={{ display: 'block', font: 'var(--mobile-body)' }}>{order.date}</span>
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

interface ForsideProps {
  equipment: Equipment[];
  submittedOrders: SubmittedOrder[];
  justSubmittedId: string | null;
  onShowMachine: (eqId: string) => void;
  onStartOrder: (eqId: string | null, from: AppView) => void;
  onShowHistory: () => void;
}

export default function Forside({
  equipment,
  submittedOrders,
  justSubmittedId,
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

  const justSubmitted = submittedOrders.find(o => o.id === justSubmittedId) ?? null;

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

      <h1 style={{ font: 'var(--mobile-h1)', margin: '8px 0 0 0' }}>Behandlings&shy;hjelpemidler</h1>
      <p style={{ font: 'var(--mobile-body)', margin: 0 }}>
        Her finner du utstyret ditt, kan bestille forbruksmateriell og se bestillingshistorikk.
      </p>

      {justSubmitted && (
        <div style={{ marginTop: '1rem' }}>
          <NotificationPanel variant="success" label="Bestilling er mottatt">
            {justSubmitted.delivery === 'hentes' || justSubmitted.delivery === 'hentes2'
              ? 'Du vil få beskjed når ordren er klar til henting. '
              : 'Ordren sendes vanligvis innen 1-2 arbeidsdager. '}
            Dersom du har spørsmål om din bestilling kan du kontakte Regional enhet for behandlingshjelpemidler. Tel: 72 57 63 00
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
                  {status === 'active-order' && <StatusDot variant="inprocess" text="aktiv bestilling" />}
                  <ElementHeader.Text firstText={eq.model} firstTextEmphasised />
                  <ElementHeader.Text firstText={eq.details.type} subText />
                  {eq.units && eq.units.length > 1 && (
                    <ElementHeader.Text firstText={`(${eq.units.length} enheter)`} subText />
                  )}
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
                <StatusDot variant="cancelled" text="Deaktivert. Skal returneres." />
                <ElementHeader.Text firstText={eq.model} firstTextEmphasised />
                <ElementHeader.Text firstText={eq.details.type} subText />
                {eq.units && eq.units.length > 1 && (
                  <ElementHeader.Text firstText={`(${eq.units.length} enheter)`} subText />
                )}
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
          <div className="history-list">
            {[...submittedOrders].reverse().map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
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
