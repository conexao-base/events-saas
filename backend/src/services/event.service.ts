import { db } from "../config/database.js";
import { EventModel } from "../models/event.model.js";
import type { EventInput } from "../schemas/event.schema.js";
import { updateEventStatusSchema } from "../schemas/event.schema.js";
import { AppError } from "../utils/app-error.js";

export class EventService {
  private static async closeExpiredEvents(userId?: string) {
    const query = db("events")
      .where("status", "published")
      .whereNotNull("end_date")
      .whereRaw("end_date < CURRENT_DATE");

    if (userId) {
      query.where("user_id", userId);
    }

    await query.update({
      status: "ended",
      updated_at: db.fn.now(),
    });
  }
  private static async isWithinPeriod(
    startDate?: string | Date | null,
    endDate?: string | Date | null,
  ) {
    if (!startDate || !endDate) return false;

    const result = await db.raw(
      `
      SELECT
        ?::date <= CURRENT_DATE
        AND ?::date >= CURRENT_DATE AS valid
    `,
      [startDate, endDate],
    );

    return result.rows[0].valid;
  }

  static create(userId: string, input: EventInput) {
    return EventModel.create(userId, input);
  }

  static async findAllByUser(userId: string) {
    await this.closeExpiredEvents(userId);
    return EventModel.findAllByUser(userId);
  }

  static async findById(userId: string, eventId: string) {
    await this.closeExpiredEvents(userId);

    const event = await EventModel.findByIdAndUser(eventId, userId);

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    return event;
  }

  static async update(userId: string, eventId: string, input: EventInput) {
    await this.closeExpiredEvents(userId);

    const currentEvent = await this.findById(userId, eventId);

    if (currentEvent.status === "published") {
      const isValid = await this.isWithinPeriod(
        input.info.startDate,
        input.info.endDate,
      );

      if (!isValid) {
        throw new AppError(
          "Um evento publicado precisa estar dentro do período de realização.",
          400,
        );
      }
    }

    const event = await EventModel.update(eventId, userId, input);

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    return event;
  }

  static async remove(userId: string, eventId: string) {
    await this.findById(userId, eventId);
    await EventModel.delete(eventId, userId);
  }

  static async updateStatus(userId: string, eventId: string, input: unknown) {
    await this.closeExpiredEvents(userId);

    const parsed = updateEventStatusSchema.safeParse(input);

    if (!parsed.success) {
      throw new AppError("Status do evento inválido.", 400);
    }

    const currentEvent = await EventModel.findByIdAndUser(eventId, userId);

    if (!currentEvent) {
      throw new AppError("Evento não encontrado.", 404);
    }

    if (parsed.data.status === "published") {
      const isValid = await this.isWithinPeriod(
        currentEvent.start_date,
        currentEvent.end_date,
      );

      if (!isValid) {
        throw new AppError(
          "O evento só pode ser publicado dentro do período definido. Verifique as datas inicial e final.",
          400,
        );
      }
    }

    const event = await EventModel.updateStatus(
      eventId,
      userId,
      parsed.data.status,
    );

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    return event;
  }
}
