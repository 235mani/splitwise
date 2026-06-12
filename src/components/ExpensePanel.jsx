import { getBadgeColor, getTextColor } from '../utils/colors';

export default function ExpensePanel({
  desc, setDesc,
  amount, setAmount,
  expenseDate, setExpenseDate,
  paidBy, setPaidBy,
  roommates,
  splitAmong, setSplitAmong,
  addExpense,
  editIndex,
  cancelEdit,
  expenses,
  editExpense,
  deleteExpense,
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Add Expense</h2>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" placeholder="Ex: Dinner, Lunch, Rice, Groceries" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExpense()} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" placeholder="Amount (Ex: 30 Or 3+100+40)" />
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-600">Date (optional)
            <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" />
          </label>
          <label className="text-sm text-slate-600">Who paid?
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100">
              {roommates.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Split among</span>
            <button type="button" onClick={() => setSplitAmong(roommates.map((name) => ({ name, checked: true })))} className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-200">Select All</button>
            <button type="button" onClick={() => setSplitAmong(roommates.map((name) => ({ name, checked: false })))} className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Unselect All</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {splitAmong.map((item) => (
              <label key={item.name} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
                <input type="checkbox" checked={item.checked} onChange={() => setSplitAmong(splitAmong.map((entry) => entry.name === item.name ? { ...entry, checked: !entry.checked } : entry))} className="custom-checkbox" />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={addExpense} className="rounded-full bg-gradient-to-r from-sky-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glass transition hover:-translate-y-0.5 hover:from-sky-700 hover:to-blue-600">{editIndex !== null ? 'Update Expense' : 'Split Expense'}</button>
          {editIndex !== null && <button onClick={cancelEdit} className="rounded-full bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-300">Cancel</button>}
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Expense Log</h2>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">{expenses.length} entries</span>
        </div>
        <ul className="mt-4 space-y-3">
          {expenses.length ? expenses.map((e, i) => {
            const payerIdx = roommates.findIndex((r) => r === e.paidBy);
            const bg = getBadgeColor(payerIdx >= 0 ? payerIdx : 0, e.paidBy);
            const text = getTextColor(bg);
            return (
              <li key={`${e.desc}-${i}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-800">{e.desc}</p>
                    <p className="mt-1 text-sm text-slate-500">{e.date ? new Date(e.date).toLocaleDateString() : 'No date'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => editExpense(i)} className="rounded-lg p-2 text-amber-500 hover:bg-amber-50">✎</button>
                    <button onClick={() => deleteExpense(i)} className="rounded-lg p-2 text-red-600 hover:bg-red-50">🗑️</button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold text-sky-700">Amount: ₹{e.amount.toFixed(2)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">Paid by <span className="rounded-xl px-2 py-1 text-xs font-semibold" style={{ background: bg, color: text }}>{e.paidBy}</span></div>
                <div className="mt-3 flex flex-wrap gap-2">{e.splitAmong.map((name) => {
                  const idx = roommates.findIndex((r) => r === name);
                  const c = getBadgeColor(idx >= 0 ? idx : 0, name);
                  return <span key={name} className="rounded-xl px-2 py-1 text-xs font-semibold" style={{ background: c, color: getTextColor(c) }}>{name}</span>;
                })}</div>
              </li>
            );
          }) : <li className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-center text-slate-400">No expenses added yet.</li>}
        </ul>
      </aside>
    </div>
  );
}
