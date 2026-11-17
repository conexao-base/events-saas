import { db } from "../config/database.js";
import { EventModel } from "../models/event.model.js";
import { AsaasCustomerService } from "../services/asaas/asaas-customer.service.js";
import { RegistrationModel } from "../services/registration.service.js";

import type {
  RegistrationData,
  RegistrationRecord,
  RegistrationStatus,
  RegistrationWithEvent,
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
  private static validateData(
    data: RegistrationData,
    fields: RegistrationField[],
  ) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new RegistrationServiceError("Dados da inscrição inválidos.", 400);
    }

    const allowedFields = new Set(fields.map((field) => field.id));

    for (const field of fields) {
      const value = data[field.id];

      if (
        field.required &&
        (value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === ""))
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
  }

  private static async validateUniqueData(
    eventId: string,
    data: RegistrationData,
    fields: RegistrationField[],
    excludeId?: string,
  ): Promise<void> {
    const emailField = fields.find((field) => field.type === "email");
    const cpfField = fields.find((field) => field.type === "cpf");

    const email = emailField
      ? String(data[emailField.id] ?? "")
          .trim()
          .toLowerCase()
      : "";

    const cpf = cpfField
      ? String(data[cpfField.id] ?? "").replace(/\D/g, "")
      : "";

    const hasDuplicate = await RegistrationModel.hasDuplicate(
      eventId,
      emailField?.id,
      email,
      cpfField?.id,
      cpf,
      excludeId,
    );

    if (hasDuplicate) {
      throw new RegistrationServiceError(
        "Já existe uma inscrição neste evento com esse e-mail ou CPF.",
        409,
      );
    }
  }

  static async create(
    eventId: string,
    data: RegistrationData,
  ): Promise<RegistrationWithEvent> {
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

    const fields = event.registration_fields as RegistrationField[];

    this.validateData(data, fields);
    await this.validateUniqueData(eventId, data, fields);

    const originalPrice = event.price == null ? "0" : String(event.price);

    const registration = await RegistrationModel.create(
      eventId,
      data,
      originalPrice,
      originalPrice,
    );

    registration.asaas_customer_id = await AsaasCustomerService.ensureCustomer(
      registration.id,
    );

    return registration;
  }
  
  static async createByAdmin(
    eventId: string,
    userId: string,
    data: RegistrationData,
    price: string,
    status: RegistrationStatus,
  ): Promise<RegistrationWithEvent> {
    const event = await EventModel.findByIdAndUser(eventId, userId);

    if (!event) {
      throw new RegistrationServiceError("Evento não encontrado.", 404);
    }

    const fields = event.registration_fields as RegistrationField[];

    this.validateData(data, fields);
    await this.validateUniqueData(eventId, data, fields);

    const originalPrice = event.price == null ? "0" : String(event.price);

    const registration = await RegistrationModel.create(
      eventId,
      data,
      originalPrice,
      price,
      status,
    );

    if (status === "confirmed") {
      registration.asaas_customer_id =
        await AsaasCustomerService.ensureCustomer(registration.id);
    }

    return registration;
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

  static async findAll(userId: string): Promise<RegistrationWithEvent[]> {
    return db("registrations")
      .join("events", "registrations.event_id", "events.id")
      .where("events.user_id", userId)
      .select("registrations.*", "events.name as event_name")
      .orderBy("registrations.created_at", "desc");
  }

  static async update(
    registrationId: string,
    userId: string,
    data: RegistrationData,
    price: string,
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

    const fields = event.registration_fields as RegistrationField[];

    this.validateData(data, fields);

    await this.validateUniqueData(
      registration.event_id,
      data,
      fields,
      registrationId,
    );

    const updated = await RegistrationModel.update(
      registrationId,
      data,
      price,
      status,
    );

    if (!updated) {
      throw new RegistrationServiceError(
        "Não foi possível atualizar a inscrição.",
        500,
      );
    }

    if (status === "confirmed") {
      updated.asaas_customer_id =
        await AsaasCustomerService.ensureCustomer(registrationId);
    }

    return updated;
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

    if (status === "confirmed") {
      updated.asaas_customer_id =
        await AsaasCustomerService.ensureCustomer(registrationId);
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
