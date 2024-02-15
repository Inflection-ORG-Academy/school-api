import express from 'express'
import dotenv from 'dotenv'
import pg from 'pg'
import { errorCapture } from './error.mjs'
dotenv.config({
  path: "./.env"
})

const app = express()
const port = 3000

const pgClient = new pg.Client(process.env.DB_URL)

app.get('/', errorCapture((req, res) => {
  throw Error("jsdhvghjbvskdns")
  res.send("hello")
}))

app.get('/students', errorCapture(async (req, res) => {
  const data = await pgClient.query('SELECT * from students ORDER BY id DESC')
  res.json({ students: data.rows })
}))

app.get('/admissions', errorCapture(async (req, res) => {
  // SQL
  const data = await pgClient.query('SELECT admissions.id AS admission_id,student_id,name,father_name,class from admissions INNER JOIN students ON admissions.student_id = students.id')
  res.json(data.rows)
}))

app.listen(port, async () => {
  await pgClient.connect()
  console.log(`School API listening on port ${port}`)
})