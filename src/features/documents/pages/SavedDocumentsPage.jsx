import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Eye, Download, Calendar, Search, Loader2, Lock, Unlock } from 'lucide-react';
import ResultCard from '../../analysis/components/ResultCard';
import { API_URL } from '../../../config';

export default function SavedDocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState(null); // For viewing details

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await fetch(`${API_URL}/document/list`);
            if (!response.ok) throw new Error('Failed to fetch documents');
            const data = await response.json();
            setDocuments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const response = await fetch(`${API_URL}/document/delete/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete');

            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (err) {
            alert('Error deleting document: ' + err.message);
        }
    };

    const handleToggleAnonymization = async (doc) => {
        try {
            const newStatus = !doc.isEncrypted;
            // Optimistic update
            setDocuments(docs => docs.map(d =>
                d.id === doc.id ? { ...d, isEncrypted: newStatus } : d
            ));
        } catch (e) {
            console.error("Failed to toggle encryption", e);
        }
    };



    const handleExport = (doc, type) => {
        if (!doc) return;
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

        if (type === 'json') {
            const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
            downloadBlob(blob, `${doc.fileName}_${timestamp}.json`);
        }
    };

    const downloadBlob = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const filteredDocs = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-3xl font-light text-white tracking-tight">Saved Documents</h2>
                    <p className="text-zinc-500 text-sm">Manage your analyzed documents.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-tivit-red/50 transition-colors w-full md:w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-tivit-red" /></div>
            ) : error ? (
                <div className="text-red-400 text-center py-10">Error: {error}</div>
            ) : filteredDocs.length === 0 ? (
                <div className="text-zinc-500 text-center py-20 border border-dashed border-white/10 rounded-2xl">
                    No documents found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredDocs.map(doc => (
                        <motion.div
                            layout
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-800/30 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors group"
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-zinc-900 rounded-lg border border-white/5 text-tivit-red">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium truncate max-w-xs">{doc.fileName}</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {doc.created}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-400">
                                            {doc.detectedType || 'Document'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className="p-2 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <div className="h-4 w-px bg-white/10 mx-1"></div>
                                <button
                                    onClick={() => handleExport(doc, 'json')}
                                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs font-medium"
                                >
                                    JSON
                                </button>
                                <div className="h-4 w-px bg-white/10 mx-1"></div>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="h-4 w-px bg-white/10 mx-1"></div>
                                <button
                                    onClick={() => handleToggleAnonymization(doc)}
                                    className={`p-2 rounded-lg transition-colors ${doc.isEncrypted
                                        ? 'text-tivit-red hover:bg-tivit-red/10'
                                        : 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                                        }`}
                                    title={doc.isEncrypted ? "Desencriptar" : "Encriptar"}
                                >
                                    {doc.isEncrypted ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Document Detail Modal */}
            <AnimatePresence>
                {selectedDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDoc(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-tivit-dark border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50">
                                <h3 className="text-xl text-white font-light">{selectedDoc.fileName}</h3>
                                <button onClick={() => setSelectedDoc(null)} className="text-zinc-500 hover:text-white">✕</button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-4 bg-zinc-950/50">
                                <ResultCard
                                    item={selectedDoc}
                                    docIndex={0}
                                    // Pass no-ops or read-only mode if component supports it, 
                                    // but ResultCard seems to handle undefined handlers gracefully for display
                                    onValueChange={() => { }}
                                    onDeleteField={() => { }}
                                    onToggleAnonymization={() => handleToggleAnonymization(selectedDoc)}
                                    isReadOnly={true}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
