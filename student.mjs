import express from "express"
import { errorCapture } from "./error.mjs"
import { pgClient } from "./database.mjs"

const studentRouter = express.Router()

studentRouter.use((req, res, next) => {
  console.log("this is student middleware is running")
  next()
})

studentRouter.get('/', errorCapture(async (req, res) => {
  const data = await pgClient.query('SELECT * from students ORDER BY id DESC')
  res.json({ students: data.rows })
}))

export { studentRouter }