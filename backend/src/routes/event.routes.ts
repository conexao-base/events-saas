import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const eventRoutes = Router();

eventRoutes.use(requireAuth);

eventRoutes.post("/", EventController.create);
eventRoutes.get("/", EventController.index);
eventRoutes.patch("/:id/status", EventController.updateStatus);
eventRoutes.get("/:id", EventController.show);
eventRoutes.put("/:id", EventController.update);
eventRoutes.delete("/:id", EventController.remove);

export { eventRoutes };