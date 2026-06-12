"use client";

import type { Block, BlockType } from "@/stores/strategy";
import { useStrategyStore } from "@/stores/strategy";

interface BlockDef {
  type: BlockType;
  category: Block["category"];
  label: string;
  defaultConfig: Record<string, unknown>;
}

const BLOCK_DEFS: BlockDef[] = [
  { type: "crossover", category: "entry_condition", label: "Crossover", defaultConfig: { indicator: "SMA", period: 20, source: "close" } },
  { type: "crossunder", category: "entry_condition", label: "Crossunder", defaultConfig: { indicator: "SMA", period: 20, source: "close" } },
  { type: "above", category: "entry_condition", label: "Above", defaultConfig: { indicator: "RSI", period: 14, source: "close", value: 70 } },
  { type: "below", category: "entry_condition", label: "Below", defaultConfig: { indicator: "RSI", period: 14, source: "close", value: 30 } },
  { type: "between", category: "entry_condition", label: "Between", defaultConfig: { indicator: "RSI", period: 14, source: "close", min: 30, max: 70 } },
  { type: "stop_loss", category: "exit_condition", label: "Stop Loss", defaultConfig: { type: "fixed", value: 2.0 } },
  { type: "target", category: "exit_condition", label: "Target", defaultConfig: { value: 5.0 } },
  { type: "trailing_sl", category: "exit_condition", label: "Trailing Stop", defaultConfig: { trail_percent: 1.0 } },
  { type: "time_exit", category: "exit_condition", label: "Time Exit", defaultConfig: { time_seconds: 86400 } },
  { type: "sma", category: "indicator", label: "SMA", defaultConfig: { period: 20, source: "close" } },
  { type: "ema", category: "indicator", label: "EMA", defaultConfig: { period: 20, source: "close" } },
  { type: "rsi", category: "indicator", label: "RSI", defaultConfig: { period: 14, source: "close" } },
  { type: "macd", category: "indicator", label: "MACD", defaultConfig: { fast: 12, slow: 26, signal: 9 } },
  { type: "bb", category: "indicator", label: "Bollinger Bands", defaultConfig: { period: 20, std_dev: 2 } },
  { type: "volume", category: "indicator", label: "Volume", defaultConfig: { source: "volume" } },
];

const CATEGORIES: { key: Block["category"]; label: string }[] = [
  { key: "entry_condition", label: "Entry Conditions" },
  { key: "exit_condition", label: "Exit Conditions" },
  { key: "indicator", label: "Indicators" },
];

export function BlockLibrary() {
  const addBlock = useStrategyStore((s) => s.addBlock);

  const handleAdd = (def: BlockDef) => {
    const block: Block = {
      id: crypto.randomUUID(),
      type: def.type,
      category: def.category,
      label: def.label,
      config: { ...def.defaultConfig },
    };
    addBlock(block);
  };

  let blockIdCounter = 0;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
        Block Library
      </h3>
      {CATEGORIES.map((cat) => (
        <div key={cat.key}>
          <h4 className="text-xs font-medium text-zinc-500 mb-2">{cat.label}</h4>
          <div className="flex flex-col gap-1.5">
            {BLOCK_DEFS.filter((b) => b.category === cat.key).map((def) => (
              <button
                key={def.type}
                onClick={() => handleAdd(def)}
                className="text-left px-3 py-2 rounded-lg text-sm bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors text-zinc-300 hover:text-zinc-100"
              >
                {def.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
