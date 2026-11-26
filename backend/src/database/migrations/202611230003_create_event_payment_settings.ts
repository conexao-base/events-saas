import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("event_payment_settings", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("event_id")
      .notNullable()
      .unique()
      .references("id")
      .inTable("events")
      .onDelete("CASCADE");
    table.boolean("enabled").notNullable().defaultTo(false);
    table.integer("due_days").notNullable().defaultTo(1);
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.check('"due_days" >= 0 AND "due_days" <= 90');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("event_payment_settings");
}
