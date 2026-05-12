"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [fear, setFear] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // 💾 load saved ladder on refresh
  useEffect(() => {
    const saved = localStorage.getItem("ladder");
    if (saved) setSteps(JSON.parse(saved));

    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  // 💾 save ladder whenever it changes
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem("ladder", JSON.stringify(steps));
    }
  }, [steps]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function generateLadder() {
    setLoading(true);
    setSteps([]);

    try {
      const res = await fetch("/api/generate-ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fear }),
      });

      const data = await res.json();
      const text = data?.result;

      if (!text) {
        setSteps(["Something went wrong generating your ladder."]);
        setLoading(false);
        return;
      }

      const parsed = text
        .split("\n")
        .map((l: string) => l.trim())
        .filter(Boolean);

      setSteps(parsed);
    } catch {
      setSteps(["Error generating ladder."]);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f0f0f" : "#f7f7f7",
        color: darkMode ? "#fff" : "#111",
        fontFamily: "system-ui",
        padding: "20px",
        transition: "0.3s",
      }}
    >
      {/* APP CONTAINER */}
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800" }}>
            Anxiety Ladder Builder
          </h1>

          <p style={{ fontSize: "13px", opacity: 0.7 }}>
            Break fear into manageable steps
          </p>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              marginTop: "10px",
              padding: "6px 10px",
              fontSize: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: darkMode ? "#fff" : "#111",
              color: darkMode ? "#111" : "#fff",
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* INPUT CARD */}
        <div
          style={{
            background: darkMode ? "#1a1a1a" : "#fff",
            padding: "15px",
            borderRadius: "14px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <input
            value={fear}
            onChange={(e) => setFear(e.target.value)}
            placeholder="e.g. public speaking, talking to strangers"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: darkMode ? "1px solid #333" : "1px solid #ddd",
              background: darkMode ? "#111" : "#fff",
              color: darkMode ? "#fff" : "#000",
              marginBottom: "10px",
            }}
          />

          <button
            onClick={generateLadder}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate Ladder"}
          </button>
        </div>

        {/* STEPS */}
        <div style={{ marginTop: "20px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                background: darkMode ? "#1a1a1a" : "#fff",
                padding: "14px",
                borderRadius: "12px",
                marginBottom: "10px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <div style={{ fontSize: "12px", opacity: 0.6 }}>
                Step {i + 1} of {steps.length}
              </div>

              <div style={{ marginTop: "6px", fontSize: "14px" }}>
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            Created by Ayleen, Genesis, & Jamie
          </p>
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}