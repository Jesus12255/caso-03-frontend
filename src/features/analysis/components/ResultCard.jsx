import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Trash2 } from 'lucide-react';
import SpotlightCard from '../../../components/ui/SpotlightCard';

const ResultCard = memo(function ResultCard({ item, docIndex, onValueChange, onDeleteField }) {
    const displayName = item.fileName || `Document Analysis ${docIndex + 1}`;
    const displayType = item.detectedType || 'DATA';
    const displayConfidence = item.confidence != null ? item.confidence : 1.0;

    return (
        <SpotlightCard
            className="group hover:border-tivit-red/30 transition-colors duration-500 bg-zinc-950/40"
            spotlightColor="rgba(237, 28, 36, 0.05)"
        >
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: docIndex * 0.1 + 0.2 }}
            >
                <div className="relative p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-tivit-red transition-colors duration-500 shadow-lg">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-white font-medium text-sm truncate max-w-[180px] tracking-wide" title={displayName}>{displayName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">{displayType}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                <span className="text-[10px] text-emerald-500/80 font-mono font-medium tracking-tight">AI CONFIDENCE {(displayConfidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                    {/* Status Indicator */}
                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                </div>

                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {item.fields && item.fields.length > 0 ? (
                            item.fields.map((field, fieldIndex) => (
                                <motion.div
                                    key={`${docIndex}-${fieldIndex}`}
                                    layout
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    className="flex flex-col gap-1 group/field relative group-hover/field:z-10"
                                >
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold group-hover/field:text-tivit-red/70 transition-colors">
                                            {field.label}
                                        </label>
                                        <button
                                            onClick={() => onDeleteField(docIndex, fieldIndex)}
                                            className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all text-zinc-600 hover:text-red-500"
                                            title="Delete field"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <textarea
                                        value={field.value}
                                        onChange={(e) => onValueChange(docIndex, fieldIndex, e.target.value)}
                                        className="w-full bg-transparent text-zinc-200 text-sm font-light border-b border-white/5 py-1 focus:outline-none focus:border-tivit-red/50 focus:bg-white/[0.02] transition-colors resize-none field-sizing-content min-h-[28px]"
                                        rows={1}
                                        style={{ fieldSizing: "content" }}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-zinc-500 text-sm italic py-4 text-center">No extracted fields available.</div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </SpotlightCard>
    );
});

export default ResultCard;
