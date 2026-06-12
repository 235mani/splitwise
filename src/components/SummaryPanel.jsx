export default function SummaryPanel({ summary }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800">Summary</h2>
      <ul className="mt-4 space-y-3">{summary.map((item) => (
        <li key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
          <div>
            <p className="text-base font-semibold text-sky-700">{item.name}</p>
            <p className="text-sm text-slate-500">Owes ₹{item.owes.toFixed(2)} · Receives ₹{item.gets.toFixed(2)}</p>
          </div>
          <span className={`text-sm font-semibold ${item.net > 0 ? 'text-emerald-600' : item.net < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
            {item.net > 0 ? `Net +₹${item.net.toFixed(2)}` : item.net < 0 ? `Net -₹${Math.abs(item.net).toFixed(2)}` : 'Settled'}
          </span>
        </li>
      ))}</ul>
    </section>
  );
}
