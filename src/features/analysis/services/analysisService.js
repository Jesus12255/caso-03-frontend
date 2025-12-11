export const analysisService = {
    /**
     * Saves the edited analysis results to the backend.
     * @param {Array} data - The array of document analysis results.
     * @returns {Promise<any>} - The JSON response from the server.
     */
    async saveAnalysisResults(data) {

        try {
            const response = await fetch("http://localhost:8000/document/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error saving data: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to save analysis results:", error);
            throw error;
        }
    },
};
