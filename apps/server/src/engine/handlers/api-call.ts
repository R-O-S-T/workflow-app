import type { HandlerResult } from "./_base.js";
export async function execute(config: Record<string, unknown>, _inputs: Record<string, unknown>): Promise<HandlerResult> {
  await delay(500);
  return { output: { url: config.url ?? "", method: config.method ?? "GET", statusCode: 200, body: { success: true, data: "mock response" } } };
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
