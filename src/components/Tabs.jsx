export default function Tabs({ activeTab, onChange }) {
  const tabs = [
    { id: "names", label: "Home" },
    { id: "split", label: "Splits" },
    { id: "summary", label: "Summary" },
    { id: "detailed", label: "Details" },
  ];

  return (
    <nav className="mb-6 sticky top-20 md:top-24 lg:top-24 z-10">
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-white/70 p-1 shadow-soft-xs ring-1 ring-slate-300 backdrop-blur-sm">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                relative
                rounded-xl
                px-2
                py-2.5
                text-xs sm:text-sm
                font-semibold
                transition-all duration-200
                whitespace-nowrap
                ${
                  active
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                    : "text-slate-600 hover:bg-white hover:text-indigo-600"
                }
              `}
            >
              {tab.label}

              {active && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-white/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}