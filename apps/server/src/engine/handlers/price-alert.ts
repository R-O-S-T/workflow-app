import type { HandlerResult } from "./_base.js";
export async function execute(config: Record<string, unknown>, _inputs: Record<string, unknown>): Promise<HandlerResult> {
  await delay(500);
  return { output: { token: config.token ?? "ETH", currentPrice: 3200.50, targetPrice: config.price ?? 3000, direction: config.direction ?? "above", triggered: true } };
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
