import { getBadgeColor, getTextColor } from '../utils/colors';

export default function RoommatePanel({ roommates, roommateInput, setRoommateInput, addRoommate, removeRoommate, clearAllNames }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <label className="text-sm font-semibold text-sky-700">Add Roommate</label>
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          <input value={roommateInput} onChange={(e) => setRoommateInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addRoommate()} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100" placeholder="Enter roommate name" />
          <button onClick={addRoommate} className="rounded-full bg-gradient-to-r from-sky-600 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-glass transition hover:-translate-y-0.5 hover:from-sky-700 hover:to-blue-600">Add</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={clearAllNames} className="rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">Delete All Names</button>
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Roommates</h2>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">{roommates.length} total</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {roommates.length ? roommates.map((name, idx) => {
            const bg = getBadgeColor(idx, name);
            return (
              <span key={name} className="inline-flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold shadow-sm" style={{ background: bg, color: getTextColor(bg) }}>
                {name}
                <button onClick={() => removeRoommate(idx)} className="rounded-full bg-white/90 p-1 text-red-600 hover:bg-red-600 hover:text-white">✕</button>
              </span>
            );
          }) : <p className="text-slate-400">No roommates yet.</p>}
        </div>
      </aside>
    </div>
  );
}
