import { darkenHex, getBadgeColor, hexToRgb } from '../utils/colors';
import { buildBalanceMatrix, getAllNames } from '../utils/expenseLogic';

function formatExpenseLabel(expense) {
  if (!expense) return '';
  const dateLabel = expense.date ? ` · ${new Date(expense.date).toLocaleDateString()}` : '';
  return `${expense.desc}${dateLabel}`;
}

export default function DetailedPanel({ roommates, expenses, showTransactions, setShowTransactions }) {
  const allNames = getAllNames(roommates, expenses);
  const matrix = buildBalanceMatrix(allNames, expenses);

  const rows = allNames.map((name) => {
    const paymentDue = [];
    const paymentReceivable = [];

    allNames.forEach((other) => {
      if (name === other) return;

      if (showTransactions) {
        expenses.forEach((expense) => {
          if (expense.paidBy === other && expense.splitAmong.includes(name)) {
            paymentDue.push({ other, share: expense.amount / expense.splitAmong.length, expense });
          }
          if (expense.paidBy === name && expense.splitAmong.includes(other)) {
            paymentReceivable.push({ other, share: expense.amount / expense.splitAmong.length, expense });
          }
        });
        return;
      }

      const owes = matrix[name]?.[other] ?? 0;
      const gets = matrix[other]?.[name] ?? 0;

      if (owes > 0.009) paymentDue.push({ other, share: owes });
      if (gets > 0.009) paymentReceivable.push({ other, share: gets });
    });

    const totalSpent = expenses
      .filter((expense) => expense.paidBy === name)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const totalOwes = paymentDue.reduce((sum, item) => sum + item.share, 0);
    const totalGets = paymentReceivable.reduce((sum, item) => sum + item.share, 0);

    let summaryText = 'Settled';
    if (totalGets > totalOwes + 0.009) summaryText = `Gets ₹${(totalGets - totalOwes).toFixed(2)}`;
    else if (totalOwes > totalGets + 0.009) summaryText = `To pay ₹${(totalOwes - totalGets).toFixed(2)}`;

    return { name, totalSpent, summaryText, paymentDue, paymentReceivable };
  });

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Detailed Summary</h2>
        <button
          type="button"
          onClick={() => setShowTransactions((prev) => !prev)}
          aria-label="Toggle detailed transaction view"
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${showTransactions ? 'bg-sky-600' : 'bg-slate-200'}`}
        >
          <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition ${showTransactions ? 'translate-x-7' : ''}`} />
        </button>
      </div>

      <ul className="mt-5 space-y-4">
        {rows.map((row) => {
          const userIdx = roommates.findIndex((person) => person === row.name);
          const userColor = getBadgeColor(userIdx >= 0 ? userIdx : 0, row.name);
          const userDark = darkenHex(userColor, 0.2);
          const shadow = hexToRgb(userColor);

          return (
            <li
              key={row.name}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              style={{ borderLeft: `3px solid ${userDark}`, boxShadow: `0 12px 30px rgba(${shadow.r}, ${shadow.g}, ${shadow.b}, 0.12)` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-sky-700">{row.name}</p>
                  <p className="text-sm text-slate-500">{row.summaryText}</p>
                </div>
                <span className="text-sm font-semibold text-slate-700">Total spent: ₹{row.totalSpent.toFixed(2)}</span>
              </div>

              <ul className="mt-3 space-y-2">
                {row.paymentDue.length ? (
                  row.paymentDue.map((item) => (
                    <li key={`${row.name}-due-${item.other}-${item.expense?.desc || 'summary'}`} className="rounded-xl border border-rose-100 bg-rose-50/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-rose-700">To pay {item.other}</span>
                        <span className="text-sm font-semibold text-rose-700">₹{item.share.toFixed(2)}</span>
                      </div>
                      {item.expense && <p className="mt-1 text-xs text-slate-500">{formatExpenseLabel(item.expense)}</p>}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400">No payment due</li>
                )}

                {row.paymentReceivable.length ? (
                  row.paymentReceivable.map((item) => (
                    <li key={`${row.name}-get-${item.other}-${item.expense?.desc || 'summary'}`} className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-sm font-semibold text-emerald-700">To receive from {item.other}</span>
                        <span className="text-sm font-semibold text-emerald-700">₹{item.share.toFixed(2)}</span>
                      </div>
                      {item.expense && <p className="mt-1 text-xs text-slate-500">{formatExpenseLabel(item.expense)}</p>}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-400">No amount receivable</li>
                )}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
