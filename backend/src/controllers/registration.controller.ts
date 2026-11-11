import type { NextFunction, Request, Response } from "express";

import {
  RegistrationService,
  RegistrationServiceError,
} from "../services/registration.service.js";

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
