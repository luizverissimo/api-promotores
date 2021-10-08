exports.up = function (knex) {
  return knex.schema.createTable("visits", function (table) {
    table.increments("i_visit").primary();
    table.text("anotation").notNullable();
    table.integer("days_return").default(30);
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
    table.integer("i_customer").unsigned();
    table.foreign("i_customer").references("customers.i_customer");
    table.integer("i_resale").unsigned();
    table.foreign("i_resale").references("resales.i_resale");
    table.integer("i_user").unsigned();
    table.foreign("i_user").references("users.i_user");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("visits");
};
