import type { HandlerResult } from "./_base.js";

const POSITIVE = ["good", "great", "excellent", "amazing", "love", "happy", "positive", "bullish", "gain", "up", "rise", "profit", "win", "success", "strong"];
const NEGATIVE = ["bad", "terrible", "awful", "hate", "sad", "negative", "bearish", "loss", "down", "fall", "crash", "fail", "weak", "dump", "fear"];

export async function execute(
  config: Record<string, unknown>,
  _inputs: Record<string, unknown>
): Promise<HandlerResult> {
  await new Promise((r) => setTimeout(r, 400));

  const text = String(config.text ?? "");

  const lower = text.toLowerCase();
  let score = 0.5;
  for (const w of POSITIVE) if (lower.includes(w)) score = Math.min(1, score + 0.08);
  for (const w of NEGATIVE) if (lower.includes(w)) score = Math.max(0, score - 0.08);
  score = Math.min(1, Math.max(0, score + ((text.length % 7) - 3) * 0.01));

  const label = score >= 0.6 ? "positive" : score <= 0.4 ? "negative" : "neutral";

  return {
    output: {
      score: Math.round(score * 1000) / 1000,
      label,
      referencedAsset: text.match(/\b[A-Z]{2,6}\b/)?.[0] ?? "unknown",
    },
  };
}
