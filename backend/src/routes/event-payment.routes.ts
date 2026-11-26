import { Router } from "express";
import { EventPaymentController } from "../controllers/event-payment-controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const eventPaymentRoutes = Router();

// Rota pública
eventPaymentRoutes.get(
  "/:eventId/public-payment-options",
  EventPaymentController.findPublicOptions,
);

// Rotas autenticadas
eventPaymentRoutes.use(requireAuth);

eventPaymentRoutes.get("/:eventId/payment", EventPaymentController.findPayment);

eventPaymentRoutes.get(
  "/:eventId/payment-settings",
  EventPaymentController.findSettings,
);

eventPaymentRoutes.put(
  "/:eventId/payment-settings",
  EventPaymentController.updateSettings,
);

eventPaymentRoutes.get(
  "/:eventId/payment-lots",
  EventPaymentController.findLots,
);

eventPaymentRoutes.post(
  "/:eventId/payment-lots",
  EventPaymentController.createLot,
);

eventPaymentRoutes.put(
  "/:eventId/payment-lots/:lotId",
  EventPaymentController.updateLot,
);

eventPaymentRoutes.delete(
  "/:eventId/payment-lots/:lotId",
  EventPaymentController.deleteLot,
);

export { eventPaymentRoutes };
