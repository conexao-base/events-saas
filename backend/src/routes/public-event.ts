import { Router } from "express";
import { PublicEventController } from "../controllers/public-controler.js";

const publicEventRoutes = Router();

publicEventRoutes.get("/:id", PublicEventController.show);

export { publicEventRoutes };
