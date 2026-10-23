import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { requireAuth } from "../middlwares/auth.middleware.js";

const eventRoutes = Router();

eventRoutes.use(requireAuth);

eventRoutes.post("/", EventController.create);
eventRoutes.get("/", EventController.index);
eventRoutes.get("/:id", EventController.show);
eventRoutes.put("/:id", EventController.update);

export { eventRoutes };
