import { triggers, actions } from "@workflow/shared";
import { useUIStore } from "../../store/uiStore";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { ItemCard } from "./ItemCard";
import type { NodeCategory } from "@workflow/shared";

export function Sidebar() {
  const { sidebarTab, sidebarFilter, sidebarSearch, setSidebarTab, setSidebarFilter, setSidebarSearch } = useUIStore();

  const items = sidebarTab === "trigger" ? triggers : actions;

  const filtered = items.filter((item) => {
    if (sidebarFilter !== "all" && item.category !== (sidebarFilter as NodeCategory)) return false;
    if (sidebarSearch && !item.name.toLowerCase().includes(sidebarSearch.toLowerCase()) &&
        !item.description.toLowerCase().includes(sidebarSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-0 border-r border-border-default flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border-default">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Nodes</h2>
        {/* Tab switcher */}
        <div className="flex bg-surface-2 rounded-lg p-0.5 mb-3">
          {(["trigger", "action"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSidebarTab(tab)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                sidebarTab === tab ? "bg-surface-3 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}s
            </button>
          ))}
        </div>
        <SearchBar value={sidebarSearch} onChange={setSidebarSearch} />
      </div>

      {/* Filter */}
      <div className="px-3 py-2 border-b border-border-default">
        <CategoryFilter value={sidebarFilter as "all" | NodeCategory} onChange={setSidebarFilter} />
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-600">No results</div>
        ) : (
          filtered.map((def) => <ItemCard key={def.id} def={def} />)
        )}
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-border-default">
        <p className="text-[10px] text-gray-600 text-center">Drag nodes onto the canvas</p>
      </div>
    </aside>
  );
}
