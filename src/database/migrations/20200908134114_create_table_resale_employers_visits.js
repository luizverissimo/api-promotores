exports.up = function (knex) {
  return knex.schema.createTable("resale_employers_visits", function (table) {
    table.increments("i_resale_employer_visit").primary();
    table.integer("i_resale_employer").unsigned();
    table
      .foreign("i_resale_employer")
      .references("resale_employers.i_resale_employer");
    table.integer("i_visit").unsigned();
    table.foreign("i_visit").references("visits.i_visit");
    table.integer("aud_created_by").notNullable();
    table.timestamp("aud_created_date").notNullable();
    table.integer("aud_updated_by");
    table.timestamp("aud_updated_date");
    table.boolean("deleted").nullable().default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("resale_employers_visits");
};
