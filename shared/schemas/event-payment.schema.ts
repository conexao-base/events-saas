import { z } from "zod";

export const billingTypeSchema = z.enum(["PIX", "BOLETO", "CREDIT_CARD"]);

const dateSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value;
}, z.iso.date());

export const paymentSettingsSchema = z.object({
  enabled: z.boolean(),
  dueDays: z.number().int().min(0).max(90).default(1),
});

export const paymentLotSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    value: z.number().finite().min(0),
    startDate: dateSchema,
    endDate: dateSchema,
    capacity: z.number().int().positive().nullable().optional(),

    billingTypes: z.array(billingTypeSchema).min(1).max(3),
    maxInstallments: z.number().int().min(1).max(12).default(1),

    active: z.boolean().default(true),
    position: z.number().int().min(0).default(0),
  })
  .superRefine((value, ctx) => {
    if (value.endDate < value.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "A data final deve ser igual ou posterior à inicial.",
      });
    }

    if (
      value.maxInstallments > 1 &&
      !value.billingTypes.includes("CREDIT_CARD")
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["maxInstallments"],
        message: "Parcelamento exige cartão de crédito.",
      });
    }
  });

export type BillingType = z.infer<typeof billingTypeSchema>;
export type PaymentSettingsInput = z.infer<typeof paymentSettingsSchema>;
export type PaymentLotInput = z.infer<typeof paymentLotSchema>;
