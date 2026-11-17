import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("registration_payments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table
      .uuid("registration_id")
      .notNullable()
      .references("id")
      .inTable("registrations")
      .onDelete("CASCADE");

    table.string("asaas_payment_id", 50).notNullable().unique();
    table.string("status", 50).notNullable();
    table.string("payment_method", 30).nullable();

    table.timestamp("billing_date", { useTz: true }).nullable();
    table.date("due_date").nullable();
    table.timestamp("paid_at", { useTz: true }).nullable();

    table.decimal("value", 10, 2).notNullable();
    table.text("payment_url").nullable();

    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index(["registration_id", "created_at"]);
    table.index(["registration_id", "status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("registration_payments");
}
