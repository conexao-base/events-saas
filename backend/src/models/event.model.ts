import { db } from "../config/database.js";
import type { CreateEventData, EventRecord } from "../types/event.types.js";
import { parsePrice } from "../utils/pase-price.js";

function eventQuery() {
  return db<EventRecord>("events").select(
    "events.*",
    db.raw(`
      (
        SELECT COUNT(*)::integer
        FROM registrations
        WHERE registrations.event_id = events.id
      ) AS registration_count
    `),
  );
}

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
        price: parsePrice(data.info.price),
        registration_fields: JSON.stringify(data.registration.fields),
        appearance: JSON.stringify(data.appearance),
      })
      .returning("id");

    const createdEvent = await eventQuery()
      .where("events.id", event.id)
      .first();

    return createdEvent as EventRecord;
  }

  static async findAllByUser(userId: string): Promise<EventRecord[]> {
    return eventQuery()
      .where("events.user_id", userId)
      .orderBy("events.created_at", "desc");
  }

  static async findByIdAndUser(
    eventId: string,
    userId: string,
  ): Promise<EventRecord | undefined> {
    return eventQuery()
      .where("events.id", eventId)
      .andWhere("events.user_id", userId)
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
        price: parsePrice(data.info.price),
        registration_fields: JSON.stringify(data.registration.fields),
        appearance: JSON.stringify(data.appearance),
        updated_at: db.fn.now(),
      })
      .returning("id");

    if (!event) return undefined;

    return EventModel.findByIdAndUser(eventId, userId);
  }

  static async findPublicById(
    eventId: string,
  ): Promise<EventRecord | undefined> {
    return eventQuery().where("events.id", eventId).first();
  }

  static async delete(eventId: string, userId: string): Promise<void> {
    await db("events")
      .where({
        id: eventId,
        user_id: userId,
      })
      .delete();
  }

  static async updateStatus(
    eventId: string,
    userId: string,
    status: "draft" | "published",
  ): Promise<EventRecord | undefined> {
    const [event] = await db("events")
      .where({
        id: eventId,
        user_id: userId,
      })
      .update({
        status,
        updated_at: db.fn.now(),
      })
      .returning("id");

    if (!event) return undefined;

    return EventModel.findByIdAndUser(eventId, userId);
  }
}
