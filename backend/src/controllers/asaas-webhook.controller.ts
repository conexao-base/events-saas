import { timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { PaymentService } from "../services/payment.service.js";

function isValidToken(receivedToken: string | undefined): boolean {
  const expectedToken = env.ASAAS_WEBHOOK_TOKEN;

  if (!expectedToken || !receivedToken) return false;

  const received = Buffer.from(receivedToken);
  const expected = Buffer.from(expectedToken);

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}

export const AsaasWebhookController = {
  async receive(req: Request, res: Response): Promise<void> {
    if (!isValidToken(req.header("asaas-access-token"))) {
      res.status(401).json({ message: "Token de webhook inválido." });
      return;
    }

    try {
      await PaymentService.processAsaasWebhook(req.body);

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Erro ao processar webhook do Asaas:", error);

      // Resposta não-2xx para permitir nova tentativa de entrega pelo Asaas.
      res.status(500).json({ message: "Não foi possível processar o webhook." });
    }
  },
};
