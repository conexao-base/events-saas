import { Router } from "express";
import { AsaasWebhookController } from "../controllers/asaas-webhook.controller.js";

const asaasWebhookRoutes = Router();

asaasWebhookRoutes.post("/", AsaasWebhookController.receive);

export { asaasWebhookRoutes };
