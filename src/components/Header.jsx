import logoIcon from "../assets/images/logo2.png";

export default function Header() {
  return (
    <header className="glass-panel top-0 z-50 rounded-2xl shadow-soft-md mx-4 mt-4 mb-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between p-6 md:p-8">
        
        {/* Logo & Title Section */}
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left sm:items-center">
          <div className="rounded-2xl shadow-glass ring-1 ring-indigo-400/20">
            <img src={logoIcon} alt="Splitwise icon" className="h-14 w-14 object-contain" />
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest font-medium text-indigo-600">Expense Management</p>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Splitwise</h1>
            <p className="text-sm text-slate-600 font-medium">Smart roommate expense tracking for 2026</p>
          </div>
        </div>

        {/* share Button */}
        <button className="btn-premium px-6 py-3 text-base whitespace-nowrap">
          Invite Roommates
        </button>
      </div>
    </header>
  );
}

