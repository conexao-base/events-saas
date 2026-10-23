import type { Knex } from "knex";

const seedEvent = {
  name: "Retiro Renovados",
  description:
    "Um tempo de comunhão, aprendizado e renovação espiritual. Participe de momentos de louvor, reflexão e comunhão.",
  location: "Sítio Recanto da Paz — Ponte Nova, MG",
  start_date: "2026-11-20",
  end_date: "2026-11-22",
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
      id: "birth-date",
      label: "Data de nascimento",
      type: "date",
      required: false,
    },
    {
      id: "shirt-size",
      label: "Tamanho da camiseta",
      type: "select",
      required: false,
      options: ["PP", "P", "M", "G", "GG", "XG"],
    },
  ],
  appearance: {
    primaryColor: "#245C43",
    coverImage:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1600&q=85",
    logo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=256&q=85",
  },
  status: "draft",
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
