export default function Header() {
  return (
    <header className="glass-panel rounded-3xl shadow-soft-lg p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-blue-500 text-xl font-black text-white shadow-glass">SW</div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-600">Room expense manager</p>
            <h1 className="text-3xl font-semibold text-slate-800 md:text-4xl">Splitwise</h1>
            <p className="text-slate-500">A cleaner, faster way to manage roommate balances.</p>
          </div>
        </div>
        <button className="rounded-full bg-gradient-to-r from-sky-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-glass transition hover:-translate-y-0.5 hover:from-sky-700 hover:to-blue-600">Invite</button>
      </div>
    </header>
  );
}
