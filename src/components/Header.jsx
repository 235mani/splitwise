import logoIcon from "../assets/images/logo2.png";

export default function Header() {
  return (
    <header className="app-header sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 xl:px-0">
        <div className="flex items-center gap-3">
          <img
              src={logoIcon}
              alt="Splitwise icon"
              className="h-10 w-10 md:h-14 md:w-14 object-contain"
            />
          <div>
            <h1 className="text-lg font-semibold tracking-[-0.03em] text-ink sm:text-xl">
              Splitwise
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600 sm:text-xs">
              Shared expenses
            </p>
          </div>
        </div>
        <a href="#footer" className="items-center gap-2 rounded-full border border-violet-100 bg-violet-50/70 px-3 py-1.5 text-xs font-semibold text-violet-700 sm:flex">
          About me
        </a>
      </div>
    </header>
  );
}
