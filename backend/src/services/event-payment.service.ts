import {
  paymentLotSchema,
  paymentSettingsSchema,
} from "../../../shared/schemas/event-payment.schema.js";
import { db } from "../config/database.js";
import { AppError } from "../utils/app-error.js";

async function assertOwnedEvent(eventId: string, userId: string) {
  const event = await db("events")
    .where({ id: eventId, user_id: userId })
    .first("id");

  if (!event) {
    throw new AppError("Evento não encontrado.", 404);
  }

  return event;
}

export class EventPaymentService {
  static async findSettings(eventId: string, userId: string) {
    await assertOwnedEvent(eventId, userId);

    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first();

    return (
      settings ?? {
        event_id: eventId,
        enabled: false,
        due_days: 1,
      }
    );
  }

  static async updateSettings(eventId: string, userId: string, input: unknown) {
    await assertOwnedEvent(eventId, userId);

    const parsed = paymentSettingsSchema.safeParse(input);

    if (!parsed.success) {
      console.error("Erro ao validar configurações:", parsed.error.flatten());

      throw new AppError("Configurações de pagamento inválidas.", 400);
    }

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

    if (!parsed.success) {
      console.error("Erro ao validar lote:", parsed.error.flatten());

      throw new AppError("Lote inválido.", 400);
    }

    const lot = parsed.data;

    const [created] = await db("event_payment_lots")
      .insert({
        event_id: eventId,
        name: lot.name,
        value: lot.value,
        start_date: lot.startDate,
        end_date: lot.endDate,
        capacity: lot.capacity ?? null,
        billing_types: JSON.stringify(lot.billingTypes),
        max_installments: lot.maxInstallments,
        active: lot.active,
        position: lot.position,
      })
      .returning("*");

    return created;
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

      throw new AppError("Lote inválido.", 400);
    }

    const lot = parsed.data;

    const [updated] = await db("event_payment_lots")
      .where({ id: lotId, event_id: eventId })
      .update({
        name: lot.name,
        value: lot.value,
        start_date: lot.startDate,
        end_date: lot.endDate,
        capacity: lot.capacity ?? null,
        billing_types: JSON.stringify(lot.billingTypes),
        max_installments: lot.maxInstallments,
        active: lot.active,
        position: lot.position,
        updated_at: db.fn.now(),
      })
      .returning("*");

    if (!updated) {
      throw new AppError("Lote não encontrado.", 404);
    }

    return updated;
  }

  static async deleteLot(eventId: string, userId: string, lotId: string) {
    await assertOwnedEvent(eventId, userId);

    const deleted = await db("event_payment_lots")
      .where({ id: lotId, event_id: eventId })
      .delete();

    if (!deleted) {
      throw new AppError("Lote não encontrado.", 404);
    }
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
      };
    }

    const date = new Date().toISOString().slice(0, 10);

    const lots = await db("event_payment_lots")
      .where({
        event_id: eventId,
        active: true,
      })
      .where("start_date", "<=", date)
      .where("end_date", ">=", date)
      .orderBy("position");

    return {
      enabled: true,
      lots,
    };
  }

  static async findPayment(eventId: string, userId: string) {
    await assertOwnedEvent(eventId, userId);

    const [settingsData, lots] = await Promise.all([
      db("event_payment_settings").where({ event_id: eventId }).first(),

      db("event_payment_lots")
        .where({ event_id: eventId })
        .orderBy("position")
        .orderBy("start_date"),
    ]);

    const settings = settingsData ?? {
      event_id: eventId,
      enabled: false,
      due_days: 1,
    };

    return {
      settings,
      lots,
    };
  }
}
