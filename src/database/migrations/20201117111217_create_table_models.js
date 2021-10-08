exports.up = function (knex) {
  return knex.schema.createTable("models", function (table) {
    table.increments("i_model").primary();
    table.string("name");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
    table.integer("i_brand_equipament").unsigned();
    table
      .foreign("i_brand_equipament")
      .references("brands_equipaments.i_brand_equipament");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("models");
};
