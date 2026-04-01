import type { HandlerResult } from "./_base.js";
export async function execute(config: Record<string, unknown>, _inputs: Record<string, unknown>): Promise<HandlerResult> {
  await delay(300);
  return { output: { channel: config.channel ?? "email", message: config.message ?? "", sentAt: new Date().toISOString(), status: "delivered" } };
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
