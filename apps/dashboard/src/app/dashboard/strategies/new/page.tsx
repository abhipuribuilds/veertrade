"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BlockConfig } from "@/components/strategy/BlockConfig";
import { BlockLibrary } from "@/components/strategy/BlockLibrary";
import { StrategyPreview } from "@/components/strategy/StrategyPreview";
import { TemplateSelector } from "@/components/strategy/TemplateSelector";
import { useStrategyStore } from "@/stores/strategy";

interface Template {
  id: string;
  name: string;
  config: Record<string, unknown>;
  tags: string[];
  description: string;
}

export default function NewStrategyPage() {
  const router = useRouter();
  const { draft, setDraft, reset, blocks, removeBlock, selectBlock } = useStrategyStore();
  const [showTemplates, setShowTemplates] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleTemplateSelect = (tpl: Template) => {
    setDraft({ name: tpl.name });
    setShowTemplates(false);
  };

  const handleSave = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      const config = {
        entry_conditions: blocks
          .filter((b) => b.category === "entry_condition")
          .map((b) => ({ type: b.type, ...b.config })),
        exit_conditions: blocks
          .filter((b) => b.category === "exit_condition")
          .map((b) => ({ type: b.type, ...b.config })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/strategies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": "00000000-0000-0000-0000-000000000001",
        },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          type: "visual",
          config,
          tags: [],
        }),
      });

      if (res.ok) {
        reset();
        router.push("/dashboard/strategies");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/strategies")}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            &larr; Back
          </button>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Strategy name"
              value={draft.name}
              onChange={(e) => setDraft({ name: e.target.value })}
              className="bg-transparent text-lg font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={draft.description}
              onChange={(e) => setDraft({ description: e.target.value })}
              className="bg-transparent text-sm text-zinc-500 placeholder-zinc-600 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Templates
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !draft.name.trim()}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {showTemplates ? (
        <div className="flex-1 overflow-auto p-6 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Start from a template</h2>
          <TemplateSelector onSelect={handleTemplateSelect} />
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 border-r border-zinc-800 overflow-y-auto p-4">
            <BlockLibrary />
          </aside>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {blocks.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
                  Add blocks from the library to build your strategy
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {blocks.map((block) => (
                    <div
                      key={block.id}
                      onClick={() => selectBlock(block.id)}
                      className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        draft.selectedBlockId === block.id
                          ? "bg-zinc-800 border-emerald-500/50"
                          : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-zinc-500 uppercase w-20">
                          {block.category.replace("_", " ")}
                        </span>
                        <span className="text-sm text-zinc-200">{block.label}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          <aside className="w-80 border-l border-zinc-800 overflow-y-auto">
            <BlockConfig />
            <div className="border-t border-zinc-800 p-4">
              <StrategyPreview />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
