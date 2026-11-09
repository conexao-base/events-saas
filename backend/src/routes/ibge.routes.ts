import { Router } from "express";
import { IBGEController } from "../controllers/ibge.controller.js";

const ibgeRoutes = Router();

ibgeRoutes.get("/cities", IBGEController.index);

export { ibgeRoutes };
