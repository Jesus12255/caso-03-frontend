import { FileText, User, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-tivit-dark/70 backdrop-blur-xl supports-[backdrop-filter]:bg-tivit-dark/50">
            <div className="max-w-7xl mx-auto px-6 h-auto md:h-16 py-3 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
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

                <div className="flex items-center gap-4">
                    <nav className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition-all hover:scale-105 active:scale-95">
                            <FileText size={16} className="text-tivit-red" />
                            Analyze
                        </Link>
                        <Link to="/documents" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-lg transition-all hover:scale-105 active:scale-95">
                            <FileText size={16} className="text-zinc-500 group-hover:text-tivit-red" />
                            Documents
                        </Link>
                    </nav>

                    <div className="w-px h-5 bg-white/10 mx-2"></div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center w-9 h-9 text-tivit-muted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5" title="Configuración">
                            <Settings size={18} />
                        </button>

                        <button className="flex items-center justify-center w-9 h-9 text-tivit-muted hover:text-white transition-colors duration-300 rounded-lg hover:bg-white/5" title="Ayuda">
                            <HelpCircle size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header >
    );
}
