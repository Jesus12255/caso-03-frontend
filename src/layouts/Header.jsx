export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-tivit-dark/70 backdrop-blur-xl supports-[backdrop-filter]:bg-tivit-dark/50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <div className="absolute inset-0 bg-tivit-red blur-lg opacity-20 rounded-full"></div>
                        <div className="relative w-1.5 h-6 bg-tivit-red rounded-full shadow-[0_0_15px_rgba(237,28,36,0.5)]"></div>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                            TIVIT
                        </h1>
                        <span className="text-[10px] uppercase tracking-widest text-tivit-muted font-medium">
                            Intelligent Analysis
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
