import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Save, RotateCcw, Check, Loader2, ShieldOff, Lock } from 'lucide-react';
import { useExtractEditor } from '../hooks/useExtractEditor';
import ResultCard from './ResultCard';
import EncryptionModal from '../../../components/ui/EncryptionModal';

export default function ResultsBoard({ results, onReset }) {
    const {
        editableResults,
        saveStatus,
        handleValueChange,
        handleDeleteField,
        handleEncryptDocument,
        handleDecryptDocument,
        handleGlobalEncryption,
        handleSave
    } = useExtractEditor(results);

    const [modal, setModal] = useState({
        isOpen: false,
        mode: 'encrypt', // 'encrypt' | 'decrypt'
        type: 'single',  // 'single' | 'global'
        docIndex: null
    });

    if (!editableResults || editableResults.length === 0) return null;

    const isAllAnonymized = editableResults.every(item => item.isEncrypted);

    // Handler for single document toggle
    const handleToggleClick = (docIndex) => {
        const doc = editableResults[docIndex];
        const isEncrypted = doc.isEncrypted;

        setModal({
            isOpen: true,
            mode: isEncrypted ? 'decrypt' : 'encrypt',
            type: 'single',
            docIndex
        });
    };

    // Handler for global toggle
    const handleGlobalToggle = () => {
        setModal({
            isOpen: true,
            mode: isAllAnonymized ? 'decrypt' : 'encrypt',
            type: 'global',
            docIndex: null
        });
    };

    const handleModalConfirm = async (password) => {
        if (modal.type === 'single') {
            if (modal.mode === 'encrypt') {
                await handleEncryptDocument(modal.docIndex, password);
            } else {
                await handleDecryptDocument(modal.docIndex, password);
            }
        } else {
            // Global
            await handleGlobalEncryption(password, modal.mode === 'encrypt');
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl mx-auto"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/5 pb-6 gap-6 md:gap-0">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-tivit-red" />
                            <h2 className="text-3xl font-light text-white tracking-tight">Analysis Report</h2>
                        </div>
                        <p className="text-zinc-500 text-sm">Review, edit, and save extracted data.</p>
                    </div>

                    <div className="flex gap-3 flex-wrap md:flex-nowrap">
                        {/* Global Privacy Toggle */}
                        <button
                            onClick={handleGlobalToggle}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/5 ${isAllAnonymized
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
                                }`}
                            title={isAllAnonymized ? "Make All Public" : "Make All Private"}
                        >
                            {isAllAnonymized ? <Lock className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                            <span className="hidden md:inline">Global Privacy</span>

                            {/* Switch UI */}
                            <div className={`w-8 h-4 rounded-full relative transition-colors ml-1 ${isAllAnonymized ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                                <motion.div
                                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                                    animate={{ left: isAllAnonymized ? 'calc(100% - 14px)' : '2px' }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </div>
                        </button>

                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Analyze New
                        </button>

                        <motion.button
                            layout
                            onClick={() => handleSave(onReset)}
                            disabled={saveStatus !== 'idle'}
                            className={`relative flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg overflow-hidden ${saveStatus === 'success'
                                ? 'bg-emerald-500 text-white shadow-emerald-900/20'
                                : 'bg-tivit-red hover:bg-red-600 text-white shadow-red-900/20'
                                }`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {saveStatus === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Guardar</span>
                                    </motion.div>
                                )}

                                {saveStatus === 'saving' && (
                                    <motion.div
                                        key="saving"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </motion.div>
                                )}

                                {saveStatus === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Guardado</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
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
                            onToggleAnonymization={handleToggleClick}
                        />
                    ))}
                </div>
            </motion.div>

            <EncryptionModal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleModalConfirm}
                mode={modal.mode}
                title={modal.type === 'global' ? `Global Privacy ${modal.mode === 'encrypt' ? 'ON' : 'OFF'}` : undefined}
            />
        </>
    );
}
