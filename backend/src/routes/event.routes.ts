import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const eventRoutes = Router();

eventRoutes.post("/", requireAuth, EventController.create);
eventRoutes.get("/", requireAuth, EventController.index);
eventRoutes.patch("/:id/status", requireAuth, EventController.updateStatus);
eventRoutes.get("/:id", requireAuth, EventController.show);
eventRoutes.put("/:id", requireAuth, EventController.update);
eventRoutes.delete("/:id", requireAuth, EventController.remove);

export { eventRoutes };
