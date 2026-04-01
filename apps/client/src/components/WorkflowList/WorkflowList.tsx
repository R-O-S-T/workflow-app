import { useState, useEffect } from "react";
import { api, type WorkflowSummary } from "../../api/client";
import { WorkflowCard } from "./WorkflowCard";

export function WorkflowList() {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await api.workflows.list();
      setWorkflows(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    const name = prompt("Workflow name:", "New Workflow");
    if (!name?.trim()) return;
    try {
      const created = await api.workflows.create(name.trim());
      setWorkflows((prev) => [created, ...prev]);
    } catch (e) {
      alert("Failed to create: " + String(e));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this workflow?")) return;
    try {
      await api.workflows.delete(id);
      setWorkflows((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      alert("Failed to delete: " + String(e));
    }
  }

  async function handleDuplicate(id: string) {
    try {
      const copy = await api.workflows.duplicate(id);
      setWorkflows((prev) => [copy, ...prev]);
    } catch (e) {
      alert("Failed to duplicate: " + String(e));
    }
  }

  async function handleRename(id: string, name: string) {
    try {
      const updated = await api.workflows.update(id, { name });
      setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, name: updated.name } : w)));
    } catch (e) {
      alert("Failed to rename: " + String(e));
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 text-white font-sans">
      {/* Header */}
      <header className="border-b border-border-default px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-accent">Workflow Builder</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Workflow
        </button>
      </header>

      <main className="px-8 py-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Your workflows</h2>

        {loading && (
          <div className="text-center py-16 text-gray-600">Loading...</div>
        )}

        {error && (
          <div className="text-center py-16 text-red-400">{error}</div>
        )}

        {!loading && !error && workflows.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">No workflows yet.</p>
            <button onClick={handleCreate} className="text-accent hover:underline text-sm">
              Create your first workflow →
            </button>
          </div>
        )}

        {!loading && !error && workflows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {workflows.map((w) => (
              <WorkflowCard
                key={w.id}
                workflow={w}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
