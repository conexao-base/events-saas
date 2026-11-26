import { db } from "../config/database.js";
import type { PublicRegistrationInput } from "../schemas/registration.schema.js";
import { AppError } from "../utils/app-error.js";
import { AsaasCustomerService } from "./asaas/asaas-customer.service.js";
import { AsaasPaymentService } from "./asaas/assas-payment.service.js";

type RegistrationData = Record<string, string | number | boolean | null>;

type RegistrationStatus = "pending" | "confirmed" | "cancelled";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function validateRegistrationFields(
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
  }>,
  data: RegistrationData,
) {
  for (const field of fields) {
    const value = data[field.id];

    if (
      field.required &&
      (value === undefined || value === null || String(value).trim() === "")
    ) {
      throw new AppError(`O campo "${field.label}" é obrigatório.`, 400);
    }

    if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
    ) {
      throw new AppError(
        `O campo "${field.label}" deve conter um e-mail válido.`,
        400,
      );
    }
  }
}

async function validateDuplicateRegistration(
  eventId: string,
  data: RegistrationData,
  fields: Array<{ id: string; type: string }>,
) {
  const cpfField = fields.find((field) => field.type === "cpf");
  const emailField = fields.find((field) => field.type === "email");

  const cpf = cpfField
    ? String(data[cpfField.id] ?? "").replace(/\D/g, "")
    : "";

  const email = emailField
    ? String(data[emailField.id] ?? "")
        .trim()
        .toLowerCase()
    : "";

  if (!cpf && !email) return;

  const existing = await db("registrations")
    .where({ event_id: eventId })
    .whereNot("status", "cancelled")
    .andWhere((query) => {
      if (cpf) {
        query.whereRaw(
          "regexp_replace(COALESCE(data ->> ?, ''), '[^0-9]', '', 'g') = ?",
          [cpfField!.id, cpf],
        );
      }

      if (email) {
        query.orWhereRaw("lower(trim(COALESCE(data ->> ?, ''))) = ?", [
          emailField!.id,
          email,
        ]);
      }
    })
    .first("id");

  if (existing) {
    throw new AppError(
      "Já existe uma inscrição neste evento com este CPF ou e-mail.",
      409,
    );
  }
}

export class RegistrationService {
  static async createPublic(eventId: string, input: PublicRegistrationInput) {
    const event = await db("events")
      .where({ id: eventId, status: "published" })
      .first();

    if (!event) {
      throw new AppError("Evento não encontrado ou indisponível.", 404);
    }

    const fields = event.registration_fields as Array<{
      id: string;
      label: string;
      type: string;
      required: boolean;
    }>;

    const data = input.data as RegistrationData;

    validateRegistrationFields(fields, data);
    await validateDuplicateRegistration(eventId, data, fields);

    const date = today();

    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first();

    if (!settings?.enabled) {
      throw new AppError(
        "As inscrições pagas não estão habilitadas para este evento.",
        409,
      );
    }

    const lotQuery = db("event_payment_lots")
      .where({ event_id: eventId, active: true })
      .where("start_date", "<=", date)
      .where("end_date", ">=", date);

    if (input.lotId) {
      lotQuery.where({ id: input.lotId });
    }

    const lot = await lotQuery.orderBy("position").first();

    if (!lot) {
      throw new AppError("Não existe lote disponível para este evento.", 409);
    }

    if (lot.capacity !== null) {
      const [{ count }] = await db("registrations")
        .where({ payment_lot_id: lot.id })
        .whereNot({ status: "cancelled" })
        .count<{ count: string }[]>("id as count");

      if (Number(count) >= Number(lot.capacity)) {
        throw new AppError("Este lote esgotou as vagas.", 409);
      }
    }

    const rule = await db("event_payment_rules as r")
      .join("event_payment_settings as s", "s.id", "r.settings_id")
      .where("s.event_id", eventId)
      .where("r.active", true)
      .where("r.start_date", "<=", date)
      .where("r.end_date", ">=", date)
      .orderBy("r.position")
      .first("r.*");

    if (!rule) {
      throw new AppError(
        "Não existe regra de pagamento vigente para este período.",
        409,
      );
    }

    const billingTypes = rule.billing_types as string[];

    if (!billingTypes.includes(input.payment.billingType)) {
      throw new AppError("Forma de pagamento indisponível neste período.", 400);
    }

    if (input.payment.installmentCount > Number(rule.max_installments)) {
      throw new AppError("Quantidade de parcelas não permitida.", 400);
    }

    if (
      input.payment.installmentCount > 1 &&
      input.payment.billingType !== "CREDIT_CARD"
    ) {
      throw new AppError(
        "Parcelamento disponível somente para cartão de crédito.",
        400,
      );
    }

    // 1. Localiza ou cadastra o cliente.
    const customer = await AsaasCustomerService.ensureCustomer(
      data,
      fields,
      eventId,
    );

    // 2. Cria a inscrição vinculada ao cliente.
    const [registration] = await db("registrations")
      .insert({
        event_id: eventId,
        customer_id: customer.customerId,
        payment_lot_id: lot.id,
        payment_rule_id: rule.id,
        data: JSON.stringify(data),
        payment_amount: lot.value,
        asaas_customer_id: customer.asaasCustomerId,
        payment_conditions: JSON.stringify({
          lotName: lot.name,
          amount: lot.value,
          billingType: input.payment.billingType,
          installments: input.payment.installmentCount,
          ruleName: rule.name,
          rulePeriod: {
            startDate: rule.start_date,
            endDate: rule.end_date,
          },
        }),
        payment_billing_type: input.payment.billingType,
        payment_installments: input.payment.installmentCount,
        status: "pending",
      })
      .returning("*");

    // 3. Cria a cobrança no Asaas.
    const payment = await AsaasPaymentService.createForRegistration({
      registrationId: registration.id,
      billingType: input.payment.billingType,
      installmentCount: input.payment.installmentCount,
    });

    return {
      registration,
      payment,
    };
  }

  static async createByAdmin(
    eventId: string,
    userId: string,
    data: RegistrationData,
    status: RegistrationStatus,
  ) {
    const event = await db("events")
      .where({ id: eventId, user_id: userId })
      .first("id");

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    const [registration] = await db("registrations")
      .insert({
        event_id: eventId,
        data: JSON.stringify(data),
        status,
      })
      .returning("*");

    return registration;
  }

  static async findAllByEvent(eventId: string, userId: string) {
    const event = await db("events")
      .where({ id: eventId, user_id: userId })
      .first("id");

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    return db("registrations")
      .where({ event_id: eventId })
      .orderBy("created_at", "desc");
  }

  static async findAll(userId: string) {
    return db("registrations as r")
      .join("events as e", "e.id", "r.event_id")
      .where("e.user_id", userId)
      .select("r.*", "e.name as event_name")
      .orderBy("r.created_at", "desc");
  }

  static async update(
    registrationId: string,
    userId: string,
    data: RegistrationData,
    status: RegistrationStatus,
  ) {
    const [row] = await db("registrations as r")
      .where("r.id", registrationId)
      .whereIn(
        "r.event_id",
        db("events").select("id").where({ user_id: userId }),
      )
      .update({
        data: JSON.stringify(data),
        status,
        updated_at: db.fn.now(),
      })
      .returning("r.*");

    if (!row) {
      throw new AppError("Inscrição não encontrada.", 404);
    }

    return row;
  }

  static async updateStatus(
    registrationId: string,
    userId: string,
    status: RegistrationStatus,
  ) {
    const [row] = await db("registrations as r")
      .join("events as e", "e.id", "r.event_id")
      .where("r.id", registrationId)
      .where("e.user_id", userId)
      .update({
        status,
        updated_at: db.fn.now(),
      })
      .returning("r.*");

    if (!row) {
      throw new AppError("Inscrição não encontrada.", 404);
    }

    return row;
  }

  static async delete(registrationId: string, userId: string) {
    const deleted = await db("registrations as r")
      .where("r.id", registrationId)
      .whereIn(
        "r.event_id",
        db("events").select("id").where({ user_id: userId }),
      )
      .delete();

    if (!deleted) {
      throw new AppError("Inscrição não encontrada.", 404);
    }
  }
}
