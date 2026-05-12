"use client";

import { useState } from "react";

export default function Home() {
  const [fear, setFear] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  async function generateLadder() {
    setLoading(true);
    setSteps([]);

    try {
      const res = await fetch("/api/generate-ladder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fear }),
      });

      const data = await res.json();
      const text = data?.result;

      if (!text || typeof text !== "string") {
        setSteps(["Something went wrong generating your ladder."]);
        setLoading(false);
        return;
      }

      const parsed = text
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean);

      setSteps(parsed);
    } catch (err) {
      setSteps(["Error generating ladder."]);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        transition: "0.3s ease",
        background: darkMode ? "#0f0f0f" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111111",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "800" }}>
            Social Anxiety Ladder Builder
          </h1>

          <p style={{ opacity: 0.7 }}>
            Turn overwhelming situations into structured steps.
          </p>

          {/* DARK MODE TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              marginTop: "12px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: darkMode ? "#fff" : "#111",
              color: darkMode ? "#111" : "#fff",
              fontSize: "12px",
            }}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* INPUT */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={fear}
            onChange={(e) => setFear(e.target.value)}
            placeholder="e.g. public speaking, talking to strangers..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: darkMode ? "1px solid #333" : "1px solid #ccc",
              background: darkMode ? "#1a1a1a" : "#fff",
              color: darkMode ? "#fff" : "#000",
            }}
          />

          <button
            onClick={generateLadder}
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: darkMode ? "#fff" : "#111",
              color: darkMode ? "#111" : "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* STEPS */}
        <div style={{ marginTop: "25px" }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                padding: "14px",
                marginBottom: "10px",
                borderRadius: "12px",
                background: darkMode ? "#1a1a1a" : "#f5f5f5",
                border: darkMode ? "1px solid #333" : "1px solid #e5e5e5",

                // ✨ ANIMATION
                animation: `fadeIn 0.4s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
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
        <div style={{ marginTop: "45px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", opacity: 0.6 }}>
            Social Anxiety Ladder Builder
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: "800" }}>
            Created by Ayleen, Genesis, & Jamie
          </h2>

          <p style={{ fontSize: "12px", opacity: 0.5 }}>
            A structured exposure tool for overcoming social anxiety.
          </p>
        </div>
      </div>

      {/* ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}