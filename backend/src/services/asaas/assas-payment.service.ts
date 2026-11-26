import { db } from "../../config/database.js";
import { AppError } from "../../utils/app-error.js";
import { AsaasClient, type AsaasBillingType } from "./asaas.client.js";

type CreateRegistrationPaymentInput = {
  registrationId: string;
  billingType: AsaasBillingType;
  installmentCount?: number;
};

type RegistrationPaymentContext = {
  id: string;
  event_id: string;
  event_name: string;
  asaas_customer_id: string | null;
  payment_amount: string;
  due_days: number;
  max_installments: number;
  billing_types: AsaasBillingType[];
  enabled: boolean;
};

function getDueDate(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export class AsaasPaymentService {
  static async createForRegistration(input: CreateRegistrationPaymentInput) {
    const registration = await db.transaction(async (trx) => {
      await trx.raw("SELECT pg_advisory_xact_lock(hashtextextended(?, 0))", [
        input.registrationId,
      ]);

      const context = (await trx("registrations as r")
        .join("events as e", "r.event_id", "e.id")
        .join("event_payment_settings as s", "s.event_id", "e.id")
        .join("event_payment_rules as pr", "pr.id", "r.payment_rule_id")
        .where("r.id", input.registrationId)
        .select(
          "r.id",
          "r.event_id",
          "r.payment_amount",
          "r.asaas_customer_id",
          "e.name as event_name",
          "s.enabled",
          "s.due_days",
          "pr.max_installments",
          "pr.billing_types",
        )
        .first()) as RegistrationPaymentContext | undefined;

      if (!context) {
        throw new AppError("Inscrição não encontrada.", 404);
      }

      if (!context.enabled) {
        throw new AppError(
          "Os pagamentos deste evento não estão habilitados.",
          400,
        );
      }

      if (!context.asaas_customer_id) {
        throw new AppError(
          "A inscrição ainda não possui cliente no Asaas.",
          422,
        );
      }

      const allowedBillingTypes = context.billing_types ?? [];

      if (!allowedBillingTypes.includes(input.billingType)) {
        throw new AppError(
          "Esta forma de pagamento não está disponível para o evento.",
          400,
        );
      }

      const value = Number(context.payment_amount);

      if (!Number.isFinite(value) || value <= 0) {
        throw new AppError("Valor da inscrição inválido.", 400);
      }

      const installmentCount = input.installmentCount ?? 1;
      const maxInstallments = Number(context.max_installments ?? 1);

      if (
        !Number.isInteger(installmentCount) ||
        installmentCount < 1 ||
        installmentCount > maxInstallments
      ) {
        throw new AppError(
          `A quantidade de parcelas deve estar entre 1 e ${maxInstallments}.`,
          400,
        );
      }

      if (input.billingType !== "CREDIT_CARD" && installmentCount > 1) {
        throw new AppError(
          "O parcelamento está disponível somente para cartão de crédito.",
          400,
        );
      }

      const existingPayment = await trx("registration_payments")
        .where({ registration_id: context.id })
        .whereNotIn("status", ["DELETED", "REFUNDED", "CANCELLED"])
        .orderBy("created_at", "desc")
        .first();

      return {
        context,
        value,
        installmentCount,
        existingPayment,
      };
    });

    if (registration.existingPayment) {
      const payment = registration.existingPayment;

      return {
        id: payment.asaas_payment_id,
        status: payment.status,
        value: payment.value,
        paymentUrl: payment.payment_url,
        dueDate: payment.due_date,
        alreadyExists: true,
      };
    }

    const { context, value, installmentCount } = registration;
    const dueDate = getDueDate(context.due_days);

    const paymentInput =
      input.billingType === "CREDIT_CARD" && installmentCount > 1
        ? {
            customer: context.asaas_customer_id!,
            billingType: input.billingType,
            installmentCount,
            totalValue: value,
            dueDate,
            description: `Inscrição - ${context.event_name}`,
            externalReference: context.id,
          }
        : {
            customer: context.asaas_customer_id!,
            billingType: input.billingType,
            value,
            dueDate,
            description: `Inscrição - ${context.event_name}`,
            externalReference: context.id,
          };

    const payment = await AsaasClient.createPayment(paymentInput);

    await db("registration_payments").insert({
      registration_id: context.id,
      asaas_payment_id: payment.id,
      asaas_installment_id: payment.installment ?? null,
      installment_count: installmentCount > 1 ? installmentCount : null,
      status: payment.status,
      payment_method: payment.billingType,
      billing_date: payment.dateCreated
        ? new Date(payment.dateCreated)
        : db.fn.now(),
      due_date: payment.dueDate ?? dueDate,
      paid_at: payment.paymentDate ? new Date(payment.paymentDate) : null,
      value: payment.value,
      payment_url: payment.invoiceUrl ?? null,
    });

    return {
      id: payment.id,
      status: payment.status,
      value: payment.value,
      paymentUrl: payment.invoiceUrl ?? null,
      dueDate: payment.dueDate ?? dueDate,
      alreadyExists: false,
    };
  }
}
