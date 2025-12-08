import { useState } from "react";

export function useAnalysis() {
  const [status, setStatus] = useState("idle");
  const [thinking, setThinking] = useState("");
  const [results, setResults] = useState(null);

  const analyzeFiles = async (files) => {
    try {
      setStatus("analyzing");
      setThinking("");
      setResults(null);

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("http://localhost:8000/analyze/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al conectar con el backend");

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
        // Keep the last line in the buffer if it's incomplete
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const jsonStr = line.trim().slice(6);
            if (jsonStr === "[DONE]") continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.thinking) {
                setThinking((prev) => prev + data.thinking);
              }

              if (data.response) {
                fullResponse += data.response;
              }
            } catch (e) {
              console.error("Error parsing stream JSON", e);
            }
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim().startsWith("data: ")) {
        try {
          const jsonStr = buffer.trim().slice(6);
          if (jsonStr !== "[DONE]") {
            const data = JSON.parse(jsonStr);
            if (data.thinking) setThinking((prev) => prev + data.thinking);
            if (data.response) fullResponse += data.response;
          }
        } catch (e) {
          console.error("Error parsing final stream buffer", e);
        }
      }

      try {
        // Attempt to parse the accumulated response as JSON
        if (fullResponse.trim()) {
          const parsedResults = JSON.parse(fullResponse);

          let finalResults = [];

          // Check for Strict "documents" structure
          if (parsedResults.documents && Array.isArray(parsedResults.documents)) {
            parsedResults.documents.forEach((doc, idx) => {
              let extractedFields = [];

              // Add Summary
              if (doc.summary) {
                extractedFields.push({ label: "Summary", value: doc.summary });
              }

              // Flatten valid fields
              if (doc.fields) {
                Object.entries(doc.fields).forEach(([key, val]) => {
                  let strVal = "";
                  if (Array.isArray(val)) {
                    strVal = val.join(", ");
                  } else if (typeof val === 'object' && val !== null) {
                    strVal = JSON.stringify(val);
                  } else {
                    strVal = String(val);
                  }

                  extractedFields.push({ label: key, value: strVal });
                });
              }

              // Add Validation Info if not valid
              if (doc.validation_status) {
                extractedFields.push({ label: "Validation Status", value: doc.validation_status });
              }
              if (doc.validation_message) {
                extractedFields.push({ label: "Validation Message", value: doc.validation_message });
              }

              finalResults.push({
                fileName: `Document ${doc.document_index || idx + 1}`,
                detectedType: doc.type || "Document",
                confidence: doc.validation_status === 'valid' ? 1.0 : 0.8,
                fields: extractedFields
              });
            });
          }
          // Check for Multi-page structure: [{ filename, data: [{ page, content }] }]
          else if (Array.isArray(parsedResults) && parsedResults.length > 0 && parsedResults[0].data && Array.isArray(parsedResults[0].data)) {
            parsedResults.forEach(file => {
              if (file.data && Array.isArray(file.data)) {
                file.data.forEach(pageData => {
                  finalResults.push({
                    fileName: `${file.filename} (Page ${pageData.page})`,
                    title: file.filename, // Keep original filename accessible
                    pageNumber: pageData.page,
                    detectedType: "Page Analysis",
                    confidence: 1.0,
                    fields: pageData.content // The content becomes the fields for the generic card renderer
                  });
                });
              }
            });
          } else {
            // Standard/Fallback structure
            finalResults = Array.isArray(parsedResults) ? parsedResults : [parsedResults];
          }

          setResults(finalResults);
        } else {
          console.warn("Empty response received");
          setResults([]);
        }
      } catch (e) {
        console.warn("Failed to parse JSON, attempting Markdown parsing", e);

        // Fallback: Parse Markdown text to structured data
        const structuredData = parseMarkdownResponse(fullResponse);
        setResults([structuredData]);
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const resetAnalysis = () => {
    setThinking("");
    setResults(null);
    setStatus("idle");
  };

  return {
    status,
    thinking,
    results,
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
