import { db } from "../config/database.js";
import { AppError } from "../utils/app-error.js";

export class PublicEventService {
  static async findById(eventId: string) {
    const event = await db("events").where({ id: eventId }).first();

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    const result = await db.raw("SELECT CURRENT_DATE::text AS today");

    const today = result.rows[0].today as string;

    // Evento encerrado anteriormente.
    if (event.status === "ended") {
      return {
        status: "ended" as const,
        name: event.name,
      };
    }

    // Evento publicado cujo prazo já terminou.
    if (
      event.status === "published" &&
      event.end_date &&
      event.end_date < today
    ) {
      await db("events").where({ id: eventId }).update({
        status: "ended",
        updated_at: db.fn.now(),
      });

      return {
        status: "ended" as const,
        name: event.name,
      };
    }

    // Rascunhos e eventos fora do período não ficam públicos.
    if (
      event.status !== "published" ||
      !event.start_date ||
      !event.end_date ||
      event.start_date > today ||
      event.end_date < today
    ) {
      throw new AppError("Evento não encontrado ou indisponível.", 404);
    }

    const settings = await db("event_payment_settings")
      .where({ event_id: eventId })
      .first();

    const lots = settings?.enabled
      ? await db("event_payment_lots")
          .where({
            event_id: eventId,
            active: true,
          })
          .where("start_date", "<=", today)
          .where("end_date", ">=", today)
          .orderBy("position")
          .select(
            "id",
            "name",
            "value",
            "start_date",
            "end_date",
            "capacity",
            "billing_types",
            "max_installments",
          )
      : [];

    return {
      ...event,
      payment: {
        enabled: Boolean(settings?.enabled),
        lots,
      },
    };
  }
}
