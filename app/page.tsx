"use client";

import { useState } from "react";

type Step = {
  text: string;
  done: boolean;
};

export default function Home() {
  const [fear, setFear] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  const generateLadder = async () => {
    if (!fear) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate-ladder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fear }),
      });

      const data = await res.json();
      const text = data?.result;

      if (!text || typeof text !== "string") {
        console.error("Bad API response:", data);
        setSteps([
          { text: "Something went wrong generating your ladder.", done: false },
        ]);
        setLoading(false);
        return;
      }

      const stepsArray: Step[] = text
        .split("\n")
        .filter((line: string) => line.trim() !== "")
        .map((line: string) => ({
          text: line.replace(/^\d+\.\s*/, ""),
          done: false,
        }));

      setSteps(stepsArray);
    } catch (err) {
      console.error(err);
      setSteps([
        { text: "Error connecting to AI. Try again.", done: false },
      ]);
    }

    setLoading(false);
  };

  const toggleStep = (index: number) => {
    const updated = [...steps];
    updated[index].done = !updated[index].done;
    setSteps(updated);
  };

  return (
    <main className="min-h-screen bg-[#f5f2ee] text-[#3b2c28] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <h1 className="text-5xl font-serif mb-3">sociiial</h1>

        <p className="text-lg text-[#5b4338] mb-2">
          Build social confidence one small step at a time.
        </p>

        <p className="text-sm text-[#7a665d] mb-6 max-w-xl">
          Social anxiety often comes from fear of judgment, awkward moments, or saying the wrong thing.
          This tool helps you break those fears into small, manageable steps.
        </p>

        <p className="text-xs text-[#9a877f] mb-8">
          Created by Ayleen, Jamie & Genesis
        </p>

        {/* Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md">

          <input
            className="w-full p-3 border rounded-xl mb-4"
            placeholder="What social situation makes you anxious?"
            value={fear}
            onChange={(e) => setFear(e.target.value)}
          />

          <button
            onClick={generateLadder}
            className="bg-[#5b4338] text-white px-5 py-3 rounded-xl"
          >
            {loading ? "Generating..." : "Generate Ladder"}
          </button>

          {/* Steps */}
          <div className="mt-6 space-y-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#efe8e2] p-3 rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={step.done}
                  onChange={() => toggleStep(i)}
                />
                <span className={step.done ? "line-through opacity-50" : ""}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}