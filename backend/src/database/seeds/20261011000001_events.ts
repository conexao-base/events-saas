import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();

  if (!adminEmail) {
    throw new Error("SEED_ADMIN_EMAIL não foi configurado.");
  }

  const admin = await knex("users").where({ email: adminEmail }).first("id");

  if (!admin) {
    throw new Error(
      "Administrador não encontrado. Execute primeiro o seed de usuários.",
    );
  }

  const exists = await knex("events")
    .where({
      user_id: admin.id,
      name: "Evento de demonstração",
    })
    .first("id");

  if (exists) return;

  await knex("events").insert({
    user_id: admin.id,
    name: "Evento de demonstração",
    description: "Um encontro para compartilhar experiências.",
    location: "Auditório",
    start_date: "2026-12-20",
    end_date: "2026-12-20",
    registration_fields: JSON.stringify([
      {
        id: "full-name",
        label: "Nome completo",
        type: "text",
        required: true,
      },
      { id: "email", label: "E-mail", type: "email", required: true },
      { id: "phone", label: "Telefone", type: "phone", required: true },
      { id: "cpf", label: "CPF", type: "cpf", required: true },
      {
        id: "birth-date",
        label: "Data de nascimento",
        type: "date",
        required: true,
      },
      { id: "city", label: "Cidade", type: "city", required: true },
    ]),
    appearance: JSON.stringify({
      primaryColor: "#245C43",
      coverImage: "",
      logo: "",
    }),
    status: "published",
  });
}
