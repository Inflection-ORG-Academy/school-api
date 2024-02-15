import pg from 'pg'
const pgClient = new pg.Client(process.env.DB_URL)

export { pgClient }