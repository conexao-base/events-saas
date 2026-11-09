export type RegistrationFieldType =
  | "text"
  | "email"
  | "phone"
  | "cpf"
  | "city"
  | "select";

export type RegistrationField = {
  id: string;
  label: string;
  type: RegistrationFieldType;
  required: boolean;
  options?: string[];
};

export type EventAppearance = {
  primaryColor: string;
  coverImage: string;
  logo: string;
};

export type CreateEventData = {
  info: {
    name: string;
    description?: string;
    location?: string;
    price: number | null;
    startDate?: string;
    endDate?: string;
  };
  registration: {
    fields: RegistrationField[];
  };
  appearance: EventAppearance;
};

export type EventRecord = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_fields: RegistrationField[];
  appearance: EventAppearance;
  status: "draft" | "published";
  price: string | null;
  created_at: Date;
  updated_at: Date;
};
