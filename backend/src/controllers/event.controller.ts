import type { NextFunction, Request, Response } from "express";
import { EventService } from "../services/event.service.js";

export class EventController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.auth!.userId;
      const event = await EventService.create(userId, req.body);

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
      const eventId = req.params.id;

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
      const eventId = req.params.id;

      const event = await EventService.update(userId, eventId, req.body);

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
      const eventId = req.params.id;

      const event = await EventService.updateStatus(userId, eventId, req.body);

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
      const eventId = req.params.id;

      await EventService.remove(userId, eventId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
