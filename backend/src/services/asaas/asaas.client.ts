import { env } from "../../config/env.js";
import { AppError } from "../../utils/app-error.js";

type AsaasCustomer = {
  id: string;
  name: string;
  cpfCnpj: string;
};

type AsaasCustomerList = {
  data: AsaasCustomer[];
};

type CreateCustomerInput = {
  name: string;
  cpfCnpj: string;
  email?: string;
  mobilePhone?: string;
  externalReference: string;
};

type CreateWebhookInput = {
  name: string;
  url: string;
  email: string;
  enabled: boolean;
  interrupted: boolean;
  apiVersion: number;
  authToken: string;
  sendType: "SEQUENTIALLY" | "NON_SEQUENTIALLY";
  events: string[];
};

export class AsaasClient {
  private static get apiKey(): string {
    if (!env.ASAAS_API_KEY) {
      throw new AppError("ASAAS_API_KEY não configurada.", 503);
    }

    return env.ASAAS_API_KEY;
  }

  private static get baseUrl(): string {
    return env.ASAAS_API_URL.replace(/\/+$/, "");
  }

  private static async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          access_token: this.apiKey,
          "User-Agent": "Conexao/1.0.0",
          ...init.headers,
        },
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new AppError(
        "Não foi possível estabelecer comunicação com o Asaas.",
        502,
      );
    }

    const responseBody = (await response.json().catch(() => null)) as
      | {
          errors?: Array<{ description?: string; code?: string }>;
        }
      | null
      | unknown;

    if (!response.ok) {
      const apiMessage =
        responseBody &&
        typeof responseBody === "object" &&
        "errors" in responseBody &&
        Array.isArray(responseBody.errors)
          ? responseBody.errors[0]?.description
          : undefined;

      throw new AppError(
        apiMessage || "O Asaas não conseguiu concluir a operação.",
        502,
      );
    }

    return responseBody as T;
  }

  static async findCustomerByCpf(cpfCnpj: string): Promise<AsaasCustomer | null> {
    const result = await this.request<AsaasCustomerList>(
      `/customers?cpfCnpj=${encodeURIComponent(cpfCnpj)}&limit=10`,
      { method: "GET" },
    );

    return result.data?.[0] ?? null;
  }

  static async createCustomer(
    input: CreateCustomerInput,
  ): Promise<AsaasCustomer> {
    return this.request<AsaasCustomer>("/customers", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  static async listWebhooks(): Promise<Array<{ id: string; url: string; name: string }>> {
    const result = await this.request<{
      data: Array<{ id: string; url: string; name: string }>;
    }>("/webhooks", { method: "GET" });

    return result.data ?? [];
  }

  static async createWebhook(
    input: CreateWebhookInput,
  ): Promise<{ id: string; name: string; url: string }> {
    return this.request<{ id: string; name: string; url: string }>(
      "/webhooks",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
  }
}
