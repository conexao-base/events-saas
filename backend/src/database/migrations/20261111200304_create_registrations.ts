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

    table.jsonb("data").notNullable();

    table
      .enu("status", ["pending", "confirmed", "cancelled"])
      .notNullable()
      .defaultTo("pending");

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.index("event_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("registrations");
}
