import logoIcon from "../assets/images/logo2.png";

export default function Header() {
  return (
    <header className="glass-panel mb-6 sticky top-0 z-10 shadow-soft-md">
      <div className="flex items-center justify-between p-4 md:p-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl shadow-glass ring-1 ring-indigo-400/20">
            <img
              src={logoIcon}
              alt="Splitwise icon"
              className="h-10 w-10 md:h-14 md:w-14 object-contain"
            />
          </div>

          <div>

            <h1 className="text-xl md:text-3xl font-bold gradient-text">
              Splitwise
            </h1>

            <p className="text-xs md:text-sm text-slate-600 font-medium">
              Smart expense tracking
            </p>
          </div>
        </div>

        {/* Invite Button */}
        <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg text-xs">
          Invite Friends
        </button>
      </div>
    </header>
  );
}