

export default function Footer() {
    return (
        <footer className="glass-panel mt-6  bottom-0 z-10 shadow-soft-md" id="footer">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <a
                        href="https://projectsdock.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-blue-400 hover:text-blue-300"
                    >
                        View My Portfolio →
                    </a>

                    <div className="flex gap-6 text-sm">

                        <a href="https://github.com/235mani" target="_blank" rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white">
                            GitHub
                        </a>

                        <a href="https://linkedin.com/in/manideep-talampally" target="_blank" rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white">
                            LinkedIn
                        </a>

                        <a href="mailto:manideeptalampally@gmail.com" className="text-slate-400 hover:text-white">
                            Email
                        </a>

                    </div>

                </div>

            </div>
        </footer>
    );
}