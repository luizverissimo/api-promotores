exports.up = function (knex) {
  return knex.schema.createTable("customer_employers", function (table) {
    table.increments("i_customer_employer").primary();
    table.string("name").notNullable();
    table.string("email");
    table.bigInteger("phone");
    table.string("position");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
    table.integer("i_customer").unsigned();
    table.foreign("i_customer").references("customers.i_customer");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customer_employers");
};
