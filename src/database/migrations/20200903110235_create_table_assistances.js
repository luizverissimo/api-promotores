exports.up = function (knex) {
  return knex.schema.createTable("assistances", function (table) {
    table.increments("i_assistance").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
    table.integer("i_user").unsigned();
    table.foreign("i_user").references("users.i_user");
    table.integer("i_customer").unsigned();
    table.foreign("i_customer").references("customers.i_customer");
    table.integer("i_model").unsigned();
    table.foreign("i_model").references("models.i_model");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("assistances");
};
