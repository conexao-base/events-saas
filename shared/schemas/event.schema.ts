import { z } from "zod";

export const registrationFieldSchema = z
  .object({
    id: z.string().trim().min(1).max(100),
    label: z.string().trim().min(1).max(120),
    type: z.enum(["text", "email", "phone", "cpf", "city", "date", "select"]),
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

const requiredDefaultFields = [
  { type: "text", label: "Nome completo" },
  { type: "email", label: "E-mail" },
  { type: "phone", label: "Telefone" },
  { type: "cpf", label: "CPF" },
  { type: "date", label: "Data de nascimento" },
  { type: "city", label: "Cidade" },
] as const;

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
    })
    .superRefine((info, context) => {
      if (info.startDate > info.endDate) {
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
        .array(registrationFieldSchema)
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

      for (const requiredField of requiredDefaultFields) {
        const field = registration.fields.find(
          (item) =>
            item.type === requiredField.type &&
            item.label.toLowerCase() === requiredField.label.toLowerCase(),
        );

        if (!field || !field.required) {
          context.addIssue({
            code: "custom",
            path: ["fields"],
            message: `O campo "${requiredField.label}" deve existir e ser obrigatório.`,
          });
        }
      }
    }),

  appearance: z.object({
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    coverImage: z.union([z.url(), z.literal("")]).default(""),
    logo: z.union([z.url(), z.literal("")]).default(""),
  }),
});

export const updateEventStatusSchema = z.object({
  status: z.enum(["draft", "published"]),
});

export type EventInput = z.infer<typeof eventSchema>;
export type RegistrationField = z.infer<typeof registrationFieldSchema>;
