exports.up = function (knex) {
  return knex.schema.createTable("customers_models", function (table) {
    table.increments("i_customer_model").primary();
    table.integer("i_model").unsigned();
    table.foreign("i_model").references("models.i_model");
    table.integer("i_customer").unsigned();
    table.foreign("i_customer").references("customers.i_customer");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customers_models");
};
