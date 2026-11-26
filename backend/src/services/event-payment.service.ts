import { db } from "../config/database.js";
import {
  paymentLotSchema,
  paymentRuleSchema,
  paymentSettingsSchema,
} from "../schemas/event-payment.schema.js";
import { AppError } from "../utils/app-error.js";

async function assertOwnedEvent(eventId: string, userId: string) {
  const event = await db("events")
    .where({ id: eventId, user_id: userId })
    .first("id");
  if (!event) throw new AppError("Evento não encontrado.", 404);
  return event;
}

export class EventPaymentService {
  static async findSettings(eventId: string, userId: string) {
    await assertOwnedEvent(eventId, userId);
    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first();
    return settings ?? { event_id: eventId, enabled: false, due_days: 1 };
  }

  static async updateSettings(eventId: string, userId: string, input: unknown) {
    await assertOwnedEvent(eventId, userId);
    const parsed = paymentSettingsSchema.safeParse(input);
    if (!parsed.success)
      throw new AppError("Configurações de pagamento inválidas.", 400);
    const values = {
      enabled: parsed.data.enabled,
      due_days: parsed.data.dueDays,
      updated_at: db.fn.now(),
    };
    const existing = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first("id");
    if (existing) {
      await db("event_payment_settings")
        .where({ event_id: eventId })
        .update(values);
    } else {
      await db("event_payment_settings").insert({
        event_id: eventId,
        ...values,
      });
    }
    return this.findSettings(eventId, userId);
  }

  static async findRules(eventId: string, userId: string) {
    await assertOwnedEvent(eventId, userId);
    return db("event_payment_rules as r")
      .join("event_payment_settings as s", "s.id", "r.settings_id")
      .where("s.event_id", eventId)
      .select("r.*")
      .orderBy("r.position")
      .orderBy("r.start_date");
  }

  static async createRule(eventId: string, userId: string, input: unknown) {
    await assertOwnedEvent(eventId, userId);
    const parsed = paymentRuleSchema.safeParse(input);
    if (!parsed.success)
      throw new AppError("Regra de pagamento inválida.", 400);
    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first("id");
    if (!settings)
      throw new AppError(
        "Configure os pagamentos do evento antes de criar regras.",
        409,
      );
    const rule = parsed.data;
    const overlap = await db("event_payment_rules")
      .where({ settings_id: settings.id, active: true })
      .where("start_date", "<=", rule.endDate)
      .where("end_date", ">=", rule.startDate)
      .first("id");
    if (overlap && rule.active)
      throw new AppError("Já existe uma regra ativa nesse período.", 409);
    const [created] = await db("event_payment_rules")
      .insert({
        settings_id: settings.id,
        name: rule.name,
        start_date: rule.startDate,
        end_date: rule.endDate,
        billing_types: JSON.stringify(rule.billingTypes),
        max_installments: rule.maxInstallments,
        active: rule.active,
        position: rule.position,
      })
      .returning("*");
    return created;
  }

  static async updateRule(
    eventId: string,
    userId: string,
    ruleId: string,
    input: unknown,
  ) {
    await assertOwnedEvent(eventId, userId);
    const parsed = paymentRuleSchema.safeParse(input);
    if (!parsed.success)
      throw new AppError("Regra de pagamento inválida.", 400);
    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first("id");
    if (!settings)
      throw new AppError("Configuração de pagamento não encontrada.", 404);
    const current = await db("event_payment_rules")
      .where({ id: ruleId, settings_id: settings.id })
      .first("id");
    if (!current) throw new AppError("Regra de pagamento não encontrada.", 404);
    const r = parsed.data;
    const overlap = await db("event_payment_rules")
      .where({ settings_id: settings.id, active: true })
      .whereNot({ id: ruleId })
      .where("start_date", "<=", r.endDate)
      .where("end_date", ">=", r.startDate)
      .first("id");
    if (overlap && r.active)
      throw new AppError("Já existe uma regra ativa nesse período.", 409);
    const [updated] = await db("event_payment_rules")
      .where({ id: ruleId })
      .update({
        name: r.name,
        start_date: r.startDate,
        end_date: r.endDate,
        billing_types: JSON.stringify(r.billingTypes),
        max_installments: r.maxInstallments,
        active: r.active,
        position: r.position,
        updated_at: db.fn.now(),
      })
      .returning("*");
    return updated;
  }

  static async deleteRule(eventId: string, userId: string, ruleId: string) {
    await assertOwnedEvent(eventId, userId);
    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first("id");
    if (!settings)
      throw new AppError("Configuração de pagamento não encontrada.", 404);
    const deleted = await db("event_payment_rules")
      .where({ id: ruleId, settings_id: settings.id })
      .delete();
    if (!deleted) throw new AppError("Regra de pagamento não encontrada.", 404);
  }

  static async findLots(eventId: string, userId: string) {
    await assertOwnedEvent(eventId, userId);
    return db("event_payment_lots")
      .where({ event_id: eventId })
      .orderBy("position")
      .orderBy("start_date");
  }

  static async createLot(eventId: string, userId: string, input: unknown) {
    await assertOwnedEvent(eventId, userId);
    const parsed = paymentLotSchema.safeParse(input);
    if (!parsed.success) throw new AppError("Lote inválido.", 400);
    const l = parsed.data;
    const [lot] = await db("event_payment_lots")
      .insert({
        event_id: eventId,
        name: l.name,
        value: l.value,
        start_date: l.startDate,
        end_date: l.endDate,
        capacity: l.capacity ?? null,
        active: l.active,
        position: l.position,
      })
      .returning("*");
    return lot;
  }

  static async updateLot(
    eventId: string,
    userId: string,
    lotId: string,
    input: unknown,
  ) {
    await assertOwnedEvent(eventId, userId);
    const parsed = paymentLotSchema.safeParse(input);

    if (!parsed.success) {
      console.error("Erro ao validar lote:", parsed.error.flatten());
      console.error("Payload recebido:", input);

      throw new AppError("Lote inválido.", 400);
    }
    const l = parsed.data;
    const [lot] = await db("event_payment_lots")
      .where({ id: lotId, event_id: eventId })
      .update({
        name: l.name,
        value: l.value,
        start_date: l.startDate,
        end_date: l.endDate,
        capacity: l.capacity ?? null,
        active: l.active,
        position: l.position,
        updated_at: db.fn.now(),
      })
      .returning("*");
    if (!lot) throw new AppError("Lote não encontrado.", 404);
    return lot;
  }

  static async deleteLot(eventId: string, userId: string, lotId: string) {
    await assertOwnedEvent(eventId, userId);
    const deleted = await db("event_payment_lots")
      .where({ id: lotId, event_id: eventId })
      .delete();
    if (!deleted) throw new AppError("Lote não encontrado.", 404);
  }

  static async findPublicPaymentOptions(eventId: string) {
    const event = await db("events")
      .where({ id: eventId, status: "published" })
      .first("id");

    if (!event) {
      throw new AppError("Evento não encontrado ou indisponível.", 404);
    }

    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first();

    if (!settings?.enabled) {
      return {
        enabled: false,
        lots: [],
        rules: [],
      };
    }

    const date = new Date().toISOString().slice(0, 10);

    const lots = await db("event_payment_lots")
      .where({ event_id: eventId, active: true })
      .where("start_date", "<=", date)
      .where("end_date", ">=", date)
      .orderBy("position");

    const rules = await db("event_payment_rules")
      .where({
        settings_id: settings.id,
        active: true,
      })
      .where("start_date", "<=", date)
      .where("end_date", ">=", date)
      .orderBy("position");

    return {
      enabled: true,
      lots,
      rules,
    };
  }
}
