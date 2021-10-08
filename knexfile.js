// Update with your config settings.

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "promotordb",
      user: "postgres",
      password: "123",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/promotores-app-test.db",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    useNullAsDefault: true,
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};
