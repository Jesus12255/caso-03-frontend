import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, RefreshCw, Aperture } from 'lucide-react';

export default function CameraCapture({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to data URL for preview
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
        }
    };

    const retake = () => {
        setCapturedImage(null);
    };

    const confirmPhoto = () => {
        if (canvasRef.current) {
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    onCapture(file);
                    onClose();
                }
            }, 'image/jpeg', 0.95);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
            <div className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50">
                    <div className="flex items-center gap-2 text-white">
                        <Camera className="w-5 h-5 text-tivit-red" />
                        <span className="font-medium">Camera Capture</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                    {error ? (
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-400">{error}</p>
                            <button
                                onClick={startCamera}
                                className="mt-4 px-4 py-2 bg-zinc-800 rounded-lg text-white text-sm hover:bg-zinc-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {!capturedImage ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-contain"
                                />
                            )}
                            <canvas ref={canvasRef} className="hidden" />
                        </>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 bg-zinc-900 border-t border-white/5 flex items-center justify-center gap-4">
                    {!capturedImage ? (
                        <button
                            onClick={takePhoto}
                            className="group relative flex items-center justify-center"
                        >
                            <div className="w-16 h-16 rounded-full border-4 border-white/20 group-hover:border-white transition-colors"></div>
                            <div className="absolute w-12 h-12 bg-tivit-red rounded-full group-active:scale-90 transition-transform"></div>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={retake}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Retake
                            </button>
                            <button
                                onClick={confirmPhoto}
                                className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Use Photo
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
