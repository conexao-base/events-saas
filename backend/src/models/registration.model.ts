import { db } from "../config/database.js";
import type {
  RegistrationData,
  RegistrationRecord,
  RegistrationStatus,
} from "../types/registration.types.js";

export class RegistrationModel {
  static async create(
    eventId: string,
    data: RegistrationData,
  ): Promise<RegistrationRecord> {
    const [registration] = await db("registrations")
      .insert({
        event_id: eventId,
        data: JSON.stringify(data),
      })
      .returning("*");

    return registration as RegistrationRecord;
  }

  static async findAllByEvent(eventId: string): Promise<RegistrationRecord[]> {
    return db<RegistrationRecord>("registrations")
      .where({ event_id: eventId })
      .orderBy("created_at", "desc");
  }

  static async findById(
    registrationId: string,
  ): Promise<RegistrationRecord | undefined> {
    return db<RegistrationRecord>("registrations")
      .where({ id: registrationId })
      .first();
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
