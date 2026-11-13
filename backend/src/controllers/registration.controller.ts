import type { NextFunction, Request, Response } from "express";

import {
  RegistrationService,
  RegistrationServiceError,
} from "../models/registration.model.js";
import type {
  RegistrationData,
  RegistrationStatus,
} from "../types/registration.types.js";

export const RegistrationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { data } = req.body as { data: RegistrationData };

      const registration = await RegistrationService.create(eventId, data);

      res.status(201).json({ registration });
    } catch (error) {
      next(error);
    }
  },

  async createByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const { eventId } = req.params;
      const { data, price, status } = req.body as {
        data: RegistrationData;
        price?: string;
        status: RegistrationStatus;
      };

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new RegistrationServiceError(
          "Dados da inscrição inválidos.",
          400,
        );
      }

      if (
        price !== undefined &&
        (typeof price !== "string" ||
          !/^\d+(\.\d{1,2})?$/.test(price) ||
          Number(price) < 0)
      ) {
        throw new RegistrationServiceError("Valor da inscrição inválido.", 400);
      }

      const allowedStatuses: RegistrationStatus[] = [
        "pending",
        "confirmed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        throw new RegistrationServiceError(
          "Status de inscrição inválido.",
          400,
        );
      }

      const registration = await RegistrationService.createByAdmin(
        eventId,
        req.auth.userId,
        data,
        price,
        status,
      );

      res.status(201).json({ registration });
    } catch (error) {
      next(error);
    }
  },

  async findAllByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const { eventId } = req.params;

      const registrations = await RegistrationService.findAllByEvent(
        eventId,
        req.auth.userId,
      );

      res.status(200).json({ registrations });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const { registrationId } = req.params;
      const { status } = req.body as { status: RegistrationStatus };

      const allowedStatuses: RegistrationStatus[] = [
        "pending",
        "confirmed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        throw new RegistrationServiceError(
          "Status de inscrição inválido.",
          400,
        );
      }

      const registration = await RegistrationService.updateStatus(
        registrationId,
        req.auth.userId,
        status,
      );

      res.status(200).json({ registration });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const { registrationId } = req.params;
      const { data, price, status } = req.body as {
        data: RegistrationData;
        price: string;
        status: RegistrationStatus;
      };

      const allowedStatuses: RegistrationStatus[] = [
        "pending",
        "confirmed",
        "cancelled",
      ];

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new RegistrationServiceError(
          "Dados da inscrição inválidos.",
          400,
        );
      }

      if (
        typeof price !== "string" ||
        !/^\d+(\.\d{1,2})?$/.test(price) ||
        Number(price) < 0
      ) {
        throw new RegistrationServiceError("Valor da inscrição inválido.", 400);
      }

      if (!allowedStatuses.includes(status)) {
        throw new RegistrationServiceError(
          "Status de inscrição inválido.",
          400,
        );
      }

      const registration = await RegistrationService.update(
        registrationId,
        req.auth.userId,
        data,
        price,
        status,
      );

      res.status(200).json({ registration });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth) {
        res.status(401).json({ message: "Não autenticado." });
        return;
      }

      const { registrationId } = req.params;

      await RegistrationService.delete(registrationId, req.auth.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
