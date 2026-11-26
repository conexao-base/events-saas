export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

export interface RegistrationData {
  [fieldId: string]: string | number | boolean | null;
}

export interface RegistrationRecord {
  id: string;
  event_id: string;
  data: RegistrationData;
  original_price: string;
  price: string;
  status: RegistrationStatus;
  asaas_customer_id?: string | null;
  payment_lot_id?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface RegistrationWithEvent extends RegistrationRecord {
  event_name: string;
}
