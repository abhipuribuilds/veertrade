"use client";

import { useStrategyStore } from "@/stores/strategy";

export function StrategyPreview() {
  const { draft } = useStrategyStore();

  const config = {
    entry_conditions: draft.blocks
      .filter((b) => b.category === "entry_condition")
      .map((b) => ({ type: b.type, ...b.config })),
    exit_conditions: draft.blocks
      .filter((b) => b.category === "exit_condition")
      .map((b) => ({ type: b.type, ...b.config })),
    indicators: draft.blocks
      .filter((b) => b.category === "indicator")
      .map((b) => ({ type: b.type, ...b.config })),
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Config Preview
      </h3>
      <pre className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-400 overflow-auto max-h-80 font-mono">
        {JSON.stringify(config, null, 2)}
      </pre>
    </div>
  );
}
