import { NextResponse } from "next/server";
import { createAgent, gemini } from "@inngest/agent-kit";

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const goalAgent = createAgent({
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY!,
    }),
    name: "AI Goal Analyzer",
    system: `You are a personal finance assistant. Your task is to extract goal details from a natural language sentence.

Given a sentence like "Save ₹50,000 for a new laptop by December 2025", extract and return:
- name: the name or reason of the goal (e.g., "new laptop")
- targetAmount: numeric target amount in INR (e.g., 50000)
- currentAmount: default this to 0
- deadline: date in YYYY-MM-DD format

Respond with a valid JSON object in this format:
{
  "name": string,
  "targetAmount": number,
  "currentAmount": number,
  "deadline": string (YYYY-MM-DD)
}

Only respond with valid JSON. Do not include any other commentary.`,
  });

  try {
    const response = await goalAgent.run(input);

    if (response.output[0].type === "text") {
      const raw = response.output[0].content.toString().trim();

      // Remove any markdown JSON formatting
      const clean = raw.replace(/^```json\s*|```$/g, "").trim();

      const parsed = JSON.parse(clean);

      return NextResponse.json({
        ...parsed,
        originalInput: input,
        status: 200,
      });
    } else {
      return NextResponse.json({ error: "Unexpected response format from LLM" }, { status: 500 });
    }
  } catch (error) {
    console.error("LLM error:", error);
    return NextResponse.json({ error: "Failed to analyze goal" }, { status: 500 });
  }
}
