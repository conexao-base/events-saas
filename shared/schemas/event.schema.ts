import { z } from "zod";

export const eventSchema = z.object({
  info: z
    .object({
      name: z
        .string()
        .trim()
        .min(2, "O nome precisa ter pelo menos 2 caracteres.")
        .max(120),

      description: z
        .string()
        .trim()
        .max(10000, "A descrição deve ter no máximo 10.000 caracteres."),

      location: z
        .string()
        .trim()
        .min(1, "O local do evento é obrigatório.")
        .max(255),

      startDate: z.iso.date({
        error: "A data de início é obrigatória.",
      }),

      endDate: z.iso.date({
        error: "A data de término é obrigatória.",
      }),

      price: z.string().trim().min(1, "O valor da inscrição é obrigatório."),
    })
    .superRefine((info, context) => {
      if (info.startDate && info.endDate && info.startDate > info.endDate) {
        context.addIssue({
          code: "custom",
          path: ["endDate"],
          message: "A data final não pode ser anterior à data inicial.",
        });
      }
    }),

  registration: z
    .object({
      fields: z
        .array(
          z
            .object({
              id: z.string().trim().min(1).max(100),
              label: z.string().trim().min(1).max(120),
              type: z.enum([
                "text",
                "email",
                "phone",
                "cpf",
                "city",
                "date",
                "select",
              ]),
              required: z.boolean(),
              options: z
                .array(z.string().trim().min(1).max(100))
                .max(100)
                .optional(),
            })
            .superRefine((field, context) => {
              if (field.type === "select" && !field.options?.length) {
                context.addIssue({
                  code: "custom",
                  path: ["options"],
                  message:
                    "Campos de seleção precisam ter pelo menos uma opção.",
                });
              }
            }),
        )
        .min(1, "Adicione pelo menos um campo de inscrição.")
        .max(100),
    })
    .superRefine((registration, context) => {
      const ids = registration.fields.map((field) => field.id);

      if (new Set(ids).size !== ids.length) {
        context.addIssue({
          code: "custom",
          path: ["fields"],
          message: "Os identificadores dos campos devem ser únicos.",
        });
      }

      if (!registration.fields.some((field) => field.required)) {
        context.addIssue({
          code: "custom",
          path: ["fields"],
          message: "Pelo menos um campo deve ser obrigatório.",
        });
      }
    }),

  appearance: z.object({
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    coverImage: z.union([z.url(), z.literal("")]).default(""),
    logo: z.union([z.url(), z.literal("")]).default(""),
  }),
});

export type EventInput = z.infer<typeof eventSchema>;
