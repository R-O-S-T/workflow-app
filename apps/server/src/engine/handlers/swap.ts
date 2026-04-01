import type { HandlerResult } from "./_base.js";
export async function execute(config: Record<string, unknown>, _inputs: Record<string, unknown>): Promise<HandlerResult> {
  await delay(600);
  return { output: { fromToken: config.fromToken ?? "ETH", toToken: config.toToken ?? "USDC", amountIn: config.amount ?? 1, amountOut: 3198.45, txHash: "0xdeadbeef...", status: "confirmed" } };
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
