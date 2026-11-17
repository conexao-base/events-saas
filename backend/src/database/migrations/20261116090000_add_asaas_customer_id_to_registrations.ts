import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("registrations", (table) => {
    table.string("asaas_customer_id", 50).nullable();
    table.index("asaas_customer_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("registrations", (table) => {
    table.dropIndex("asaas_customer_id");
    table.dropColumn("asaas_customer_id");
  });
}
