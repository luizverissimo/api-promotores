exports.up = function (knex) {
  return knex.schema.createTable("resale_employers", function (table) {
    table.increments("i_resale_employer").primary();
    table.string("name").notNullable();
    table.string("email");
    table.bigInteger("phone");
    table.string("position");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
    table.integer("i_resale").unsigned();
    table.foreign("i_resale").references("resales.i_resale");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("resale_employers");
};
