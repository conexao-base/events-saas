import knex, { type Knex } from "knex";
import { env } from "./env.js";

export const db: Knex = knex({
  client: "pg",
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  pool: {
    min: 0,
    max: 10,
  },
});
