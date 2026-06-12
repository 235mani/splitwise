export default function Tabs({ activeTab, onChange }) {
  const tabs = ['names', 'split', 'summary', 'detailed'];

  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`rounded-t-xl px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-white text-sky-700 shadow-soft-lg ring-1 ring-sky-100' : 'text-slate-600 hover:bg-slate-50 hover:text-sky-700'}`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </nav>
  );
}
