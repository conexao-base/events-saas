import { z } from "zod";

export const registrationFieldSchema = z
  .object({
    id: z.string().trim().min(1).max(100),
    label: z.string().trim().min(1).max(120),
    type: z.enum(["text", "email", "phone", "date", "select"]),
    required: z.boolean(),
    options: z.array(z.string().trim().min(1).max(100)).max(100).optional(),
  })
  .superRefine((field, context) => {
    if (field.type === "select" && !field.options?.length) {
      context.addIssue({
        code: "custom",
        path: ["options"],
        message: "Campos de seleção precisam ter pelo menos uma opção.",
      });
    }
  });

export const eventSchema = z
  .object({
    info: z.object({
      name: z.string().trim().min(2).max(120),
      description: z.string().trim().max(10000).optional().default(""),
      location: z.string().trim().max(255).optional().default(""),
      startDate: z.iso.date().optional().or(z.literal("")),
      endDate: z.iso.date().optional().or(z.literal("")),
    }),
    registration: z.object({
      fields: z.array(registrationFieldSchema).max(100),
    }),
    appearance: z.object({
      primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      coverImage: z.union([z.url(), z.literal("")]).default(""),
      logo: z.union([z.url(), z.literal("")]).default(""),
    }),
  })
  .superRefine((data, context) => {
    const { startDate, endDate } = data.info;

    if (startDate && endDate && startDate > endDate) {
      context.addIssue({
        code: "custom",
        path: ["info", "endDate"],
        message: "A data final não pode ser anterior à data inicial.",
      });
    }

    const ids = data.registration.fields.map((field) => field.id);

    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        path: ["registration", "fields"],
        message: "Os identificadores dos campos devem ser únicos.",
      });
    }
  });

export type EventInput = z.infer<typeof eventSchema>;
