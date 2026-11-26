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

    table.string("asaas_payment_id", 80).notNullable().unique();
    table.string("asaas_installment_id", 80).nullable();

    table.integer("installment_count").nullable();

    table.string("status", 50).notNullable();
    table.string("payment_method", 30).notNullable();

    table.timestamp("billing_date", { useTz: true }).notNullable();
    table.date("due_date").nullable();
    table.timestamp("paid_at", { useTz: true }).nullable();

    table.decimal("value", 10, 2).notNullable();
    table.string("payment_url", 1000).nullable();

    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.index(["registration_id", "created_at"]);
    table.index(["status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("registration_payments");
}
