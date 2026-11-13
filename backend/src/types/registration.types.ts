export type RegistrationStatus = "pending" | "confirmed" | "cancelled";

export interface RegistrationData {
  [fieldId: string]: string | number | boolean | null;
}

export interface RegistrationRecord {
  id: string;
  event_id: string;
  data: RegistrationData;
  price: string;
  status: RegistrationStatus;
  created_at: Date;
  updated_at: Date;
}
