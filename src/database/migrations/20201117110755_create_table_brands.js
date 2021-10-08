exports.up = function (knex) {
  return knex.schema.createTable("brands", function (table) {
    table.increments("i_brand").primary();
    table.string("name");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("brands");
};
