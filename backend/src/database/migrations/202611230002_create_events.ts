import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("events", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("name", 120).notNullable();
    table.text("description").nullable();
    table.string("location", 255).nullable();
    table.date("start_date").nullable();
    table.date("end_date").nullable();
    table.jsonb("registration_fields").notNullable().defaultTo("[]");
    table
      .jsonb("appearance")
      .notNullable()
      .defaultTo(
        JSON.stringify({
          primaryColor: "#245C43",
          coverImage: "",
          logo: "",
        }),
      );
    table
      .enu("status", ["draft", "published"])
      .notNullable()
      .defaultTo("draft");
    table
      .timestamp("created_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp("updated_at", { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.index(["user_id", "created_at"]);
    table.index(["user_id", "status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("events");
}
