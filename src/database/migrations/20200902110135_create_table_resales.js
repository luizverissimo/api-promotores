exports.up = function (knex) {
  return knex.schema.createTable("resales", function (table) {
    table.increments("i_resale").primary();
    table.string("name").notNullable();
    table.bigInteger("phone");
    table.string("formatted_address");
    table.string("city");
    table.string("state");
    table.string("country");
    table.string("postal_code");

    table.decimal("latitude", 16, 8);
    table.decimal("longitude", 16, 8);
    table.decimal("latitudeDelta", 10, 8);
    table.decimal("longitudeDelta", 10, 8);
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("resales");
};
