export default function SummaryPanel({ summary }) {
  return (
    <section className="premium-card p-8">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Financial Summary</h2>
        <p className="text-sm text-slate-600">Real-time balance overview for all members</p>
      </div>

      <div className="space-y-4">
        {summary.length > 0 ? (
          summary.map((item) => {
            const isOwed = item.net > 0;
            const owes = item.net < 0;
            const settled = item.net === 0;

            return (
              <div
                key={item.name}
                className="premium-card p-6 border-l-4"
                style={{
                  borderLeftColor: isOwed ? '#10b981' : owes ? '#ef4444' : '#94a3b8',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <div
                    className="rounded-full px-4 py-2 font-bold text-sm"
                    style={{
                      color: isOwed ? '#10b981' : owes ? '#ef4444' : '#64748b',
                      background: isOwed ? 'rgba(16, 185, 129, 0.1)' : owes ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    }}
                  >
                    {isOwed
                      ? `✓ +₹${item.net.toFixed(2)}`
                      : owes
                      ? `✕ -₹${Math.abs(item.net).toFixed(2)}`
                      : 'Settled'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-50/50 p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Paid Out</p>
                    <p className="text-2xl font-bold text-slate-900">₹{item.gets.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Owes</p>
                    <p className="text-2xl font-bold text-slate-900">₹{item.owes.toFixed(2)}</p>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${Math.abs(item.net) / Math.max(item.gets, item.owes, 1) * 100}%`,
                      background: isOwed
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : owes
                        ? 'linear-gradient(90deg, #ef4444, #f87171)'
                        : '#cbd5e1',
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg font-medium">No expenses yet</p>
            <p className="text-slate-400 text-sm mt-2">Add an expense to see the summary</p>
          </div>
        )}
      </div>
    </section>
  );
}
