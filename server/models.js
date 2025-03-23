// const { Model } = require("objection");
import { Model } from "objection";
//
import knex_pkg from "knex";
const Knex = knex_pkg;

// Initialize knex.
const knex = Knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "example.sqlite3",
  },
});

// Knex sql injection discussion:
// https://github.com/knex/knex/issues/5835
// TLDL: binding query parameters are safe, schema routines are not.
// as only query binding parameters are used - no other consideration is given to the matter.

Model.knex(knex);

export class quiz extends Model {
  static get tableName() {
    return "quizzes";
  }
}

// export class question extends Model {
//   static get tableName() {
//     return "questions";
//   }
// }

export class answered_quiz extends Model {
  static get tableName() {
    return "answered_quizzes";
  }
}

export const QUESTION_TYPE_TEXT = 1;
export const QUESTION_TYPE_SINGLE_CHOICE = 2;
export const QUESTION_TYPE_MULTI_CHOICE = 3;

async function createSchema() {
  if (await knex.schema.hasTable("quizzes")) {
    return;
  }

  // Create database schema. You should use knex migration files
  // to do this. We create it here for simplicity.
  await knex.schema.createTable("quizzes", (table) => {
    table.increments("id").primary();
    table.text("name");
    table.text("description");
    table.text("questions_json");
    table.integer("questions_no");
    table.integer("completed_no");
    table.integer("can_be_completed");
    table.text("preflight_check_result");
  });

  await knex.schema.createTable("answered_quizzes", (table) => {
    table.increments("id").primary();
    table.integer("quiz_id");
    table.text("answers_json");
    table.integer("completion_time_sec");
  });
}

await createSchema();

// module.exports = MinimalModel;
