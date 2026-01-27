import { useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState(null);
  const [assets, setAssets] = useState([]);

  const loadAssets = async () => {
    setStatus("Loading...");
    setError(null);

    try {
      const response = await fetch("/api/assets");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setAssets(data);
      setStatus("Success");
    } catch (err) {
      console.error(err);
      setStatus("Error");
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hughes API Test</h1>

      <button onClick={loadAssets}>Load Assets</button>

      <p>Status: {status}</p>

      {error && (
        <p style={{ color: "red" }}>
          Failed to load assets: {error}
        </p>
      )}

      {assets.length > 0 && (
        <pre style={{ marginTop: "1rem", textAlign: "left" }}>
          {JSON.stringify(assets, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
