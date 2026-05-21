import { useState } from 'react';
import './style.css';
import BhmHeader from './BhmHeader';
import Forside from './Forside';
import MachinePage from './MachinePage';
import OrderWizard from './OrderWizard';
import HistoryView from './HistoryView';
import type { AppView, DeliveryForm, DeliveryMode, SubmittedOrder } from './data';
import { EQUIPMENT, HISTORY_ENTRIES } from './data';

function initQuantities(): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  for (const eq of EQUIPMENT) {
    result[eq.id] = eq.consumables.map(() => 0);
  }
  return result;
}

const DEFAULT_DELIVERY: DeliveryForm = {
  mode: 'post',
  navn: 'Tora Hansen',
  gate: 'Kirkeveien 84B',
  postnr: '7010',
  sted: 'Trondheim',
  telefon: '99 88 77 66',
};

export default function Behandlingshjelpemidler() {
  const [view, setView] = useState<AppView>('forside');
  const [selectedEqId, setSelectedEqId] = useState<string | null>(null);
  const [orderOrigin, setOrderOrigin] = useState<{ view: AppView; eqId: string | null }>({
    view: 'forside',
    eqId: null,
  });
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [quantities, setQuantities] = useState<Record<string, number[]>>(initQuantities);
  const [delivery, setDelivery] = useState<DeliveryForm>(DEFAULT_DELIVERY);
  const [deliveryErrors, setDeliveryErrors] = useState<Partial<Record<keyof DeliveryForm, string>>>({});
  const [comment, setComment] = useState('');
  const [orderedDates, setOrderedDates] = useState<Record<string, Date>>({});
  const [submittedOrders, setSubmittedOrders] = useState<SubmittedOrder[]>([]);
  const [showAbandonAlert, setShowAbandonAlert] = useState(false);

  // ── Navigation helpers ────────────────────────────────────────────────────

  const showMachine = (eqId: string) => {
    setSelectedEqId(eqId);
    setView('machine');
  };

  const startOrder = (eqId: string | null, from: AppView) => {
    setOrderOrigin({ view: from, eqId });
    // If coming from a specific machine, pre-open that accordion in step1
    setSelectedEqId(eqId);
    setCurrentStep(1);
    setView('order');
  };

  const handleOrderNext = () => {
    if (currentStep === 2) {
      // Validate delivery
      const errors: Partial<Record<keyof DeliveryForm, string>> = {};
      if (delivery.mode === 'post') {
        if (!delivery.navn.trim()) errors.navn = 'Navn er påkrevd';
        if (!delivery.gate.trim()) errors.gate = 'Gateadresse er påkrevd';
        if (!delivery.postnr.trim()) errors.postnr = 'Postnummer er påkrevd';
        if (!delivery.sted.trim()) errors.sted = 'Poststed er påkrevd';
        if (!delivery.telefon.trim()) errors.telefon = 'Telefonnummer er påkrevd';
      }
      setDeliveryErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleOrderBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const resetOrder = () => {
    setQuantities(initQuantities());
    setDelivery(DEFAULT_DELIVERY);
    setDeliveryErrors({});
    setComment('');
    setCurrentStep(1);
    setSelectedEqId(null);
  };

  const submitOrder = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('nb-NO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const equipmentItems = EQUIPMENT.filter(eq => !eq.deaktivert)
      .map(eq => ({ eq, quantities: quantities[eq.id] ?? eq.consumables.map(() => 0) }))
      .filter(({ quantities: qtys }) => qtys.some(q => q > 0));

    // Update orderedDates for rate-limiting
    const newOrderedDates = { ...orderedDates };
    for (const { eq, quantities: qtys } of equipmentItems) {
      eq.consumables.forEach((_, i) => {
        if ((qtys[i] ?? 0) > 0) {
          newOrderedDates[`${eq.id}-${i}`] = now;
        }
      });
    }
    setOrderedDates(newOrderedDates);

    const addrStr =
      delivery.mode === 'post'
        ? `${delivery.gate}, ${delivery.postnr} ${delivery.sted}`.trim()
        : delivery.mode === 'hentes'
        ? 'St. Olavs sykehus, Medisinsk utstyrssentralen'
        : 'St. Olavs sykehus, Poliklinisk skranke';

    const newOrder: SubmittedOrder = {
      id: `order-${Date.now()}`,
      date: dateStr,
      equipmentItems,
      delivery: delivery.mode as DeliveryMode,
      addr: addrStr,
      navn: delivery.navn,
      telefon: delivery.telefon,
      comment,
    };

    setSubmittedOrders(prev => [...prev, newOrder]);
    resetOrder();
    setView('forside');
  };

  const handleDeliveryChange = (field: keyof DeliveryForm, value: string) => {
    setDelivery(prev => ({ ...prev, [field]: value }));
    if (deliveryErrors[field]) {
      setDeliveryErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChangeQty = (eqId: string, idx: number, delta: number) => {
    setQuantities(prev => {
      const arr = [...(prev[eqId] ?? EQUIPMENT.find(e => e.id === eqId)!.consumables.map(() => 0))];
      arr[idx] = Math.max(0, (arr[idx] ?? 0) + delta);
      return { ...prev, [eqId]: arr };
    });
  };

  const getOriginLabel = () => {
    if (orderOrigin.view === 'machine' && orderOrigin.eqId) {
      const eq = EQUIPMENT.find(e => e.id === orderOrigin.eqId);
      return eq ? eq.model : 'Behandlingshjelpemidler';
    }
    return 'Behandlingshjelpemidler';
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bhm-page">
      <BhmHeader />

      {view === 'forside' && (
        <Forside
          equipment={EQUIPMENT}
          submittedOrders={submittedOrders}
          onShowMachine={showMachine}
          onStartOrder={startOrder}
          onShowHistory={() => setView('history')}
        />
      )}

      {view === 'machine' && selectedEqId && (() => {
        const eq = EQUIPMENT.find(e => e.id === selectedEqId);
        if (!eq) return null;
        return (
          <MachinePage
            eq={eq}
            orderedDates={orderedDates}
            onBack={() => { setSelectedEqId(null); setView('forside'); }}
            onStartOrder={startOrder}
          />
        );
      })()}

      {view === 'order' && (
        <OrderWizard
          currentStep={currentStep}
          originLabel={getOriginLabel()}
          equipment={EQUIPMENT}
          quantities={quantities}
          orderedDates={orderedDates}
          focusedEqId={orderOrigin.eqId}
          delivery={delivery}
          deliveryErrors={deliveryErrors}
          comment={comment}
          showAbandonAlert={showAbandonAlert}
          onChangeQty={handleChangeQty}
          onDeliveryChange={handleDeliveryChange}
          onCommentChange={setComment}
          onNext={handleOrderNext}
          onBack={handleOrderBack}
          onAbandonRequest={() => setShowAbandonAlert(true)}
          onAbandonConfirm={() => {
            setShowAbandonAlert(false);
            resetOrder();
            if (orderOrigin.view === 'machine' && orderOrigin.eqId) {
              setSelectedEqId(orderOrigin.eqId);
              setView('machine');
            } else {
              setView('forside');
            }
          }}
          onAbandonCancel={() => setShowAbandonAlert(false)}
          onSubmit={submitOrder}
          onGoToStep={setCurrentStep}
        />
      )}

      {view === 'history' && (
        <HistoryView
          submittedOrders={submittedOrders}
          historyEntries={HISTORY_ENTRIES}
          onBack={() => setView('forside')}
        />
      )}
    </div>
  );
}
