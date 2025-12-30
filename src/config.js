// Detects API URL based on environment
// In Vercel, use VITE_API_URL env var.
// In local dev, defaults to localhost:8000 or current hostname if accessed via network.

const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // Fallback for local development
    return `http://${window.location.hostname}:8000`;
};

export const API_URL = getApiUrl();
