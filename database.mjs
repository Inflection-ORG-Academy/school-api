import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config({
  path: "./.env"
})
const pgClient = new pg.Client(process.env.DB_URL)

export { pgClient }