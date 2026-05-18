import OpenAI from "openai";
import { InsightType } from "@prisma/client";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export type ParsedInsight = {
  type: InsightType;
  content: string;
};

export async function generateInsightsFromAI(
  role: "EMPLOYEE" | "MANAGER" | "ADMIN",
  contextData: any
): Promise<ParsedInsight[]> {
  if (!openai) {
    return generateFallbackInsights(role, contextData);
  }

  let prompt = "";
  if (role === "EMPLOYEE") {
    prompt = `You are an AI coach for an employee. Based on the following goals and updates data, generate 3 insights focusing on personal recommendations, goal risk alerts, and productivity suggestions. Format as a JSON object with an 'insights' key containing an array of objects with 'type' (must be one of: RISK, OPPORTUNITY, ANOMALY, SUMMARY) and 'content' (the insight text). Limit each insight to 1-2 sentences. Data: ${JSON.stringify(contextData).slice(0, 3000)}`;
  } else if (role === "MANAGER") {
    prompt = `You are an AI advisor for a manager. Based on the following team goals and updates data, generate 3 insights focusing on team performance, at-risk employee detection, and coaching suggestions. Format as a JSON object with an 'insights' key containing an array of objects with 'type' (must be one of: RISK, OPPORTUNITY, ANOMALY, SUMMARY) and 'content' (the insight text). Limit each insight to 1-2 sentences. Data: ${JSON.stringify(contextData).slice(0, 3000)}`;
  } else {
    prompt = `You are a strategic AI advisor for an executive admin. Based on the following organization-wide goals and updates data, generate 3 insights focusing on organization trends, department comparisons, and strategic recommendations. Format as a JSON object with an 'insights' key containing an array of objects with 'type' (must be one of: RISK, OPPORTUNITY, ANOMALY, SUMMARY) and 'content' (the insight text). Limit each insight to 1-2 sentences. Data: ${JSON.stringify(contextData).slice(0, 3000)}`;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content);
    const insightsArray = parsed.insights || [];
    
    return insightsArray.map((i: any) => ({
      type: (["RISK", "OPPORTUNITY", "ANOMALY", "SUMMARY"].includes(i.type) ? i.type : "SUMMARY") as InsightType,
      content: i.content,
    }));
  } catch (error) {
    console.error("OpenAI generation failed, falling back to heuristics:", error);
    return generateFallbackInsights(role, contextData);
  }
}

function generateFallbackInsights(role: string, contextData: any): ParsedInsight[] {
  if (role === "EMPLOYEE") {
    return [
      { type: "SUMMARY", content: "Review your recent updates to ensure steady progress towards your quarter targets." },
      { type: "OPPORTUNITY", content: "Consider scheduling a sync with your manager to unblock any pending tasks." }
    ];
  } else if (role === "MANAGER") {
    return [
      { type: "RISK", content: "Some team goals have not been updated recently. Follow up with your team." },
      { type: "OPPORTUNITY", content: "Acknowledge the recent achievements of team members who are on track." }
    ];
  } else {
    return [
      { type: "SUMMARY", content: "Overall organization goal completion is progressing as expected." },
      { type: "ANOMALY", content: "Check department metrics for uneven distribution of 'at-risk' goals." }
    ];
  }
}
