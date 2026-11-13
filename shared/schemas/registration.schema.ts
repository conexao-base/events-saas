import { z } from "zod";
import type { EventInput } from "./event.schema";

export type RegistrationField = EventInput["registration"]["fields"][number];

export const registrationAnswersSchema = z.record(z.string(), z.string());

export const createRegistrationSchema = (fields: RegistrationField[]) =>
  z
    .object({
      price: z.string().optional(),
      answers: registrationAnswersSchema,
    })
    .superRefine(({ answers }, context) => {
      const fieldIds = new Set(fields.map((field) => field.id));

      for (const field of fields) {
        const value = answers[field.id]?.trim() ?? "";

        if (field.required && !value) {
          context.addIssue({
            code: "custom",
            path: ["answers", field.id],
            message: `${field.label} é obrigatório.`,
          });

          continue;
        }

        if (!value) continue;

        switch (field.type) {
          case "email":
            if (!z.email().safeParse(value).success) {
              context.addIssue({
                code: "custom",
                path: ["answers", field.id],
                message: "Informe um e-mail válido.",
              });
            }
            break;

          case "phone": {
            const digits = value.replace(/\D/g, "");

            if (digits.length < 10 || digits.length > 13) {
              context.addIssue({
                code: "custom",
                path: ["answers", field.id],
                message: "Informe um celular válido.",
              });
            }
            break;
          }

          case "cpf": {
            const digits = value.replace(/\D/g, "");

            if (digits.length !== 11) {
              context.addIssue({
                code: "custom",
                path: ["answers", field.id],
                message: "Informe um CPF válido.",
              });
            }
            break;
          }

          case "date":
            if (!z.iso.date().safeParse(value).success) {
              context.addIssue({
                code: "custom",
                path: ["answers", field.id],
                message: "Informe uma data válida.",
              });
            }
            break;

          case "select":
            if (!field.options?.includes(value)) {
              context.addIssue({
                code: "custom",
                path: ["answers", field.id],
                message: "Selecione uma opção válida.",
              });
            }
            break;
        }
      }

      for (const answerId of Object.keys(answers)) {
        if (!fieldIds.has(answerId)) {
          context.addIssue({
            code: "custom",
            path: ["answers", answerId],
            message: "Campo de inscrição inválido.",
          });
        }
      }
    });

export type RegistrationInput = z.infer<
  ReturnType<typeof createRegistrationSchema>
>;
