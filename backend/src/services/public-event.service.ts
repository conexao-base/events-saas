import { EventModel } from "../models/event.model.js";
import { AppError } from "../utils/app-error.js";

export class PublicEventService {
  static async findById(eventId: string) {
    const event = await EventModel.findPublicById(eventId);

    if (!event) {
      throw new AppError("Evento não encontrado ou indisponível.", 404);
    }

    return event;
  }
}
