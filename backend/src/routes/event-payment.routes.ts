import { Router } from "express";
import { EventPaymentController } from "../controllers/event-payment-controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const router = Router();

// Rota pública: consulta as condições de pagamento do evento
router.get(
  "/:eventId/public-payment-options",
  EventPaymentController.findPublicOptions,
);

// A partir daqui, todas as rotas exigem autenticação
router.use(requireAuth);

router.get("/:eventId/payment-settings", EventPaymentController.findSettings);
router.put("/:eventId/payment-settings", EventPaymentController.updateSettings);
router.get("/:eventId/payment-rules", EventPaymentController.findRules);
router.post("/:eventId/payment-rules", EventPaymentController.createRule);

router.put(
  "/:eventId/payment-rules/:ruleId",
  EventPaymentController.updateRule,
);

router.delete(
  "/:eventId/payment-rules/:ruleId",
  EventPaymentController.deleteRule,
);

router.get("/:eventId/payment-lots", EventPaymentController.findLots);
router.post("/:eventId/payment-lots", EventPaymentController.createLot);

router.put("/:eventId/payment-lots/:lotId", EventPaymentController.updateLot);

router.delete(
  "/:eventId/payment-lots/:lotId",
  EventPaymentController.deleteLot,
);

export default router;
