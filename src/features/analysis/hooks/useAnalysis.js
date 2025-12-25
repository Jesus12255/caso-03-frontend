import { useState } from "react";
import { API_URL } from "../../../config";

export function useAnalysis() {
  const [status, setStatus] = useState("idle");
  const [thinking, setThinking] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const analyzeFiles = async (files) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      setStatus("analyzing");
      setThinking("");
      setResults(null);
      setError(null);

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      // Use window.location.hostname to connect to backend on the same device
      const apiUrl = `${API_URL}/analyze/upload`;

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const jsonStr = line.trim().slice(6);
            if (jsonStr === "[DONE]") continue;

            try {
              const data = JSON.parse(jsonStr);
              if (data.error) {
                throw new Error(data.error);
              }
              if (data.thinking) setThinking((prev) => prev + data.thinking);
              if (data.response) fullResponse += data.response;
            } catch (e) {
              if (e.message && !e.message.includes("JSON")) {
                // Propagate actual errors thrown above
                throw e;
              }
              console.error("Error parsing stream JSON", e);
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer.trim().startsWith("data: ")) {
        try {
          const jsonStr = buffer.trim().slice(6);
          if (jsonStr !== "[DONE]") {
            const data = JSON.parse(jsonStr);
            if (data.error) throw new Error(data.error);
            if (data.thinking) setThinking((prev) => prev + data.thinking);
            if (data.response) fullResponse += data.response;
          }
        } catch (e) {
          if (e.message && !e.message.includes("JSON")) throw e;
        }
      }

      try {
        if (fullResponse.trim()) {
          const parsedResults = JSON.parse(fullResponse);
          let finalResults = [];

          if (parsedResults.documents && Array.isArray(parsedResults.documents)) {
            parsedResults.documents.forEach((doc, idx) => {
              let extractedFields = [];
              if (doc.summary) extractedFields.push({ label: "Summary", value: doc.summary });
              if (doc.fields) {
                Object.entries(doc.fields).forEach(([key, val]) => {
                  extractedFields.push({ label: key, value: val });
                });
              }
              finalResults.push({
                fileName: doc.document_name || `Document ${doc.document_index || idx + 1}`,
                detectedType: doc.type || "Document",
                confidence: doc.validation_status === 'valid' ? 1.0 : 0.8,
                fields: extractedFields
              });
            });
          } else {
            // Fallback
            finalResults = Array.isArray(parsedResults) ? parsedResults : [parsedResults];
          }
          setResults(finalResults);
        } else {
          throw new Error("Received empty response from analysis");
        }
      } catch (e) {
        console.warn("JSON Parse Failed, using Raw Text", e);
        const structuredData = parseMarkdownResponse(fullResponse);
        setResults([structuredData]);
      }

      setStatus("success");
    } catch (err) {
      console.error("Analysis Error:", err);
      if (err.name === 'AbortError') {
        setError("Request timed out. Please check your internet connection and try again.");
      } else {
        setError(err.message || "An unexpected error occurred during analysis.");
      }
      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const resetAnalysis = () => {
    setThinking("");
    setResults(null);
    setError(null);
    setStatus("idle");
  };

  return {
    status,
    thinking,
    results,
    error,
    analyzeFiles,
    resetAnalysis,
  };
}

// Helper function to parse LLM Markdown response into structured data
function parseMarkdownResponse(text) {
  const fields = [];
  let currentSection = "";

  // Attempt to extract a title/filename
  const titleMatch = text.match(/\*\*(.*?)\*\*/) || text.match(/^(.+?)(\n|$)/);
  const fileName = titleMatch ? titleMatch[1].replace(/[:.]\s*$/, "") : "Analysis Result";

  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for Section Headers (###)
    if (trimmed.startsWith('#')) {
      currentSection = trimmed.replace(/^#+\s*/, '').replace(/\*+/g, '').trim();
      continue;
    }

    // Check for Bullet points with Keys (- **Key**: Value)
    const keyValMatch = trimmed.match(/^-\s*\*\*(.*?)\*\*[:?]?\s*(.*)/);
    if (keyValMatch) {
      const key = keyValMatch[1].trim();
      let value = keyValMatch[2].trim();
      fields.push({
        label: key,
        value: value || "See details",
        section: currentSection
      });
    }
    // Handle lines that look like keys but maybe formatted differently
    else if (trimmed.startsWith('-') && trimmed.includes(':')) {
      const parts = trimmed.substring(1).split(':');
      const key = parts[0].trim().replace(/\*\*/g, '');
      const value = parts.slice(1).join(':').trim();

      if (key && value) {
        fields.push({
          label: key,
          value: value,
          section: currentSection
        });
      }
    }
  }

  if (fields.length === 0) {
    return {
      fileName: "Analysis Result",
      detectedType: "Text",
      confidence: 1.0,
      fields: [{ label: "Summary", value: text }]
    };
  }

  return {
    fileName: fileName,
    detectedType: "Document",
    confidence: 0.95,
    fields: fields
  };
}
