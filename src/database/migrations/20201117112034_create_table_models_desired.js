exports.up = function (knex) {
  return knex.schema.createTable("models_desired", function (table) {
    table.increments("i_model_desired").primary();
    table.integer("i_visit").unsigned();
    table.foreign("i_visit").references("visits.i_visit");
    table.integer("i_model").unsigned();
    table.foreign("i_model").references("models.i_model");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("models_desired");
};
