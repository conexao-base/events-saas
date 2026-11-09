import type { NextFunction, Request, Response } from "express";
import { IBGEService } from "../services/ibge.service.js";

export class IBGEController {
  static async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = String(req.query.query ?? "");

      const cities = await IBGEService.searchCities(query);

      res.status(200).json({ cities });
    } catch (error) {
      next(error);
    }
  }
}
