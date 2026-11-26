import { Router } from "express";
import { asaasWebhookRoutes } from "./asaas-webhook.routes.js";
import { authRoutes } from "./auth.routes.js";
import { eventRoutes } from "./event.routes.js";
import { ibgeRoutes } from "./ibge.routes.js";
import { publicEventRoutes } from "./public-event.js";
import { registrationRoutes } from "./registration.routes.js";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando.",
  });
});

routes.use("/auth", authRoutes);
routes.use("/webhooks/asaas", asaasWebhookRoutes);
routes.use("/events", eventRoutes);
routes.use("/public/events", publicEventRoutes);
routes.use("/ibge", ibgeRoutes);
routes.use("/registrations", registrationRoutes);

export { routes };
