import { z } from "zod";

export const placeOrderSchema = z.object({
  instrumentToken: z.string(),
  side: z.enum(["buy", "sell"]),
  orderType: z.enum(["market", "limit", "sl", "sl_m"]),
  quantity: z.number().int().positive(),
  price: z.number().positive().optional(),
  triggerPrice: z.number().positive().optional(),
  variety: z.enum(["regular", "amo"]).default("regular"),
  validity: z.enum(["day", "ioc"]).default("day"),
});
