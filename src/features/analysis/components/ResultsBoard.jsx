import { motion } from 'framer-motion';
import { FileCheck, Sparkles, AlertCircle } from 'lucide-react';
import SpotlightCard from '../../../components/ui/SpotlightCard';

export default function ResultsBoard({ results, onReset }) {
    if (!results) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="flex items-end justify-between mb-10 border-b border-white/5 pb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-tivit-red" />
                        <h2 className="text-3xl font-light text-white tracking-tight">Analysis Report</h2>
                    </div>
                    <p className="text-zinc-500 text-sm">Processed {results.length} document{results.length !== 1 ? 's' : ''} successfully</p>
                </div>

                <button
                    onClick={onReset}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 border border-white/5 hover:border-white/20 backdrop-blur-sm"
                >
                    Analyze New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.map((item, index) => {
                    const displayName = item.fileName || `Document Analysis ${index + 1}`;
                    const displayType = item.detectedType || 'DATA';
                    const displayConfidence = item.confidence != null ? item.confidence : 1.0;

                    let renderFields = [];
                    if (Array.isArray(item.fields)) {
                        renderFields = item.fields;
                    } else {
                        // Dynamically generate fields from object keys
                        renderFields = Object.entries(item)
                            .filter(([key]) => !['fileName', 'detectedType', 'confidence', 'id'].includes(key))
                            .map(([key, value]) => ({
                                label: key.replace(/_/g, ' '),
                                value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                            }));
                    }

                    return (
                        <SpotlightCard
                            key={index}
                            className="group hover:scale-[1.01] transition-transform duration-500 bg-zinc-950/40"
                            spotlightColor="rgba(237, 28, 36, 0.1)"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <div className="relative p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-tivit-red group-hover:border-tivit-red/30 transition-all duration-500 shadow-lg">
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium text-sm truncate max-w-[180px] tracking-wide" title={displayName}>{displayName}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">{displayType}</span>
                                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                <span className="text-[10px] text-emerald-500/80 font-mono font-medium tracking-tight">AI CONFIDENCE {(displayConfidence * 100).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {renderFields.length > 0 ? (
                                        renderFields.map((field, fIndex) => (
                                            <div key={fIndex} className="flex flex-col gap-1 group/field">
                                                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold group-hover/field:text-tivit-red/70 transition-colors delay-75">{field.label}</span>
                                                <span className="text-zinc-200 text-sm font-light border-b border-white/5 pb-2 group-hover/field:border-white/10 transition-colors break-words">
                                                    {field.value}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-zinc-500 text-sm italic">No extracted fields found.</div>
                                    )}
                                </div>
                            </motion.div>
                        </SpotlightCard>
                    );
                })}
            </div>
        </motion.div>
    );
}
