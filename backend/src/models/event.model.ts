import { db } from "../config/database.js";
import type { CreateEventData, EventRecord } from "../types/event.types.js";

export class EventModel {
  static async create(
    userId: string,
    data: CreateEventData,
  ): Promise<EventRecord> {
    const [event] = await db("events")
      .insert({
        user_id: userId,
        name: data.info.name,
        description: data.info.description || null,
        location: data.info.location || null,
        start_date: data.info.startDate || null,
        end_date: data.info.endDate || null,
        registration_fields: JSON.stringify(data.registration.fields),
        appearance: JSON.stringify(data.appearance),
      })
      .returning("*");

    return event as EventRecord;
  }

  static async findAllByUser(userId: string): Promise<EventRecord[]> {
    return db<EventRecord>("events")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
  }

  static async findByIdAndUser(
    eventId: string,
    userId: string,
  ): Promise<EventRecord | undefined> {
    return db<EventRecord>("events")
      .where({
        id: eventId,
        user_id: userId,
      })
      .first();
  }

  static async update(
    eventId: string,
    userId: string,
    data: CreateEventData,
  ): Promise<EventRecord | undefined> {
    const [event] = await db("events")
      .where({
        id: eventId,
        user_id: userId,
      })
      .update({
        name: data.info.name,
        description: data.info.description || null,
        location: data.info.location || null,
        start_date: data.info.startDate || null,
        end_date: data.info.endDate || null,
        registration_fields: JSON.stringify(data.registration.fields),
        appearance: JSON.stringify(data.appearance),
        updated_at: db.fn.now(),
      })
      .returning("*");

    return event as EventRecord | undefined;
  }

  static async findPublicById(
    eventId: string,
  ): Promise<EventRecord | undefined> {
    return db<EventRecord>("events").where({ id: eventId }).first();
  }
}
