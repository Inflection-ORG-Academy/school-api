import express from 'express'
import dotenv from 'dotenv'

dotenv.config({
  path: "./.env"
})

import pg from 'pg'
const app = express()
const port = 3000

const pgClient = new pg.Client(process.env.DB_URL)

app.get('/', async (req, res) => {
  res.json({ message: "hello" })
})

app.get('/students', async (req, res) => {
  const data = await pgClient.query('SELECT * from students ORDER BY id DESC')
  res.json({ students: data.rows })
})

app.get('/admissions', async (req, res) => {
  // SQL
  const data = await pgClient.query('SELECT admissions.id AS admission_id,student_id,name,father_name,class from admissions INNER JOIN students ON admissions.student_id = students.id')
  res.json(data.rows)
})

app.listen(port, async () => {
  await pgClient.connect()
  console.log(`School API listening on port ${port}`)
})