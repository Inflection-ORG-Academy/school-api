
/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./db/models",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  out: "./db/migrations"
};