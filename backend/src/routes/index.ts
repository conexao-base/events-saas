import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { eventRoutes } from "./event.routes.js";

const routes = Router();

routes.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API funcionando.",
  });
});

routes.use("/auth", authRoutes);
routes.use("/events", eventRoutes);

export { routes };
