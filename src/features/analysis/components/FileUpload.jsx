import { useState, useRef } from 'react';

export default function FileUpload({ onFilesSelected }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 animate-fade-in">
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
                onClick={handleClick}
            >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>

                <div className="flex flex-col items-center justify-center py-20 px-8 text-center relative z-10">
                    <div className={`mb-8 p-6 rounded-2xl bg-[#0d0d10] border border-white/5 shadow-inner transition-transform duration-500 ${isDragging ? 'scale-110 shadow-tivit-red/20' : 'group-hover:scale-105'}`}>
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

                    <h3 className="text-2xl font-light text-white mb-3">
                        Upload Documents
                    </h3>
                    <p className="text-tivit-muted text-sm mb-8 font-light tracking-wide">
                        Drag & drop files or <span className="text-tivit-red underline underline-offset-4 decoration-tivit-red/30 group-hover:decoration-tivit-red transition-all">browse</span> from your computer
                    </p>

                    <div className="flex gap-3 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium opacity-60">
                        <span className="border border-white/5 px-3 py-1.5 rounded-full">PDF</span>
                        <span className="border border-white/5 px-3 py-1.5 rounded-full">JPG</span>
                        <span className="border border-white/5 px-3 py-1.5 rounded-full">PNG</span>
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
        </div>
    );
}
