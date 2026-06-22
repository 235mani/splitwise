export default function SummaryPanel({ summary }) {
  if (!summary.length) {
    return (
      <section>
        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Financial Summary
          </h2>
          <p className="text-sm text-slate-600">
            Overview of expenses and settlements
          </p>
        </div>

        <div className="premium-card py-20 text-center">
          <div className="mb-4 text-5xl">💸</div>

          <h3 className="text-lg font-semibold text-slate-700">
            No expenses yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add your first expense to see the summary.
          </p>
        </div>
      </section>
    );
  }

  const totalExpenses = summary.reduce(
    (sum, person) => sum + person.paid,
    0
  );

  const sortedSummary = [...summary].sort(
    (a, b) => b.net - a.net
  );

  return (
    <section>
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Financial Summary
        </h2>

        <p className="text-sm text-slate-600">
          Overview of expenses and settlements
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <div className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Total Expenses
          </p>

          <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            ₹{totalExpenses.toFixed(2)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All transactions combined
          </p>
        </div>

        <div className="premium-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Members
          </p>

          <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            {summary.length}
          </p>
        </div>
      </div>
      {/* Settlement Overview */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Settlement Overview
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Final balances for each member
        </p>
      </div>

      <div className="space-y-4">
        {sortedSummary.map((item) => {
          const getsBack = item.net > 0;
          const needsToPay = item.net < 0;

          return (
            <div
              key={item.id}
              className="premium-card p-5 border-l-4"
              style={{
                borderLeftColor: getsBack
                  ? '#10b981'
                  : needsToPay
                    ? '#ef4444'
                    : '#94a3b8',
              }}
            >
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${getsBack
                        ? 'bg-emerald-100 text-emerald-700'
                        : needsToPay
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 capitalize truncate">
                    {item.name}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <p
                    className={`text-2xl font-bold ${getsBack
                        ? 'text-emerald-600'
                        : needsToPay
                          ? 'text-rose-600'
                          : 'text-slate-600'
                      }`}
                  >
                    {getsBack
                      ? `+₹${item.net.toFixed(2)}`
                      : needsToPay
                        ? `-₹${Math.abs(item.net).toFixed(2)}`
                        : '₹0.00'}
                  </p>

                  <p
                    className={`text-sm ${getsBack
                        ? 'text-emerald-700'
                        : needsToPay
                          ? 'text-rose-700'
                          : 'text-slate-500'
                      }`}
                  >
                    {getsBack
                      ? 'Gets Back'
                      : needsToPay
                        ? 'Needs To Pay'
                        : 'Settled'}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Paid
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    ₹{item.paid.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}