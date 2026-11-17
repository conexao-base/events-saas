import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("asaas_webhook_events", (table) => {
    table.string("asaas_event_id", 255).primary();
    table.string("event_type", 100).notNullable();
    table.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("asaas_webhook_events");
}
