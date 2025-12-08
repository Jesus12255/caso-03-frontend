import { motion } from 'framer-motion';
import { Sparkles, Save, RotateCcw } from 'lucide-react';
import { useExtractEditor } from '../hooks/useExtractEditor';
import ResultCard from './ResultCard';

export default function ResultsBoard({ results, onReset }) {
    const {
        editableResults,
        handleValueChange,
        handleDeleteField,
        handleSave
    } = useExtractEditor(results);

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
                {editableResults.map((item, docIndex) => (
                    <ResultCard
                        key={docIndex}
                        item={item}
                        docIndex={docIndex}
                        onValueChange={handleValueChange}
                        onDeleteField={handleDeleteField}
                    />
                ))}
            </div>
        </motion.div>
    );
}
