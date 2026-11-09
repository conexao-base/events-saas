import cors from "cors";
import express from "express";
import { swaggerUiMiddleware } from "./config/swagger-ui.js";
import { errorMiddleware } from "./middlwares/error.middleware.js";
import { routes } from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api-docs", ...swaggerUiMiddleware);

app.use("/api", routes);

app.use((_req, res) => {
  res.status(404).json({
    message: "Rota não encontrada.",
  });
});

app.use(errorMiddleware);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend rodando na porta ${PORT}`);
});

export { app };
