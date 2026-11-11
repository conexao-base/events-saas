import type { Knex } from "knex";

const seedEvent = {
  name: "Evento",
  description:
    "Um encontro para compartilhar experiências.",
  location: "Auditório",
  start_date: "2026-11-20",
  end_date: "2026-11-20",
  registration_fields: [
    {
      id: "full-name",
      label: "Nome completo",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "E-mail",
      type: "email",
      required: true,
    },
    {
      id: "phone",
      label: "Telefone",
      type: "phone",
      required: true,
    },
    {
      id: "cpf",
      label: "CPF",
      type: "cpf",
      required: true,
    },
    {
      id: "birth-date",
      label: "Data de nascimento",
      type: "date",
      required: false,
    },
    {
      id: "city",
      label: "Cidade",
      type: "city",
      required: true,
    },
  ],
  appearance: {
    primaryColor: "#245C43",
    coverImage: "",
    logo: "",
  },
  status: "published",
};

export async function seed(knex: Knex): Promise<void> {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error("SEED_ADMIN_EMAIL não foi configurado.");
  }

  const admin = await knex("users")
    .where({ email: adminEmail.toLowerCase() })
    .first("id");

  if (!admin) {
    throw new Error(
      "Administrador não encontrado. Execute primeiro o seeder de usuários.",
    );
  }

  const existingEvent = await knex("events")
    .where({
      user_id: admin.id,
      name: seedEvent.name,
    })
    .first("id");

  if (existingEvent) {
    return;
  }

  await knex("events").insert({
    ...seedEvent,
    user_id: admin.id,
    registration_fields: JSON.stringify(seedEvent.registration_fields),
    appearance: JSON.stringify(seedEvent.appearance),
  });
}
