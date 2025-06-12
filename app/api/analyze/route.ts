// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { createAgent, gemini } from "@inngest/agent-kit";

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supportAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY!,
    }),
    name: "AI Transaction Analyser",
    system: `You are a financial assistant. Given a natural language transaction, extract the following:
    - amount (INR)
    - category (choose from: food, groceries, shopping, utilities, EMI, rent, subscriptions, travel, health, entertainment, misc)
    - vendor (like Netflix, Amazon, Uber, Zomato, Swiggy, Airtel, Jio or misc)
    - method (like UPI, card, cash)
    - description

    Respond with JSON only.`,
  });

  try {
    const response = await supportAgent.run(input);

    if (response.output[0].type === "text") {
      const raw = response.output[0].content.toString().trim();

        // Strip markdown code block if present
        const clean = raw.replace(/^```json\s*|```$/g, "").trim();

        const parsed = JSON.parse(clean);

      return NextResponse.json({
        ...parsed,
        originalInput: input,
        status: 200
      });
    } else {
      return NextResponse.json({ error: "Unexpected response format from LLM" }, { status: 500 });
    }
  } catch (error) {
    console.error("LLM error:", error);
    return NextResponse.json({ error: "Failed to analyze transaction" }, { status: 500 });
  }
}
