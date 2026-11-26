import type { NextFunction, Request, Response } from "express";
import {
  eventSchema,
  updateEventStatusSchema,
} from "../schemas/event.schema.js";
import { EventService } from "../services/event.service.js";

export class EventController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = eventSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Dados do evento inválidos.",
          errors: parsed.error.flatten(),
        });
        return;
      }
      const event = await EventService.create(req.auth!.userId, parsed.data);
      res.status(201).json({ event });
    } catch (error) {
      next(error);
    }
  }
  static async index(req: Request, res: Response, next: NextFunction) {
    try {
      res
        .status(200)
        .json({ events: await EventService.findAllByUser(req.auth!.userId) });
    } catch (error) {
      next(error);
    }
  }
  static async show(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        event: await EventService.findById(req.auth!.userId, req.params.id!),
      });
    } catch (error) {
      next(error);
    }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = eventSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Dados do evento inválidos.",
          errors: parsed.error.flatten(),
        });
        return;
      }
      res.status(200).json({
        event: await EventService.update(
          req.auth!.userId,
          req.params.id!,
          parsed.data,
        ),
      });
    } catch (error) {
      next(error);
    }
  }
  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateEventStatusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Status inválido.",
          errors: parsed.error.flatten(),
        });
        return;
      }
      res.status(200).json({
        event: await EventService.updateStatus(
          req.auth!.userId,
          req.params.id!,
          parsed.data,
        ),
      });
    } catch (error) {
      next(error);
    }
  }
  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await EventService.remove(req.auth!.userId, req.params.id!);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
