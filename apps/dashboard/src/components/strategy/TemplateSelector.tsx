"use client";

import { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  config: Record<string, unknown>;
  tags: string[];
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

const TEMPLATES: Template[] = [
  {
    id: "MACrossover",
    name: "MACD Crossover",
    description: "Enter when MACD crosses above signal line",
    type: "visual",
    config: {
      entry_conditions: [{ indicator: "MACD", operator: "cross_above", source: "close", value: 0 }],
      exit_conditions: [{ type: "stop_loss", value: 2 }],
      stop_loss: { type: "percent", value: 2 },
    },
    tags: ["momentum", "macd"],
  },
  {
    id: "RSICrossover",
    name: "RSI Crossover",
    description: "Enter when RSI crosses above oversold level",
    type: "visual",
    config: {
      entry_conditions: [{ indicator: "RSI", period: 14, source: "close", operator: "cross_above", value: 30 }],
      exit_conditions: [{ type: "target", value: 5 }],
      stop_loss: { type: "percent", value: 2 },
    },
    tags: ["mean-reversion", "rsi"],
  },
  {
    id: "BollingerBandsReversal",
    name: "Bollinger Bands Reversal",
    description: "Enter when price touches lower Bollinger Band",
    type: "visual",
    config: {
      entry_conditions: [{ indicator: "BB", period: 20, source: "close", operator: "<=", value: 2 }],
      exit_conditions: [{ type: "target", value: 3 }],
      stop_loss: { type: "percent", value: 1.5 },
    },
    tags: ["volatility", "bb"],
  },
  {
    id: "EMACross",
    name: "EMA Cross",
    description: "Enter when fast EMA crosses above slow EMA",
    type: "visual",
    config: {
      entry_conditions: [{ indicator: "EMA", period: 9, source: "close", operator: "cross_above", compare_to: "EMA_21" }],
      exit_conditions: [{ type: "stop_loss", value: 2 }, { type: "time_exit", time_seconds: 86400 }],
      stop_loss: { type: "percent", value: 2 },
    },
    tags: ["trend-following", "ema"],
  },
];

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      {TEMPLATES.map((tpl) => (
        <button
          key={tpl.id}
          onClick={() => {
            setSelectedId(tpl.id);
            onSelect(tpl);
          }}
          className={`text-left p-4 rounded-xl border transition-colors ${
            selectedId === tpl.id
              ? "bg-zinc-800 border-emerald-500/50"
              : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <h4 className="text-sm font-semibold text-zinc-200">{tpl.name}</h4>
          <p className="text-xs text-zinc-500 mt-1">{tpl.description}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {tpl.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}
