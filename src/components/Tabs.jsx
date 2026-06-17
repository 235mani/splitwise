export default function Tabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'names', label: 'Roommates', icon: '👥' },
    { id: 'split', label: 'Expenses', icon: '💰' },
    { id: 'summary', label: 'Summary', icon: '📊' },
    { id: 'detailed', label: 'Details', icon: '📋' },
  ];

  return (
    <nav className="flex flex-wrap gap-1 rounded-2xl bg-white/50 p-1.5 shadow-soft-xs ring-1 ring-slate-100 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-glass'
              : 'text-slate-600 hover:bg-white hover:text-indigo-600'
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
