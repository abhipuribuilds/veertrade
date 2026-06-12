import { z } from "zod";

export const createStrategySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["visual", "code"]),
  config: z.record(z.unknown()),
  tags: z.array(z.string()).max(10).default([]),
});

export const updateStrategySchema = createStrategySchema.partial();
