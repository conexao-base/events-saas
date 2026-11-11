import { Router } from "express";
import { RegistrationController } from "../controllers/registration.controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const registrationRoutes = Router();

// Inscrição pública
registrationRoutes.post("/:eventId", RegistrationController.create);

// Gerenciamento de inscrições
registrationRoutes.get(
  "/event/:eventId",
  requireAuth,
  RegistrationController.findAllByEvent,
);

registrationRoutes.patch(
  "/:registrationId/status",
  requireAuth,
  RegistrationController.updateStatus,
);

registrationRoutes.delete(
  "/:registrationId",
  requireAuth,
  RegistrationController.delete,
);

export { registrationRoutes };
