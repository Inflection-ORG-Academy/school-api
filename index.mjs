import express from 'express'
import pg from 'pg'
const app = express()
const port = 3000

const pgClient = new pg.Client("postgres://postgres.hshmcrkvnblxhwzlfqlz:GCtIKNV0w5IahNQJ@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres")

app.get('/students', async (req, res) => {
  const data = await pgClient.query('SELECT * from students')
  res.json({ students: data.rows })
})

app.get('/fees', (req, res) => {
  // SQL
  res.send('fees')
})

app.listen(port, async () => {
  await pgClient.connect()
  console.log(`School API listening on port ${port}`)
})