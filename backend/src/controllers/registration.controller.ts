import type { NextFunction, Request, Response } from "express";
import { publicRegistrationSchema } from "../schemas/registration.schema.js";
import { RegistrationService } from "../services/registration.service.js";

const statuses = ["pending", "confirmed", "cancelled"] as const;
type Status = (typeof statuses)[number];

export const RegistrationController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = publicRegistrationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Dados da inscrição inválidos.",
          errors: parsed.error.flatten(),
        });
        return;
      }
      const result = await RegistrationService.createPublic(
        req.params.eventId!,
        parsed.data,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  async createByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, status = "pending" } = req.body as {
        data: Record<string, string | number | boolean | null>;
        status?: Status;
      };
      if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data) ||
        !statuses.includes(status)
      ) {
        res.status(400).json({ message: "Dados da inscrição inválidos." });
        return;
      }
      const registration = await RegistrationService.createByAdmin(
        req.params.eventId!,
        req.auth!.userId,
        data,
        status,
      );
      res.status(201).json({ registration });
    } catch (error) {
      next(error);
    }
  },
  async findAllByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        registrations: await RegistrationService.findAllByEvent(
          req.params.eventId!,
          req.auth!.userId,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        registrations: await RegistrationService.findAll(req.auth!.userId),
      });
    } catch (error) {
      next(error);
    }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as {
        data?: Record<string, string | number | boolean | null>;
        status?: Status;
      };
      if (
        !body.data ||
        typeof body.data !== "object" ||
        Array.isArray(body.data) ||
        !body.status ||
        !statuses.includes(body.status)
      ) {
        res.status(400).json({ message: "Dados da inscrição inválidos." });
        return;
      }
      const registration = await RegistrationService.update(
        req.params.registrationId!,
        req.auth!.userId,
        body.data,
        body.status,
      );
      res.json({ registration });
    } catch (error) {
      next(error);
    }
  },
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = (req.body as { status?: Status }).status;
      if (!status || !statuses.includes(status)) {
        res.status(400).json({ message: "Status inválido." });
        return;
      }
      const registration = await RegistrationService.updateStatus(
        req.params.registrationId!,
        req.auth!.userId,
        status,
      );
      res.json({ registration });
    } catch (error) {
      next(error);
    }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await RegistrationService.delete(
        req.params.registrationId!,
        req.auth!.userId,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
