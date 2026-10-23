import { EventModel } from "../models/event.model.js";
import { eventSchema } from "../schemas/event.schema.js";
import type { CreateEventData } from "../types/event.types.js";
import { AppError } from "../utils/app-error.js";

export class EventService {
  static async create(userId: string, input: unknown) {
    const result = eventSchema.safeParse(input);

    if (!result.success) {
      throw new AppError("Dados do evento inválidos.", 400);
    }

    const data: CreateEventData = result.data;

    return EventModel.create(userId, data);
  }

  static async findAllByUser(userId: string) {
    return EventModel.findAllByUser(userId);
  }

  static async findById(userId: string, eventId: string) {
    const event = await EventModel.findByIdAndUser(eventId, userId);

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    return event;
  }

  static async update(userId: string, eventId: string, input: unknown) {
    const result = eventSchema.safeParse(input);

    if (!result.success) {
      throw new AppError("Dados do evento inválidos.", 400);
    }

    const data: CreateEventData = result.data;

    const existingEvent = await EventModel.findByIdAndUser(eventId, userId);

    if (!existingEvent) {
      throw new AppError("Evento não encontrado.", 404);
    }

    const event = await EventModel.update(eventId, userId, data);

    if (!event) {
      throw new AppError("Não foi possível atualizar o evento.", 500);
    }

    return event;
  }
}
