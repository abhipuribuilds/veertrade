import { create } from "zustand";

export interface Block {
  id: string;
  type: BlockType;
  category: BlockCategory;
  label: string;
  config: Record<string, unknown>;
}

export type BlockType =
  | "crossover"
  | "crossunder"
  | "above"
  | "below"
  | "between"
  | "stop_loss"
  | "target"
  | "trailing_sl"
  | "time_exit"
  | "sma"
  | "ema"
  | "rsi"
  | "macd"
  | "bb"
  | "volume"
  | "operator";

export type BlockCategory =
  | "entry_condition"
  | "exit_condition"
  | "indicator"
  | "operator"
  | "quantity";

export interface StrategyDraft {
  name: string;
  description: string;
  blocks: Block[];
  selectedBlockId: string | null;
}

interface StrategyState {
  draft: StrategyDraft;
  setDraft: (draft: Partial<StrategyDraft>) => void;
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlockConfig: (id: string, config: Record<string, unknown>) => void;
  selectBlock: (id: string | null) => void;
  reorderBlocks: (blocks: Block[]) => void;
  reset: () => void;
}

const initialDraft: StrategyDraft = {
  name: "",
  description: "",
  blocks: [],
  selectedBlockId: null,
};

export const useStrategyStore = create<StrategyState>((set) => ({
  draft: { ...initialDraft },
  setDraft: (partial) =>
    set((state) => ({ draft: { ...state.draft, ...partial } })),
  addBlock: (block) =>
    set((state) => ({
      draft: {
        ...state.draft,
        blocks: [...state.draft.blocks, block],
        selectedBlockId: block.id,
      },
    })),
  removeBlock: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        blocks: state.draft.blocks.filter((b) => b.id !== id),
        selectedBlockId:
          state.draft.selectedBlockId === id ? null : state.draft.selectedBlockId,
      },
    })),
  updateBlockConfig: (id, config) =>
    set((state) => ({
      draft: {
        ...state.draft,
        blocks: state.draft.blocks.map((b) =>
          b.id === id ? { ...b, config: { ...b.config, ...config } } : b
        ),
      },
    })),
  selectBlock: (id) =>
    set((state) => ({ draft: { ...state.draft, selectedBlockId: id } })),
  reorderBlocks: (blocks) =>
    set((state) => ({ draft: { ...state.draft, blocks } })),
  reset: () => set({ draft: { ...initialDraft } }),
}));
