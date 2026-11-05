import type { NextFunction, Request, Response } from "express";
import { PublicEventService } from "../services/public-event.service.js";

export class PublicEventController {
  static async show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const eventId = req.params.id;

      const event = await PublicEventService.findById(eventId);

      res.status(200).json({ event });
    } catch (error) {
      next(error);
    }
  }
}
