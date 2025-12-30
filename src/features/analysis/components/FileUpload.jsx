import { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, FileText } from 'lucide-react';
import CameraCapture from './CameraCapture';
import { AnimatePresence } from 'framer-motion';

export default function FileUpload({ onFilesSelected }) {
    const [isDragging, setIsDragging] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [hasCamera, setHasCamera] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Check if camera is available
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            setHasCamera(true);
        }
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesSelected(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesSelected(Array.from(e.target.files));
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleCameraCapture = (file) => {
        onFilesSelected([file]);
        setShowCamera(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in relative">
            <div
                className={`relative group cursor-pointer overflow-hidden rounded-3xl border transition-all duration-500 ease-out
          ${isDragging
                        ? 'border-tivit-red/50 bg-tivit-red/5 scale-[1.01] shadow-[0_0_40px_rgba(237,28,36,0.15)]'
                        : 'border-white/5 bg-tivit-surface/40 hover:border-tivit-red/30 hover:bg-tivit-surface/60 hover:shadow-lg'
                    }
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

                <div className="flex flex-col items-center justify-center py-16 px-8 text-center relative z-10">
                    <div
                        onClick={handleClick}
                        className={`mb-6 p-6 rounded-2xl bg-[#0d0d10] border border-white/5 shadow-inner transition-transform duration-500 ${isDragging ? 'scale-110 shadow-tivit-red/20' : 'group-hover:scale-105'}`}
                    >
                        <svg
                            className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-tivit-red' : 'text-zinc-500 group-hover:text-tivit-red'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-light text-white mb-2" onClick={handleClick}>
                        Upload Documents
                    </h3>
                    <p className="text-tivit-muted text-sm mb-8 font-light tracking-wide cursor-default">
                        <span onClick={handleClick} className="text-tivit-red underline underline-offset-4 decoration-tivit-red/30 group-hover:decoration-tivit-red transition-all cursor-pointer">Browse</span>
                        {' '}files or drag and drop
                    </p>

                    {hasCamera && (
                        <div className="relative w-full max-w-xs mx-auto mb-6">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-transparent text-xs text-zinc-600 uppercase tracking-widest">or</span>
                            </div>
                        </div>
                    )}

                    {hasCamera && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCamera(true);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800/50 border border-white/10 hover:bg-zinc-800 hover:border-white/20 hover:text-white text-zinc-400 transition-all text-sm font-medium group/cam"
                        >
                            <Camera className="w-4 h-4 group-hover/cam:text-tivit-red transition-colors" />
                            Take a Photo
                        </button>
                    )}

                    {/* File Types Indicators */}
                    <div className="flex gap-3 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium opacity-60 mt-8 cursor-default">
                        <span className="border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
                        <span className="border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG</span>
                        <span className="border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-1"><ImageIcon className="w-3 h-3" /> PNG</span>
                    </div>
                </div>

                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleChange}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                />
            </div>

            <AnimatePresence>
                {showCamera && (
                    <CameraCapture
                        onCapture={handleCameraCapture}
                        onClose={() => setShowCamera(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
