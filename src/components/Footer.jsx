

export default function Footer() {
    return (
        <footer className="mt-8 border-t border-slate-200/70 bg-white/50" id="footer">
            <div className="max-w-6xl mx-auto px-6 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <a
                        href="https://projectsdock.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-violet-700 hover:text-violet-900"
                    >
                        Crafted by Manideep · View portfolio
                    </a>

                    <div className="flex gap-6 text-sm">

                        <a href="https://github.com/235mani" target="_blank" rel="noopener noreferrer"
                            className="text-slate-500 hover:text-ink">
                            GitHub
                        </a>

                        <a href="https://linkedin.com/in/manideep-talampally" target="_blank" rel="noopener noreferrer"
                            className="text-slate-500 hover:text-ink">
                            LinkedIn
                        </a>

                        <a href="mailto:manideeptalampally@gmail.com" className="text-slate-500 hover:text-ink">
                            Email
                        </a>

                    </div>

                </div>

            </div>
        </footer>
    );
}
