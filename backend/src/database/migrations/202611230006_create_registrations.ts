import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("registrations", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table
      .uuid("event_id")
      .notNullable()
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");

    table
      .uuid("payment_lot_id")
      .nullable()
      .references("id")
      .inTable("event_payment_lots")
      .onDelete("SET NULL");

    table.jsonb("data").notNullable();
    table.decimal("payment_amount", 10, 2).nullable();
    table.jsonb("payment_conditions").nullable();

    table
      .enu("status", ["pending", "confirmed", "cancelled"])
      .notNullable()
      .defaultTo("pending");

    table.string("asaas_customer_id", 80).nullable();
    table.string("asaas_payment_id", 80).nullable().unique();
    table.string("asaas_payment_status", 50).nullable();
    table.string("asaas_payment_url", 1000).nullable();
    table.string("payment_billing_type", 30).nullable();
    table.integer("payment_installments").nullable();
    table.date("payment_due_date").nullable();

    table
      .string("payment_creation_status", 20)
      .notNullable()
      .defaultTo("not_started");

    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());

    table.index(["event_id", "created_at"]);
    table.index(["payment_lot_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("registrations");
}
