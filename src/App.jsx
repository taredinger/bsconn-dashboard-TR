import { useState } from "react";

const API_BASE = "https://bsconn-api-tr.azurewebsites.net";

function App() {
  const [rawResponse, setRawResponse] = useState(null);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState("");

  const loadAssets = async () => {
    setError("");
    setRawResponse(null);
    setStatus("Fetching assets...");

    try {
      // Single call — backend handles auth + token
      const assetsRes = await fetch(`${API_BASE}/api/assets`);

      if (!assetsRes.ok) {
        throw new Error("Asset fetch failed");
      }

      const json = await assetsRes.json();
      setRawResponse(json);
      setStatus("Assets loaded ✅");
    } catch (err) {
      console.error(err);
      setError("Failed to load assets");
      setStatus("Error ❌");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: "#1e1e1e",
        minHeight: "100vh",
        color: "#ffffff",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <h1>HughesOn API Test</h1>

      <button
        onClick={loadAssets}
        style={{
          padding: "10px 16px",
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #888",
          background: "#2d2d2d",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Load Assets
      </button>

      <p style={{ marginTop: 12 }}>
        <strong>Status:</strong> {status}
      </p>

      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

      {rawResponse && (
        <>
          <h2>Raw API Response</h2>
          <pre
            style={{
              maxHeight: 500,
              overflow: "auto",
              textAlign: "left",
              border: "1px solid #444",
              padding: 16,
              background: "#111",
              color: "#d4d4d4",
              fontSize: 13,
              fontFamily: "Consolas, Monaco, monospace",
              lineHeight: 1.4,
              borderRadius: 6,
            }}
          >
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

export default App;
