import { Edit2Icon, TrashIcon } from 'lucide-react';
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
  deleteAllExpenses,
}) {
  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Add Expense Form */}
      <section className="premium-card p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Add expense</h2>
          <p className="text-sm text-slate-500">Split shared costs with roommates</p>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">What was this for?</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="input-premium w-full"
            placeholder="E.g., Dinner, Groceries, Wifi..."
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Amount (₹)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExpense()}
            className="input-premium w-full text-lg font-semibold"
            placeholder="0.00"
          />
          <p className="text-xs text-slate-500 mt-1">Tip: Use + to add multiple amounts (e.g., 100+50+75)</p>
        </div>

        {/* Date & Payer */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Who paid?</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="input-premium w-full"
            >
              {roommates.map((roommate) => (
                <option
                  key={roommate.name}
                  value={roommate.name}
                >
                  {roommate.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Among */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 p-4 border border-indigo-100/50">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-slate-700">Split among:</span>
            <button
              type="button"
              onClick={() => setSplitAmong(roommates.map((roommate) => ({ name: roommate.name, checked: true })))}
              className="btn-secondary px-2.5 py-1 text-xs"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setSplitAmong(roommates.map((roommate) => ({ name: roommate.name, checked: false })))}
              className="btn-secondary px-2.5 py-1 text-xs"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {splitAmong.map((item) => (
              <label
                key={item.name}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-soft-xs ring-1 ring-slate-100 cursor-pointer transition hover:shadow-soft-md"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() =>
                    setSplitAmong(
                      splitAmong.map((entry) =>
                        entry.name === item.name
                          ? { ...entry, checked: !entry.checked }
                          : entry
                      )
                    )
                  }
                  className="custom-checkbox"
                />
                {item.name}
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4">
          <button
            onClick={addExpense}
            className="btn-premium flex-1"
          >
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
          {editIndex !== null && (
            <button
              onClick={cancelEdit}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      {/* Expense Log */}
      <aside className="flex flex-col">
        <div className="flex items-center justify-between m-3">
          <div className="flex gap-3">
            <h2 className="text-2xl font-bold text-slate-900">History</h2>
            <button
              onClick={deleteAllExpenses}
              className="rounded-lg p-1.5 hover:bg-red-50 transition text-red-600"
              title="Delete all expenses"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            {expenses.length}
          </span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {expenses.length ? (
            expenses.map((e, i) => {
              const payerIdx = roommates.findIndex((r) => r.name === e.paidBy);
              const bg = getBadgeColor(payerIdx >= 0 ? payerIdx : 0, e.paidBy);
              const text = getTextColor(bg);
              return (
                <div
                  key={`${e.desc}-${i}`}
                  className="premium-card p-4 hover:shadow-soft-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{e.desc}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {e.date ? new Date(e.date).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => editExpense(i)}
                        className="rounded-lg p-1.5 hover:bg-amber-50 transition text-amber-600"
                      >
                        <Edit2Icon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteExpense(i)}
                        className="text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-bold text-indigo-600 text-base mb-2">₹{e.amount.toFixed(2)}</p>

                  <div className="text-xs space-y-2">
                    <p className="text-slate-600">
                      Paid by{' '}
                      <span
                        className="font-semibold rounded-lg px-2 py-1 inline-block"
                        style={{ background: bg, color: text }}
                      >
                        {e.paidBy}
                      </span>
                    </p>
                    <div className="flex items-center flex-wrap gap-1">
                      <p className="text-slate-600"> Split among: </p>
                      {e.splitAmong.map((name) => {
                        const idx = roommates.findIndex((r) => r.name === name);
                        const c = getBadgeColor(idx >= 0 ? idx : 0, name);

                        return (
                          <span
                            key={name}
                            className="rounded-lg px-2 py-1 font-semibold"
                            style={{ background: c, color: getTextColor(c) }}
                          >
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No expenses yet</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
