import type { HandlerResult } from "./_base.js";
export async function execute(config: Record<string, unknown>, _inputs: Record<string, unknown>): Promise<HandlerResult> {
  await delay(700);
  return { output: { to: config.to ?? "0x0", value: config.value ?? 0, txHash: "0xcafebabe...", blockNumber: 19_500_123, status: "confirmed" } };
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
