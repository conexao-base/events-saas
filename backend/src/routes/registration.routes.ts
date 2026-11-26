import { Router } from "express";
import { RegistrationController } from "../controllers/registration.controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const routes = Router();

routes.post("/:eventId", RegistrationController.create);
routes.post(
  "/admin/:eventId",
  requireAuth,
  RegistrationController.createByAdmin,
);
routes.get(
  "/event/:eventId",
  requireAuth,
  RegistrationController.findAllByEvent,
);
routes.get("/", requireAuth, RegistrationController.findAll);
routes.put("/:registrationId", requireAuth, RegistrationController.update);
routes.patch(
  "/:registrationId/status",
  requireAuth,
  RegistrationController.updateStatus,
);
routes.delete("/:registrationId", requireAuth, RegistrationController.delete);

export { routes as registrationRoutes };
