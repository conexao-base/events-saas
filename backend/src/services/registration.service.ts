import { db } from "../config/database.js";
import type {
  RegistrationData,
  RegistrationRecord,
  RegistrationStatus,
  RegistrationWithEvent,
} from "../types/registration.types.js";

export class RegistrationModel {
  static async create(
    eventId: string,
    data: RegistrationData,
    originalPrice: string,
    price: string,
    status: RegistrationStatus = "pending",
  ): Promise<RegistrationWithEvent> {
    const [registration] = await db("registrations")
      .insert({
        event_id: eventId,
        data: JSON.stringify(data),
        original_price: originalPrice,
        price,
        status,
      })
      .returning("*");

    const result = await db("registrations")
      .join("events", "registrations.event_id", "events.id")
      .where("registrations.id", registration.id)
      .select("registrations.*", "events.name as event_name")
      .first();

    return result as RegistrationWithEvent;
  }

  static async hasDuplicate(
    eventId: string,
    emailFieldId: string | undefined,
    email: string,
    cpfFieldId: string | undefined,
    cpf: string,
    excludeId?: string,
  ): Promise<boolean> {
    if ((!email || !emailFieldId) && (!cpf || !cpfFieldId)) {
      return false;
    }

    const query = db("registrations").where({
      event_id: eventId,
    });

    if (excludeId) {
      query.whereNot({ id: excludeId });
    }

    query.andWhere(function () {
      if (email && emailFieldId) {
        this.orWhereRaw("LOWER(BTRIM(data ->> ?)) = ?", [emailFieldId, email]);
      }

      if (cpf && cpfFieldId) {
        this.orWhereRaw("REGEXP_REPLACE(data ->> ?, '[^0-9]', '', 'g') = ?", [
          cpfFieldId,
          cpf,
        ]);
      }
    });

    const duplicate = await query.first("id");

    return Boolean(duplicate);
  }

  static async findAllByEvent(eventId: string): Promise<RegistrationRecord[]> {
    return db<RegistrationRecord>("registrations")
      .where({ event_id: eventId })
      .orderBy("created_at", "desc");
  }

  static async findAll(userId: string) {
    return db("registrations")
      .join("events", "registrations.event_id", "events.id")
      .where("events.user_id", userId)
      .select("registrations.*", "events.name as event_name")
      .orderBy("registrations.created_at", "desc");
  }

  static async findById(
    registrationId: string,
  ): Promise<RegistrationRecord | undefined> {
    return db<RegistrationRecord>("registrations")
      .where({ id: registrationId })
      .first();
  }

  static async update(
    registrationId: string,
    data: RegistrationData,
    price: string,
    status: RegistrationStatus,
  ): Promise<RegistrationRecord | undefined> {
    const [registration] = await db("registrations")
      .where({ id: registrationId })
      .update({
        data: JSON.stringify(data),
        price,
        status,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return registration as RegistrationRecord | undefined;
  }

  static async updateStatus(
    registrationId: string,
    status: RegistrationStatus,
  ): Promise<RegistrationRecord | undefined> {
    const [registration] = await db("registrations")
      .where({ id: registrationId })
      .update({
        status,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return registration as RegistrationRecord | undefined;
  }

  static async delete(registrationId: string): Promise<void> {
    await db("registrations").where({ id: registrationId }).delete();
  }
}
