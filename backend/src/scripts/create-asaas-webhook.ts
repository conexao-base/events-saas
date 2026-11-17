import { env } from "../config/env.js";
import { AsaasClient } from "../services/asaas/asaas.client.js";

const events = [
  "PAYMENT_CREATED",
  "PAYMENT_UPDATED",
  "PAYMENT_CONFIRMED",
  "PAYMENT_RECEIVED",
  "PAYMENT_OVERDUE",
  "PAYMENT_DELETED",
  "PAYMENT_RESTORED",
  "PAYMENT_REFUNDED",
  "PAYMENT_PARTIALLY_REFUNDED",
  "PAYMENT_RECEIVED_IN_CASH_UNDONE",
  "PAYMENT_CHARGEBACK_REQUESTED",
  "PAYMENT_CHARGEBACK_DISPUTE",
  "PAYMENT_AWAITING_CHARGEBACK_REVERSAL",
];

async function main() {
  const { ASAAS_WEBHOOK_URL, ASAAS_WEBHOOK_EMAIL, ASAAS_WEBHOOK_TOKEN } = env;

  if (!env.ASAAS_API_KEY) {
    throw new Error("Configure ASAAS_API_KEY no .env.");
  }

  if (!ASAAS_WEBHOOK_URL || !ASAAS_WEBHOOK_EMAIL || !ASAAS_WEBHOOK_TOKEN) {
    throw new Error(
      "Configure ASAAS_WEBHOOK_URL, ASAAS_WEBHOOK_EMAIL e ASAAS_WEBHOOK_TOKEN no .env.",
    );
  }

  if (
    ASAAS_WEBHOOK_TOKEN.length < 32 ||
    ASAAS_WEBHOOK_TOKEN.length > 255 ||
    /\s/.test(ASAAS_WEBHOOK_TOKEN)
  ) {
    throw new Error(
      "ASAAS_WEBHOOK_TOKEN precisa ter entre 32 e 255 caracteres e não pode conter espaços.",
    );
  }

  if (!ASAAS_WEBHOOK_URL.startsWith("https://")) {
    throw new Error("ASAAS_WEBHOOK_URL precisa ser uma URL pública HTTPS.");
  }

  const existingWebhooks = await AsaasClient.listWebhooks();
  const existing = existingWebhooks.find(
    (webhook) => webhook.url === ASAAS_WEBHOOK_URL,
  );

  if (existing) {
    console.log(`Webhook já cadastrado. ID: ${existing.id}`);
    console.log(`URL: ${existing.url}`);
    return;
  }

  const webhook = await AsaasClient.createWebhook({
    name: "Conexao - Pagamentos",
    url: ASAAS_WEBHOOK_URL,
    email: ASAAS_WEBHOOK_EMAIL,
    enabled: true,
    interrupted: false,
    apiVersion: 3,
    authToken: ASAAS_WEBHOOK_TOKEN,
    sendType: "SEQUENTIALLY",
    events,
  });

  console.log("Webhook criado com sucesso.");
  console.log(`ID: ${webhook.id}`);
  console.log(`URL: ${webhook.url}`);
  console.log("Guarde o ID retornado para gerenciamento futuro.");
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error ? error.message : "Falha ao cadastrar webhook.",
  );
  process.exitCode = 1;
});
