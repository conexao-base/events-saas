import type { NextFunction, Request, Response } from "express";
import { EventPaymentService } from "../services/event-payment.service.js";

export const EventPaymentController = {
  async findSettings(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        settings: await EventPaymentService.findSettings(
          req.params.eventId!,
          req.auth!.userId,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        settings: await EventPaymentService.updateSettings(
          req.params.eventId!,
          req.auth!.userId,
          req.body,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async findRules(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        rules: await EventPaymentService.findRules(
          req.params.eventId!,
          req.auth!.userId,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({
        rule: await EventPaymentService.createRule(
          req.params.eventId!,
          req.auth!.userId,
          req.body,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async updateRule(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        rule: await EventPaymentService.updateRule(
          req.params.eventId!,
          req.auth!.userId,
          req.params.ruleId!,
          req.body,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      await EventPaymentService.deleteRule(
        req.params.eventId!,
        req.auth!.userId,
        req.params.ruleId!,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  async findLots(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        lots: await EventPaymentService.findLots(
          req.params.eventId!,
          req.auth!.userId,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async createLot(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(201).json({
        lot: await EventPaymentService.createLot(
          req.params.eventId!,
          req.auth!.userId,
          req.body,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async updateLot(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({
        lot: await EventPaymentService.updateLot(
          req.params.eventId!,
          req.auth!.userId,
          req.params.lotId!,
          req.body,
        ),
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteLot(req: Request, res: Response, next: NextFunction) {
    try {
      await EventPaymentService.deleteLot(
        req.params.eventId!,
        req.auth!.userId,
        req.params.lotId!,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async findPublicOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await EventPaymentService.findPublicPaymentOptions(
        req.params.eventId!,
      );

      res.json({ payment });
    } catch (error) {
      next(error);
    }
  },
};
