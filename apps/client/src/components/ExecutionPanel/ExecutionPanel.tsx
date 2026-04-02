import { useState } from "react";
import { useExecutionStore, type Execution, type ExecutionStep } from "../../store/executionStore";
import { useWorkflowStore } from "../../store/workflowStore";

function statusColor(status: string) {
  if (status === "completed") return "text-green-400";
  if (status === "failed") return "text-red-400";
  if (status === "running") return "text-accent";
  if (status === "skipped") return "text-gray-500";
  return "text-gray-400";
}

function statusDot(status: string) {
  if (status === "completed") return "bg-green-400";
  if (status === "failed") return "bg-red-400";
  if (status === "running") return "bg-accent animate-pulse";
  return "bg-surface-3";
}

function JsonBlock({ data }: { data: Record<string, unknown> | undefined }) {
  if (!data || Object.keys(data).length === 0) return <span className="text-gray-600 italic">empty</span>;
  return (
    <pre className="text-[10px] text-gray-300 bg-surface-0 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function StepRow({ step, nodeName }: { step: ExecutionStep; nodeName: string }) {
  const [open, setOpen] = useState(false);
  const hasData = step.input || step.output || step.error;

  return (
    <div>
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-surface-2 transition-colors text-left"
        onClick={() => hasData && setOpen((o) => !o)}
      >
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(step.status)}`} />
        <span className="text-xs text-gray-300 flex-1 truncate">{nodeName}</span>
        <span className={`text-xs capitalize ${statusColor(step.status)}`}>{step.status}</span>
        {hasData && (
          <svg
            className={`w-3 h-3 text-gray-600 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {open && (
        <div className="px-3 pb-2 space-y-1.5">
          {step.error && (
            <div>
              <div className="text-[10px] text-red-400 font-medium uppercase tracking-wider mb-0.5">Error</div>
              <pre className="text-[10px] text-red-300 bg-surface-0 rounded p-2 whitespace-pre-wrap break-all">{step.error}</pre>
            </div>
          )}
          {step.output && typeof step.output.message === "string" && (
            <div className="px-2 py-1.5 bg-surface-0 rounded border border-border-subtle">
              <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Message</div>
              <div className="text-xs text-white whitespace-pre-wrap break-all">{step.output.message}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Input</div>
            <JsonBlock data={step.input} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Output</div>
            <JsonBlock data={step.output} />
          </div>
        </div>
      )}
    </div>
  );
}

function ExecutionRow({ execution }: { execution: Execution }) {
  const [open, setOpen] = useState(false);
  const nodes = useWorkflowStore((s) => s.nodes);

  const triggeredAt = new Date(execution.triggeredAt).toLocaleTimeString();
  const duration = execution.completedAt
    ? `${((new Date(execution.completedAt).getTime() - new Date(execution.triggeredAt).getTime()) / 1000).toFixed(1)}s`
    : "…";

  function nodeName(nodeId: string) {
    const n = nodes.find((node) => node.id === nodeId);
    return (n?.data?.label as string) ?? nodeId.slice(0, 8);
  }

  return (
    <div className="border border-border-default rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-2 px-3 py-2 bg-surface-2 hover:bg-surface-3 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(execution.status)}`} />
        <span className={`text-xs font-medium capitalize ${statusColor(execution.status)}`}>{execution.status}</span>
        <span className="text-xs text-gray-600 ml-auto">{triggeredAt}</span>
        <span className="text-xs text-gray-600 w-8 text-right">{duration}</span>
        <svg
          className={`w-3 h-3 text-gray-600 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="divide-y divide-border-subtle">
          {execution.steps.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-600">No steps</div>
          ) : (
            execution.steps.map((step) => (
              <StepRow key={step.nodeId} step={step} nodeName={nodeName(step.nodeId)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function ExecutionPanel() {
  const { executions, currentExecution } = useExecutionStore();

  const allExecutions = currentExecution && !executions.find((e) => e.id === currentExecution.id)
    ? [currentExecution, ...executions]
    : executions.length > 0 ? executions : currentExecution ? [currentExecution] : [];

  return (
    <div className="border-t border-border-default bg-surface-0 flex flex-col" style={{ height: 260 }}>
      <div className="flex items-center px-4 py-2 border-b border-border-default flex-shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Execution History</span>
        <span className="ml-2 text-xs text-gray-600">{allExecutions.length} run{allExecutions.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {allExecutions.length === 0 ? (
          <div className="text-center py-6 text-xs text-gray-600">No executions yet. Hit Run to start.</div>
        ) : (
          allExecutions.map((ex) => <ExecutionRow key={ex.id} execution={ex} />)
        )}
      </div>
    </div>
  );
}
