exports.up = function (knex) {
  return knex.schema.createTable("devices_notifications", function (table) {
    table.increments("i_device_notification").primary();
    table.integer("i_user").unsigned();
    table.foreign("i_user").references("users.i_user");
    table.string("expo_push_token").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("devices_notifications");
};
