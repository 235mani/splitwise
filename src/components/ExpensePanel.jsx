import { Edit2Icon, TrashIcon } from 'lucide-react';
import { getBadgeColor, getTextColor } from '../utils/colors';


function UserChip({ roommate, roommates }) {
  const idx = roommates.findIndex((r) => r.id === roommate.id);

  const bg = getBadgeColor(
    idx >= 0 ? idx : 0,
    roommate.name
  );

  const textColor = getTextColor(bg);

  return (
    <div className="flex items-center gap-2 rounded-full bg-slate-50 border border-slate-100 px-2 py-1">
      <div
        className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
        style={{
          background: bg,
          color: textColor,
        }}
      >
        {roommate.name.charAt(0).toUpperCase()}
      </div>

      <span className="text-xs font-medium text-slate-700">
        {roommate.name}
      </span>
    </div>
  );
}

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
  const roommateMap = Object.fromEntries(
    roommates.map((roommate) => [
      roommate.id,
      roommate,
    ])
  );
  return (
    <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] animate-fade-in">
      {/* Add Expense Form */}
      <section className="surface-card p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <p className="section-kicker">Expenses</p>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-ink">Add a shared expense</h2>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">What was this for?</label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="input-premium"
            placeholder="EX: Dinner, Groceries, Wi-Fi, Tickets..."
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Amount (₹)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExpense()}
            className="input-premium text-lg font-semibold"
            placeholder="0.00"
          />
          <p className="text-xs text-slate-400 mt-1">Tip: Use + to add multiple amounts (e.g., 100+50+75)</p>
        </div>

        {/* Date & Payer */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="input-premium"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Who paid?</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="input-premium"
            >
              {roommates.map((roommate) => (
                <option
                  key={roommate.id}
                  value={roommate.id}
                >
                  {roommate.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Among */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-slate-700">Split among:</span>
            <button
              type="button"
              onClick={() => setSplitAmong(roommates.map((roommate) => ({ id: roommate.id, name: roommate.name, checked: true })))}
              className="btn-secondary px-2.5 py-1 text-xs"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => setSplitAmong(roommates.map((roommate) => ({ id: roommate.id, name: roommate.name, checked: false })))}
              className="btn-secondary px-2.5 py-1 text-xs"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {splitAmong.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-soft-xs ring-1 ring-slate-100 cursor-pointer transition hover:shadow-soft-md"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() =>
                    setSplitAmong(
                      splitAmong.map((entry) =>
                        entry.id === item.id
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
            className="btn-primary flex-1"
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
        <div className="mb-3 flex items-center justify-between px-1 py-2">
          <div className="flex gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink">Expense history</h2>
            <button
              onClick={deleteAllExpenses}
              className="rounded-lg p-1.5 hover:bg-red-50 transition text-red-600"
              title="Delete all expenses"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
            {expenses.length}
          </span>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          {expenses.length ? (
            expenses.map((e, i) => {
              const payer = roommateMap[e.paidBy];
              const payerIdx = roommates.findIndex((r) => r.id === e.paidBy);
              const payerBg = getBadgeColor(
                payerIdx >= 0 ? payerIdx : 0,
                payer?.name ?? 'Unknown'
              );
              const payerText = getTextColor(payerBg);

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
                        className="rounded-lg p-1.5 hover:bg-red-50 transition text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-bold text-indigo-600 text-base mb-3">
                    ₹{e.amount.toFixed(2)}
                  </p>

                  <div className="space-y-3">
                    {/* Paid By */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-600">Paid by:</span>

                      {payer && (
                        <UserChip
                          roommate={payer}
                          roommates={roommates}
                        />
                      )}
                    </div>

                    {/* Split Among */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs text-slate-600">Split among:</span>

                      {e.splitAmong.map((roommateId) => {
                        const roommate = roommateMap[roommateId];

                        return roommate ? (
                          <UserChip
                            key={roommateId}
                            roommate={roommate}
                            roommates={roommates}
                          />
                        ) : null;
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
