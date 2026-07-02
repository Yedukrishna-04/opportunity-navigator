import OpenAI from "openai";
import { scoreResource } from "@/lib/data";
import type { AidResource, StudentCase } from "@/lib/types";

export async function generateRecommendation(studentCase: StudentCase, resources: AidResource[]) {
  const ranked = resources
    .map((resource) => ({ resource, score: scoreResource(studentCase, resource) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const fallback = {
    summary: `${studentCase.studentName} has ${studentCase.urgency} urgency with ${studentCase.barriers.length || 0} documented barrier(s). Best current match: ${ranked[0]?.resource.title ?? "no resource yet"}.`,
    actionPlan: [
      "Verify income documents and student identity before submission.",
      `Prioritize ${ranked[0]?.resource.title ?? "regional aid discovery"} because it has the strongest eligibility fit.`,
      "Prepare a short counselor note connecting the barrier evidence to the requested support.",
      "Schedule a follow-up within seven days if the case remains in intake."
    ].join("\n"),
    riskFlags: [
      studentCase.householdIncome > 600000 ? "Income may exceed several aid thresholds." : "Income appears within common aid thresholds.",
      studentCase.urgency === "high" ? "High urgency requires accelerated review." : "Standard review timeline is acceptable."
    ]
  };

  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are an education aid operations analyst. Return JSON with summary, actionPlan, and riskFlags array. Keep advice practical and non-deceptive."
      },
      {
        role: "user",
        content: JSON.stringify({ studentCase, rankedResources: ranked })
      }
    ]
  });

  try {
    const parsed = JSON.parse(completion.choices[0]?.message.content ?? "{}");
    return {
      summary: String(parsed.summary ?? fallback.summary).slice(0, 1200),
      actionPlan: String(parsed.actionPlan ?? fallback.actionPlan).slice(0, 3000),
      riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags.map(String).slice(0, 6) : fallback.riskFlags
    };
  } catch {
    return fallback;
  }
}
