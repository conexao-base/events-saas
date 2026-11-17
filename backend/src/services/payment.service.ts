import { db } from "../config/database.js";

type AsaasPaymentPayload = {
  id: string;
  customer?: string;
  externalReference?: string | null;
  status?: string;
  billingType?: string;
  dateCreated?: string | null;
  dueDate?: string | null;
  paymentDate?: string | null;
  clientPaymentDate?: string | null;
  value?: number | string;
  invoiceUrl?: string | null;
};

type AsaasWebhookPayload = {
  id: string;
  event: string;
  payment?: AsaasPaymentPayload;
};

const eventStatus: Record<string, string> = {
  PAYMENT_CREATED: "PENDING",
  PAYMENT_CONFIRMED: "CONFIRMED",
  PAYMENT_RECEIVED: "RECEIVED",
  PAYMENT_OVERDUE: "OVERDUE",
  PAYMENT_DELETED: "DELETED",
  PAYMENT_REFUNDED: "REFUNDED",
  PAYMENT_PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  PAYMENT_RESTORED: "PENDING",
  PAYMENT_RECEIVED_IN_CASH_UNDONE: "RECEIVED_IN_CASH_UNDONE",
  PAYMENT_CHARGEBACK_REQUESTED: "CHARGEBACK_REQUESTED",
  PAYMENT_CHARGEBACK_DISPUTE: "CHARGEBACK_DISPUTE",
  PAYMENT_AWAITING_CHARGEBACK_REVERSAL: "AWAITING_CHARGEBACK_REVERSAL",
};

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validDate(value?: string | null): string | null {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function validDateOnly(value?: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value;
}

export class PaymentService {
  static async processAsaasWebhook(payload: AsaasWebhookPayload): Promise<void> {
    const payment = payload.payment;

    if (!payload.id || !payload.event || !payment?.id) {
      return;
    }

    await db.transaction(async (trx) => {
      const existingPayment = await trx("registration_payments")
        .where({ asaas_payment_id: payment.id })
        .first("registration_id");

      const registrationId =
        existingPayment?.registration_id ??
        (payment.externalReference && uuidRegex.test(payment.externalReference)
          ? payment.externalReference
          : null);

      if (!registrationId) {
        // Evento de uma cobrança que não pertence a uma inscrição desta aplicação.
        return;
      }

      const [receivedEvent] = await trx("asaas_webhook_events")
        .insert({
          asaas_event_id: payload.id,
          event_type: payload.event,
        })
        .onConflict("asaas_event_id")
        .ignore()
        .returning("asaas_event_id");

      if (!receivedEvent) {
        return;
      }

      const registration = await trx("registrations")
        .where({ id: registrationId })
        .first("id");

      if (!registration) {
        // A inscrição pode ter sido excluída depois da criação da cobrança.
        // Registra o evento e responde 2xx para não gerar retentativas inúteis.
        return;
      }

      const status =
        payment.status || eventStatus[payload.event] || payload.event;

      await trx("registration_payments")
        .insert({
          registration_id: registrationId,
          asaas_payment_id: payment.id,
          status,
          payment_method: payment.billingType ?? null,
          billing_date: validDate(payment.dateCreated),
          due_date: validDateOnly(payment.dueDate),
          paid_at:
            validDate(payment.clientPaymentDate) ??
            validDate(payment.paymentDate),
          value: Number(payment.value ?? 0),
          payment_url: payment.invoiceUrl ?? null,
        })
        .onConflict("asaas_payment_id")
        .merge({
          status,
          payment_method: payment.billingType ?? null,
          billing_date: validDate(payment.dateCreated),
          due_date: validDateOnly(payment.dueDate),
          paid_at:
            validDate(payment.clientPaymentDate) ??
            validDate(payment.paymentDate),
          value: Number(payment.value ?? 0),
          payment_url: payment.invoiceUrl ?? null,
          updated_at: trx.fn.now(),
        });
    });
  }
}
