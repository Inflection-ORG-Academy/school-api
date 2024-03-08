import 'dotenv/config'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
// import { Employee } from "./db/models/employee.mjs"

// Disable prefetch as it is not supported for "Transaction" pool mode
const pgClient = postgres(process.env.DB_URL)
const db = drizzle(pgClient);

// const employees = await db.select().from(Employee);
// console.log(employees)

export { pgClient, db }