import { useState } from 'react';
import { ArrowRight, CheckCircle2, QrCode, Scale, X } from 'lucide-react';
import QRCode from 'react-qr-code';

const money = (value) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function calculateSettlements(summary) {
  const creditors = summary.filter((person) => person.net > 0.01).map((person) => ({ ...person }));
  const debtors = summary.filter((person) => person.net < -0.01).map((person) => ({ ...person, net: Math.abs(person.net) }));
  const settlements = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const amount = Math.min(debtors[debtorIndex].net, creditors[creditorIndex].net);
    settlements.push({ fromId: debtors[debtorIndex].id, toId: creditors[creditorIndex].id, amount });
    debtors[debtorIndex].net -= amount;
    creditors[creditorIndex].net -= amount;
    if (debtors[debtorIndex].net < 0.01) debtorIndex += 1;
    if (creditors[creditorIndex].net < 0.01) creditorIndex += 1;
  }
  return settlements;
}

export default function Payment({ summary, roommates, setActiveTab }) {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const roommateMap = Object.fromEntries(roommates.map((person) => [person.id, person]));
  const settlements = calculateSettlements(summary || []);
  const generateUpiLink = (receiverId, amount) => {
    const receiver = roommateMap[receiverId];
    if (!receiver?.upiId) return '';
    return `upi://pay?pa=${receiver.upiId}&pn=${encodeURIComponent(receiver.name)}&am=${amount.toFixed(2)}&cu=INR`;
  };

  return (
    <div className="space-y-6 animate-fade-in" >

      {settlements.length === 0 ? (
        <section className="surface-card flex flex-col items-center px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-50 text-emerald-600"><CheckCircle2 className="h-7 w-7" /></span>
          <h3 className="mt-4 text-xl font-semibold text-ink">All settled</h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">There are no open balances. Your group is beautifully even.</p>
        </section>
      ) : (
        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5"><p className="section-kicker">Payment plan</p><h3 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Who should pay whom</h3></div>
          <div className="space-y-3">
            {settlements.map((item, index) => {
              const payer = roommateMap[item.fromId];
              const receiver = roommateMap[item.toId];
              const hasUpi = Boolean(receiver?.upiId);
              return (
                <div key={`${item.fromId}-${item.toId}-${index}`} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="avatar">{payer?.name?.charAt(0).toUpperCase()}</div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink"><span>{payer?.name}</span><ArrowRight className="h-4 w-4 text-violet-500" /><span>{receiver?.name}</span></div>
                        <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-coral-600">{money(item.amount)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch gap-1 sm:items-end">
                      <button disabled={!hasUpi} onClick={() => setSelectedPayment({ ...item })} className="btn-primary w-auto disabled:cursor-not-allowed disabled:opacity-40"><QrCode className="h-4 w-4" /> Pay via UPI</button>
                      {!hasUpi && <button onClick={() => setActiveTab('names')} className="text-button justify-center sm:justify-end">Add {receiver?.name}'s UPI ID</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selectedPayment && (
        <div  className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="UPI payment QR code" onClick={() => setSelectedPayment(null)}>
          <div className="scanner-Card w-full max-w-sm rounded-[26px] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div><p className="section-kicker">Scan and pay</p><h3 className="section-title">UPI payment</h3></div>
              <button onClick={() => setSelectedPayment(null)} className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100" aria-label="Close QR code"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 flex justify-center rounded-2xl border border-slate-100 bg-white p-5"><QRCode size={190} value={generateUpiLink(selectedPayment.toId, selectedPayment.amount)} /></div>
            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">Pay {roommateMap[selectedPayment.toId]?.name}</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink">{money(selectedPayment.amount)}</p>
              <p className="mt-1 text-xs text-slate-400">{roommateMap[selectedPayment.toId]?.upiId}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
