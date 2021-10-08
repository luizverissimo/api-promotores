exports.up = function (knex) {
  return knex.schema.createTable("notifications", function (table) {
    table.increments("i_notification").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.timestamp("sent_date").notNullable();
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("sent").nullable().default(false);
    table.boolean("deleted").nullable().default(false);
    table.integer("i_user").unsigned();
    table.foreign("i_user").references("users.i_user");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notifications");
};
