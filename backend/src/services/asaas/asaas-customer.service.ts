import type { Knex } from "knex";
import { db } from "../../config/database.js";
import { env } from "../../config/env.js";
import { AsaasClient } from "./asaas.client.js";
import { AppError } from "../../utils/app-error.js";
import type { RegistrationData } from "../../types/registration.types.js";

type RegistrationForCustomer = {
  id: string;
  event_id: string;
  data: RegistrationData;
  asaas_customer_id: string | null;
  registration_fields: Array<{
    id: string;
    type: string;
    label: string;
  }>;
};

function getFieldValue(
  registration: RegistrationForCustomer,
  type: string,
): string {
  const field = registration.registration_fields.find(
    (item) =>
      item.type === type &&
      (type !== "text" ||
        item.label.trim().toLowerCase() === "nome completo"),
  );

  if (!field) return "";

  const value = registration.data[field.id];

  return value === null || value === undefined ? "" : String(value).trim();
}

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export class AsaasCustomerService {
  static async ensureCustomer(registrationId: string): Promise<string> {
    if (!env.ASAAS_API_KEY) {
      throw new AppError("Configure ASAAS_API_KEY para cadastrar clientes.", 503);
    }

    const registration = await db("registrations")
      .join("events", "registrations.event_id", "events.id")
      .where("registrations.id", registrationId)
      .select(
        "registrations.id",
        "registrations.event_id",
        "registrations.data",
        "registrations.asaas_customer_id",
        "events.registration_fields",
      )
      .first() as RegistrationForCustomer | undefined;

    if (!registration) {
      throw new AppError("Inscrição não encontrada.", 404);
    }

    if (registration.asaas_customer_id) {
      return registration.asaas_customer_id;
    }

    const name = getFieldValue(registration, "text");
    const cpf = normalizeDigits(getFieldValue(registration, "cpf"));
    const email = getFieldValue(registration, "email").toLowerCase();
    const mobilePhone = normalizeDigits(getFieldValue(registration, "phone"));

    if (!name || !cpf) {
      throw new AppError(
        "A inscrição precisa ter nome completo e CPF para cadastrar o cliente no Asaas.",
        422,
      );
    }

    if (![11, 14].includes(cpf.length)) {
      throw new AppError("CPF/CNPJ inválido para cadastro no Asaas.", 422);
    }

    return db.transaction(async (trx: Knex.Transaction) => {
      // Serializa cadastros simultâneos do mesmo documento dentro desta aplicação.
      await trx.raw("SELECT pg_advisory_xact_lock(hashtextextended(?, 0))", [
        cpf,
      ]);

      const linkedCustomer = await trx("registrations as r")
        .join("events as e", "r.event_id", "e.id")
        .whereNotNull("r.asaas_customer_id")
        .whereRaw(
          `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(e.registration_fields) AS field(value)
            WHERE field.value->>'type' = 'cpf'
              AND regexp_replace(
                COALESCE(r.data ->> (field.value->>'id'), ''),
                '[^0-9]',
                '',
                'g'
              ) = ?
          )`,
          [cpf],
        )
        .first("r.asaas_customer_id");

      if (linkedCustomer?.asaas_customer_id) {
        await trx("registrations")
          .where({ id: registrationId })
          .update({
            asaas_customer_id: linkedCustomer.asaas_customer_id,
            updated_at: trx.fn.now(),
          });

        return linkedCustomer.asaas_customer_id as string;
      }

      // Recupera um cliente que possa ter sido criado no Asaas antes de um timeout
      // ou de uma falha ao persistir o ID na inscrição.
      const existingCustomer = await AsaasClient.findCustomerByCpf(cpf);

      const customer =
        existingCustomer ??
        (await AsaasClient.createCustomer({
          name,
          cpfCnpj: cpf,
          ...(email ? { email } : {}),
          ...(mobilePhone ? { mobilePhone } : {}),
          externalReference: registrationId,
        }));

      await trx("registrations")
        .where({ id: registrationId })
        .update({
          asaas_customer_id: customer.id,
          updated_at: trx.fn.now(),
        });

      return customer.id;
    });
  }
}
