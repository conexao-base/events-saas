import { db } from "../../config/database.js";
import type { RegistrationData } from "../../types/registration.types.js";
import { AppError } from "../../utils/app-error.js";
import { AsaasClient } from "./asaas.client.js";

type RegistrationField = {
  id: string;
  type: string;
  label: string;
};

type CustomerResult = {
  customerId: string;
  asaasCustomerId: string;
};

function getFieldValue(
  data: RegistrationData,
  fields: RegistrationField[],
  type: string,
): string {
  const field = fields.find(
    (item) =>
      item.type === type &&
      (type !== "text" || item.label.trim().toLowerCase() === "nome completo"),
  );

  if (!field) return "";

  const value = data[field.id];

  return value === null || value === undefined ? "" : String(value).trim();
}

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export class AsaasCustomerService {
  static async ensureCustomer(
    data: RegistrationData,
    fields: RegistrationField[],
    externalReference: string,
  ): Promise<CustomerResult> {
    const name = getFieldValue(data, fields, "text");
    const cpfCnpj = normalizeDigits(getFieldValue(data, fields, "cpf"));
    const email = getFieldValue(data, fields, "email").toLowerCase();
    const mobilePhone = normalizeDigits(getFieldValue(data, fields, "phone"));

    if (!name || !cpfCnpj) {
      throw new AppError(
        "A inscrição precisa ter nome completo e CPF para cadastrar o cliente.",
        422,
      );
    }

    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      throw new AppError("CPF/CNPJ inválido para cadastro no Asaas.", 422);
    }

    return db.transaction(async (trx) => {
      // Evita que duas inscrições simultâneas criem o mesmo cliente.
      await trx.raw("SELECT pg_advisory_xact_lock(hashtextextended(?, 0))", [
        cpfCnpj,
      ]);

      const existingCustomer = await trx("customers")
        .where({ cpf_cnpj: cpfCnpj })
        .first("id", "asaas_customer_id");

      if (existingCustomer) {
        return {
          customerId: existingCustomer.id,
          asaasCustomerId: existingCustomer.asaas_customer_id,
        };
      }

      if (!existingCustomer && !process.env.ASAAS_API_KEY) {
        throw new AppError(
          "Configure ASAAS_API_KEY para cadastrar clientes.",
          503,
        );
      }

      const remoteCustomer = await AsaasClient.findCustomerByCpf(cpfCnpj);

      const asaasCustomer =
        remoteCustomer ??
        (await AsaasClient.createCustomer({
          name,
          cpfCnpj,
          ...(email ? { email } : {}),
          ...(mobilePhone ? { mobilePhone } : {}),
          externalReference,
        }));

      const [customer] = await trx("customers")
        .insert({
          id: trx.raw("gen_random_uuid()"),
          name,
          cpf_cnpj: cpfCnpj,
          email: email || null,
          mobile_phone: mobilePhone || null,
          asaas_customer_id: asaasCustomer.id,
        })
        .returning(["id", "asaas_customer_id"]);

      return {
        customerId: customer.id,
        asaasCustomerId: customer.asaas_customer_id,
      };
    });
  }
}
