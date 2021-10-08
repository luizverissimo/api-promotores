exports.up = function (knex) {
  return knex.schema.createTable("customers_models_visits", function (table) {
    table.increments("i_customer_model_visit").primary();
    table.integer("i_customer_model").unsigned();
    table
      .foreign("i_customer_model")
      .references("customers_models.i_customer_model");
    table.integer("i_visit").unsigned();
    table.foreign("i_visit").references("visits.i_visit");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customers_models_visits");
};
