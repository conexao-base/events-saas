import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("customers", (table) => {
    table.uuid("id").primary();

    table.string("name").notNullable();
    table.string("cpf_cnpj", 14).notNullable().unique();
    table.string("email").nullable();
    table.string("mobile_phone", 20).nullable();

    table.string("asaas_customer_id").notNullable().unique();

    table.timestamps(true, true);
  });

  await knex.schema.alterTable("registrations", (table) => {
    table
      .uuid("customer_id")
      .nullable()
      .references("id")
      .inTable("customers")
      .onDelete("SET NULL");

    table.index("customer_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("registrations", (table) => {
    table.dropIndex(["customer_id"]);
    table.dropForeign(["customer_id"]);
    table.dropColumn("customer_id");
  });

  await knex.schema.dropTableIfExists("customers");
}
