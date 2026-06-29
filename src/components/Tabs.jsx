import { NotebookPen, ScrollText, UsersRound, WalletCards } from 'lucide-react';

export default function Tabs({ activeTab, onChange }) {
  const tabs = [
    { id: 'names', label: 'People', icon: UsersRound },
    { id: 'split', label: 'Expenses', icon: NotebookPen },
    { id: "detailed", label: "Summary", icon: ScrollText, isHidden: false },
    { id: 'payment', label: 'Settle', icon: WalletCards },
  ];

  return (
    <nav className="sticky top-[72px] z-20 my-4 sm:top-[82px] sm:my-5" aria-label="Primary navigation">
      <div className="nav-shell grid grid-cols-4 gap-1 p-1.5">
        {tabs.map((tab) => {
          const active = activeTab === tab.id || (tab.id === 'overview' && activeTab === 'detailed');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              hidden={tab.isHidden}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`nav-item ${active ? 'nav-item-active' : ''}`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
