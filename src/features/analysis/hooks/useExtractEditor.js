import { useState, useEffect, useCallback } from 'react';

export function useExtractEditor(initialResults) {
    const [editableResults, setEditableResults] = useState([]);

    useEffect(() => {
        if (initialResults) {
            // Deep copy to avoid mutating props and ensure local state is fresh
            // Normalize fields to always be an array for easier rendering/editing
            const initializedResults = initialResults.map(item => {
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
    }, [initialResults]);

    const handleValueChange = useCallback((docIndex, fieldIndex, newValue) => {
        setEditableResults(prev => {
            const next = [...prev];
            const newFields = [...next[docIndex].fields];
            newFields[fieldIndex] = { ...newFields[fieldIndex], value: newValue };
            next[docIndex] = { ...next[docIndex], fields: newFields };
            return next;
        });
    }, []);

    const handleDeleteField = useCallback((docIndex, fieldIndex) => {
        setEditableResults(prev => {
            const next = [...prev];
            const newFields = next[docIndex].fields.filter((_, i) => i !== fieldIndex);
            next[docIndex] = { ...next[docIndex], fields: newFields };
            return next;
        });
    }, []);

    const handleSave = useCallback(() => {
        console.log("Saving edited results:", editableResults);
        // Mock API call
        alert("¡Datos guardados correctamente!");
    }, [editableResults]);

    return {
        editableResults,
        handleValueChange,
        handleDeleteField,
        handleSave
    };
}
