import { NextResponse } from "next/server";

function detectType(fear: string) {
  const f = fear.toLowerCase();

  if (f.includes("presentation") || f.includes("class") || f.includes("speech")) {
    return "performance";
  }

  if (f.includes("talk") || f.includes("people") || f.includes("stranger") || f.includes("social")) {
    return "social";
  }

  if (f.includes("phone") || f.includes("call")) {
    return "phone";
  }

  return "general";
}

function buildLadder(fear: string, type: string) {
  const base = fear;

  if (type === "performance") {
    return [
      `Step 1 — Mental Exposure: Visualize yourself doing "${base}" calmly for 2 minutes. Notice anxiety without reacting.`,
      `Step 2 — Script Building: Write a simple outline of what you'd say in "${base}". No performance pressure.`,
      `Step 3 — Private Practice: Deliver "${base}" alone while recording yourself once. No need to rewatch yet.`,
      `Step 4 — Controlled Exposure: Practice "${base}" in front of 1 trusted person. Focus on staying present, not perfect.`,
      `Step 5 — Real Exposure: Perform "${base}" in a real environment. Allow imperfections while staying engaged.`,
    ];
  }

  if (type === "social") {
    return [
      `Step 1 — Passive Exposure: Observe social situations similar to "${base}" without participating.`,
      `Step 2 — Micro Interaction Prep: Prepare 2–3 simple phrases you could use in "${base}".`,
      `Step 3 — Low Stakes Action: Do a tiny version of "${base}" (e.g., greeting, asking something simple).`,
      `Step 4 — Moderate Exposure: Engage in a short conversation related to "${base}" with a safe person.`,
      `Step 5 — Real Exposure: Initiate "${base}" in a natural setting with unfamiliar people.`,
    ];
  }

  if (type === "phone") {
    return [
      `Step 1 — Visualization: Imagine making a call about "${base}" from start to finish.`,
      `Step 2 — Script Practice: Write exactly what you'd say for "${base}". Read it out loud.`,
      `Step 3 — Simulation: Practice calling a friend or voicemail about "${base}".`,
      `Step 4 — Real Low-Stakes Call: Make a simple real call (low importance).`,
      `Step 5 — Target Call: Complete the actual call required for "${base}".`,
    ];
  }

  return [
    `Step 1 — Awareness: Sit with thoughts about "${base}" for 2 minutes without avoiding them.`,
    `Step 2 — Breakdown: List what exactly makes "${base}" stressful and rate each part.`,
    `Step 3 — Micro Exposure: Do a tiny version of "${base}" for 1–2 minutes.`,
    `Step 4 — Guided Exposure: Do a medium-level version of "${base}" with preparation first.`,
    `Step 5 — Full Exposure: Engage in "${base}" fully without avoidance behaviors.`,
  ];
}

export async function POST(req: Request) {
  try {
    const { fear } = await req.json();

    if (!fear) {
      return NextResponse.json({
        result: "Please describe a situation you feel anxious about.",
      });
    }

    const type = detectType(fear);
    const ladder = buildLadder(fear, type);

    return NextResponse.json({
      result: ladder.join("\n\n"),
      type,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}