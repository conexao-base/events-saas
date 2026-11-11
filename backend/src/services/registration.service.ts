import { EventModel } from "../models/event.model.js";
import { RegistrationModel } from "../models/registration.model.js";

import type {
  RegistrationData,
  RegistrationRecord,
  RegistrationStatus,
} from "../types/registration.types.js";

interface RegistrationField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: string[];
}

export class RegistrationServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "RegistrationServiceError";
  }
}

export class RegistrationService {
  static async create(
    eventId: string,
    data: RegistrationData,
  ): Promise<RegistrationRecord> {
    const event = await EventModel.findPublicById(eventId);

    if (!event) {
      throw new RegistrationServiceError("Evento não encontrado.", 404);
    }

    if (event.status !== "published") {
      throw new RegistrationServiceError(
        "Este evento não está disponível para inscrições.",
        400,
      );
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new RegistrationServiceError("Dados da inscrição inválidos.", 400);
    }

    const fields = event.registration_fields as RegistrationField[];

    const allowedFields = new Set(fields.map((field) => field.id));

    for (const field of fields) {
      const value = data[field.id];

      if (
        field.required &&
        (value === undefined || value === null || value === "")
      ) {
        throw new RegistrationServiceError(
          `O campo "${field.label}" é obrigatório.`,
          400,
        );
      }

      if (
        field.type === "select" &&
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !field.options?.includes(String(value))
      ) {
        throw new RegistrationServiceError(
          `Valor inválido para o campo "${field.label}".`,
          400,
        );
      }
    }

    const hasUnknownFields = Object.keys(data).some(
      (fieldId) => !allowedFields.has(fieldId),
    );

    if (hasUnknownFields) {
      throw new RegistrationServiceError(
        "A inscrição contém campos não permitidos.",
        400,
      );
    }

    return RegistrationModel.create(eventId, data);
  }

  static async findAllByEvent(
    eventId: string,
    userId: string,
  ): Promise<RegistrationRecord[]> {
    const event = await EventModel.findByIdAndUser(eventId, userId);

    if (!event) {
      throw new RegistrationServiceError("Evento não encontrado.", 404);
    }

    return RegistrationModel.findAllByEvent(eventId);
  }

  static async updateStatus(
    registrationId: string,
    userId: string,
    status: RegistrationStatus,
  ): Promise<RegistrationRecord> {
    const registration = await RegistrationModel.findById(registrationId);

    if (!registration) {
      throw new RegistrationServiceError("Inscrição não encontrada.", 404);
    }

    const event = await EventModel.findByIdAndUser(
      registration.event_id,
      userId,
    );

    if (!event) {
      throw new RegistrationServiceError("Evento não encontrado.", 404);
    }

    const updated = await RegistrationModel.updateStatus(
      registrationId,
      status,
    );

    if (!updated) {
      throw new RegistrationServiceError("Inscrição não encontrada.", 404);
    }

    return updated;
  }

  static async delete(registrationId: string, userId: string): Promise<void> {
    const registration = await RegistrationModel.findById(registrationId);

    if (!registration) {
      throw new RegistrationServiceError("Inscrição não encontrada.", 404);
    }

    const event = await EventModel.findByIdAndUser(
      registration.event_id,
      userId,
    );

    if (!event) {
      throw new RegistrationServiceError("Evento não encontrado.", 404);
    }

    await RegistrationModel.delete(registrationId);
  }
}
