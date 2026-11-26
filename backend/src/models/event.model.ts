import { db } from "../config/database.js";
import type { EventInput } from "../schemas/event.schema.js";

export class EventModel {
  static async create(userId: string, data: EventInput) {
    const [row] = await db("events")
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
      .returning("id");
    return this.findByIdAndUser(row.id, userId);
  }

  static async findAllByUser(userId: string) {
    return db("events")
      .select("events.*")
      .select(
        db.raw(
          "(SELECT COUNT(*)::integer FROM registrations WHERE registrations.event_id = events.id) AS registration_count",
        ),
      )
      .where("events.user_id", userId)
      .orderBy("events.created_at", "desc");
  }

  static async findByIdAndUser(eventId: string, userId: string) {
    return db("events")
      .select("events.*")
      .select(
        db.raw(
          "(SELECT COUNT(*)::integer FROM registrations WHERE registrations.event_id = events.id) AS registration_count",
        ),
      )
      .where({ "events.id": eventId, "events.user_id": userId })
      .first();
  }

  static async findPublicById(eventId: string) {
    return db("events").where({ id: eventId, status: "published" }).first();
  }

  static async update(eventId: string, userId: string, data: EventInput) {
    const changed = await db("events")
      .where({ id: eventId, user_id: userId })
      .update({
        name: data.info.name,
        description: data.info.description || null,
        location: data.info.location || null,
        start_date: data.info.startDate || null,
        end_date: data.info.endDate || null,
        registration_fields: JSON.stringify(data.registration.fields),
        appearance: JSON.stringify(data.appearance),
        updated_at: db.fn.now(),
      });
    return changed ? this.findByIdAndUser(eventId, userId) : undefined;
  }

  static async updateStatus(
    eventId: string,
    userId: string,
    status: "draft" | "published",
  ) {
    const changed = await db("events")
      .where({ id: eventId, user_id: userId })
      .update({ status, updated_at: db.fn.now() });
    return changed ? this.findByIdAndUser(eventId, userId) : undefined;
  }

  static async delete(eventId: string, userId: string): Promise<void> {
    await db("events").where({ id: eventId, user_id: userId }).delete();
  }
}
