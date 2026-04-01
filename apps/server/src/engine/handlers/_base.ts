export interface HandlerResult {
  output: Record<string, unknown>;
}

export async function execute(
  _config: Record<string, unknown>,
  _inputs: Record<string, unknown>
): Promise<HandlerResult> {
  return { output: {} };
}
