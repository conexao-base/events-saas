import { db } from "../config/database.js";
import { AsaasClient } from "./asaas/asaas.client.js";

type WebhookPayload = { id: string; event: string; payment?: { id: string } };
const confirmedEvents = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);
const cancelledEvents = new Set(["PAYMENT_DELETED", "PAYMENT_REFUNDED"]);

export class PaymentService {
  static async processAsaasWebhook(payload: WebhookPayload): Promise<void> {
    if (!payload.id || !payload.event || !payload.payment?.id) return;
    const payment = await AsaasClient.findPayment(payload.payment.id);

    await db.transaction(async (trx) => {
      const registration = await trx("registrations")
        .where({ asaas_payment_id: payment.id })
        .first("id");
      const registrationId = registration?.id ?? payment.externalReference;
      if (!registrationId) return;

      const row = await trx("registrations")
        .where({ id: registrationId })
        .first("id");
      if (!row) return;

      const [inserted] = await trx("asaas_webhook_events")
        .insert({
          asaas_event_id: payload.id,
          event_type: payload.event,
        })
        .onConflict("asaas_event_id")
        .ignore()
        .returning("id");
      if (!inserted) return;

      const status = payment.status || payload.event;
      const registrationStatus = confirmedEvents.has(payload.event)
        ? "confirmed"
        : cancelledEvents.has(payload.event)
          ? "cancelled"
          : undefined;

      await trx("registrations")
        .where({ id: registrationId })
        .update({
          asaas_payment_id: payment.id,
          asaas_payment_status: status,
          asaas_payment_url: payment.invoiceUrl ?? null,
          payment_due_date: payment.dueDate ?? null,
          ...(registrationStatus ? { status: registrationStatus } : {}),
          payment_creation_status: "created",
          updated_at: trx.fn.now(),
        });
    });
  }
}
