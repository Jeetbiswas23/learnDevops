import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [message, setMessage] = useState("Connecting to backend...");

  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend is not reachable yet."));
  }, []);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", maxWidth: 800, margin: "80px auto", padding: 24 }}>
      <h1>MERN DevOps Learning Projects man 🚀
      <p>This React frontend will eventually be containerized, tested, deployed and monitored.</p>
      <div style={{ padding: 20, border: "1px solid #ddd", borderRadius: 12, marginTop: 24 }}>
        <strong>Backend response:</strong>
        <p>{message}</p>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
