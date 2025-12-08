import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Sparkles, Trash2, Save, RotateCcw } from 'lucide-react';
import SpotlightCard from '../../../components/ui/SpotlightCard';

export default function ResultsBoard({ results, onReset }) {
    const [editableResults, setEditableResults] = useState([]);

    useEffect(() => {
        if (results) {
            // Deep copy to avoid mutating props and ensure local state is fresh
            // Normalize fields to always be an array for easier rendering/editing
            const initializedResults = results.map(item => {
                let fields = [];
                if (Array.isArray(item.fields)) {
                    fields = [...item.fields];
                } else if (item && typeof item === 'object') {
                    // Fallback for object-based results
                    fields = Object.entries(item)
                        .filter(([key]) => !['fileName', 'detectedType', 'confidence', 'id', 'fields'].includes(key))
                        .map(([key, value]) => ({
                            label: key.replace(/_/g, ' '),
                            value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                        }));
                }
                return { ...item, fields };
            });
            setEditableResults(initializedResults);
        }
    }, [results]);

    const handleValueChange = (docIndex, fieldIndex, newValue) => {
        setEditableResults(prev => {
            const next = [...prev];
            // Create a shallow copy of the fields array we are modifying
            const newFields = [...next[docIndex].fields];
            // Update the specific field
            newFields[fieldIndex] = { ...newFields[fieldIndex], value: newValue };
            // Update the document
            next[docIndex] = { ...next[docIndex], fields: newFields };
            return next;
        });
    };

    const handleDeleteField = (docIndex, fieldIndex) => {
        setEditableResults(prev => {
            const next = [...prev];
            const newFields = next[docIndex].fields.filter((_, i) => i !== fieldIndex);
            next[docIndex] = { ...next[docIndex], fields: newFields };
            return next;
        });
    };

    const handleSave = () => {
        console.log("Saving edited results:", editableResults);
        // Here you would typically call an API endpoint
        alert("¡Datos guardados correctamente!");
    };

    if (!editableResults || editableResults.length === 0) return null;

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
                    <p className="text-zinc-500 text-sm">Review, edit, and save extracted data.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Analyze New
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-tivit-red hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-900/20"
                    >
                        <Save className="w-4 h-4" />
                        Guardar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {editableResults.map((item, docIndex) => {
                    const displayName = item.fileName || `Document Analysis ${docIndex + 1}`;
                    const displayType = item.detectedType || 'DATA';
                    const displayConfidence = item.confidence != null ? item.confidence : 1.0;

                    return (
                        <SpotlightCard
                            key={docIndex}
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
                                                            onClick={() => handleDeleteField(docIndex, fieldIndex)}
                                                            className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all text-zinc-600 hover:text-red-500"
                                                            title="Delete field"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <textarea
                                                        value={field.value}
                                                        onChange={(e) => handleValueChange(docIndex, fieldIndex, e.target.value)}
                                                        className="w-full bg-transparent text-zinc-200 text-sm font-light border-b border-white/5 py-1 focus:outline-none focus:border-tivit-red/50 focus:bg-white/[0.02] transition-colors resize-none field-sizing-content min-h-[28px]"
                                                        rows={1}
                                                        style={{ fieldSizing: "content" }} // Modern CSS for auto-growing textarea
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
                })}
            </div>
        </motion.div>
    );
}
