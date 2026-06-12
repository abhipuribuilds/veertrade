"use client";

import { useStrategyStore } from "@/stores/strategy";

export function BlockConfig() {
  const { draft, updateBlockConfig } = useStrategyStore();
  const selected = draft.blocks.find((b) => b.id === draft.selectedBlockId);

  if (!selected) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        Select a block to configure
      </div>
    );
  }

  const update = (key: string, value: unknown) => {
    updateBlockConfig(selected.id, { [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        {selected.label}
      </h3>
      <div className="flex flex-col gap-3">
        {Object.entries(selected.config).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 capitalize">
              {key.replace(/_/g, " ")}
            </label>
            {typeof value === "boolean" ? (
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => update(key, e.target.checked)}
                className="accent-emerald-500"
              />
            ) : typeof value === "number" ? (
              <input
                type="number"
                value={value}
                onChange={(e) => update(key, Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <input
                type="text"
                value={String(value)}
                onChange={(e) => update(key, e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
