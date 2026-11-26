import { Router } from "express";
import { EventPaymentController } from "../controllers/event-payment-controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const router = Router();

// Rota pública
router.get(
  "/:eventId/public-payment-options",
  EventPaymentController.findPublicOptions,
);

// Rotas autenticadas
router.use(requireAuth);

// Consulta completa de pagamento
router.get("/:eventId/payment", EventPaymentController.findPayment);

// Configurações gerais
router.get("/:eventId/payment-settings", EventPaymentController.findSettings);
router.put("/:eventId/payment-settings", EventPaymentController.updateSettings);

// Lotes e condições de pagamento
router.get("/:eventId/payment-lots", EventPaymentController.findLots);
router.post("/:eventId/payment-lots", EventPaymentController.createLot);
router.put("/:eventId/payment-lots/:lotId", EventPaymentController.updateLot);
router.delete(
  "/:eventId/payment-lots/:lotId",
  EventPaymentController.deleteLot,
);

export default router;
