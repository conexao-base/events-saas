import { db } from "../config/database.js";
import { AppError } from "../utils/app-error.js";

export class PublicEventService {
  static async findById(eventId: string) {
    const event = await db("events")
      .where({ id: eventId, status: "published" })
      .first();
    if (!event)
      throw new AppError("Evento não encontrado ou indisponível.", 404);
    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first();
    const date = new Date().toISOString().slice(0, 10);
    const [lots, rules] = await Promise.all([
      db("event_payment_lots")
        .where({ event_id: eventId, active: true })
        .where("start_date", "<=", date)
        .where("end_date", ">=", date)
        .orderBy("position")
        .select("id", "name", "value", "start_date", "end_date", "capacity"),
      settings?.enabled
        ? db("event_payment_rules")
            .where({ settings_id: settings.id, active: true })
            .where("start_date", "<=", date)
            .where("end_date", ">=", date)
            .orderBy("position")
            .select(
              "id",
              "name",
              "start_date",
              "end_date",
              "billing_types",
              "max_installments",
            )
        : Promise.resolve([]),
    ]);
    return {
      ...event,
      payment: {
        enabled: Boolean(settings?.enabled),
        lots,
        rules,
      },
    };
  }
}
