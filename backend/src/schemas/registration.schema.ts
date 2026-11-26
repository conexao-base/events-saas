import { z } from "zod";
import { billingTypeSchema } from "../../../shared/schemas/event-payment.schema.js";

export const publicRegistrationSchema = z.object({
  data: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
  ),
  payment: z.object({
    billingType: billingTypeSchema,
    installmentCount: z.number().int().min(1).max(12).default(1),
  }),
  lotId: z.uuid().optional(),
});
export type PublicRegistrationInput = z.infer<typeof publicRegistrationSchema>;
