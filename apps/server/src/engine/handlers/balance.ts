import type { HandlerResult } from "./_base.js";
export async function execute(config: Record<string, unknown>, _inputs: Record<string, unknown>): Promise<HandlerResult> {
  await delay(400);
  return { output: { address: config.address ?? "0x0", balance: 1.234, token: config.token ?? "ETH", threshold: config.threshold ?? 0, triggered: true } };
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
