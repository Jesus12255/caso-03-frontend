import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-tivit-dark text-tivit-text selection:bg-tivit-red/20 font-sans overflow-x-hidden">
            <Header />

            {/* Premium Aurora Background */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-tivit-dark">
                {/* Animated gradients */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-tivit-red/5 via-transparent to-transparent animate-[spin_60s_linear_infinite] opacity-30"></div>
                <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent animate-[spin_45s_reverse_linear_infinite] opacity-30"></div>

                {/* Noise overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            </div>

            <main className="relative pt-32 pb-12 px-6 max-w-7xl mx-auto min-h-screen flex flex-col">
                {children}
            </main>
        </div>
    );
}
