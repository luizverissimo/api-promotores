exports.up = function (knex) {
  return knex.schema.createTable("brands_equipaments", function (table) {
    table.increments("i_brand_equipament").primary();
    table.integer("i_brand").unsigned();
    table.foreign("i_brand").references("brands.i_brand");
    table.integer("i_equipament").unsigned();
    table.foreign("i_equipament").references("equipaments.i_equipament");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("brands_equipaments");
};
