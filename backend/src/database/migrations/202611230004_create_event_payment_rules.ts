import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("event_payment_rules", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("settings_id")
      .notNullable()
      .references("id")
      .inTable("event_payment_settings")
      .onDelete("CASCADE");
    table.string("name", 120).notNullable();
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table
      .jsonb("billing_types")
      .notNullable()
      .defaultTo(JSON.stringify(["PIX"]));
    table.integer("max_installments").notNullable().defaultTo(1);
    table.boolean("active").notNullable().defaultTo(true);
    table.integer("position").notNullable().defaultTo(0);
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.check('"end_date" >= "start_date"');
    table.check('"max_installments" >= 1 AND "max_installments" <= 12');
    table.index(["settings_id", "active", "start_date", "end_date"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("event_payment_rules");
}
