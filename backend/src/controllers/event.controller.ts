import type { NextFunction, Request, Response } from "express";
import {
  eventSchema,
  updateEventStatusSchema,
} from "../../../shared/schemas/event.schema.js";
import { EventService } from "../services/event.service.js";

export class EventController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const validation = eventSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "Dados do evento inválidos.",
          errors: validation.error.flatten(),
        });
        return;
      }

      const event = await EventService.create(userId, validation.data);

      res.status(201).json({ event });
    } catch (error) {
      next(error);
    }
  }

  static async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const events = await EventService.findAllByUser(userId);

      res.status(200).json({ events });
    } catch (error) {
      next(error);
    }
  }

  static async show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const eventId = req.params.id!;

      const event = await EventService.findById(userId, eventId);

      res.status(200).json({ event });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const eventId = req.params.id!;
      const validation = eventSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "Dados do evento inválidos.",
          errors: validation.error.flatten(),
        });
        return;
      }

      const event = await EventService.update(userId, eventId, validation.data);

      res.status(200).json({ event });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const eventId = req.params.id!;
      const validation = updateEventStatusSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          message: "Status inválido.",
          errors: validation.error.flatten(),
        });
        return;
      }

      const event = await EventService.updateStatus(
        userId,
        eventId,
        validation.data,
      );

      res.status(200).json({ event });
    } catch (error) {
      next(error);
    }
  }

  static async remove(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const eventId = req.params.id!;

      await EventService.remove(userId, eventId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
