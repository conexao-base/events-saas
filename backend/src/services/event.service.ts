import { EventModel } from "../models/event.model.js";
import type { EventInput } from "../schemas/event.schema.js";
import { updateEventStatusSchema } from "../schemas/event.schema.js";
import { AppError } from "../utils/app-error.js";

export class EventService {
  static create(userId: string, input: EventInput) {
    return EventModel.create(userId, input);
  }
  static findAllByUser(userId: string) {
    return EventModel.findAllByUser(userId);
  }

  static async findById(userId: string, eventId: string) {
    const event = await EventModel.findByIdAndUser(eventId, userId);
    if (!event) throw new AppError("Evento não encontrado.", 404);
    return event;
  }

  static async update(userId: string, eventId: string, input: EventInput) {
    const event = await EventModel.update(eventId, userId, input);
    if (!event) throw new AppError("Evento não encontrado.", 404);
    return event;
  }

  static async remove(userId: string, eventId: string) {
    await this.findById(userId, eventId);
    await EventModel.delete(eventId, userId);
  }

  static async updateStatus(userId: string, eventId: string, input: unknown) {
    const parsed = updateEventStatusSchema.safeParse(input);
    if (!parsed.success) throw new AppError("Status do evento inválido.", 400);
    const event = await EventModel.updateStatus(
      eventId,
      userId,
      parsed.data.status,
    );
    if (!event) throw new AppError("Evento não encontrado.", 404);
    return event;
  }
}
