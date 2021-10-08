exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("i_user").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.string("operational_area");
    table.string("avatar");
    table.bigInteger("phone").notNullable();
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
