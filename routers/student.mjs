import express from "express"
import { errorCapture } from "./error.mjs"
import { pgClient } from "../database.mjs"

const studentRouter = express.Router()

studentRouter.use((req, res, next) => {
  console.log("this is student middleware is running")
  next()
})

studentRouter.get('/', errorCapture(async (req, res) => {
  const data = await pgClient.query('SELECT * from students ORDER BY id DESC')
  res.json({ students: data.rows })
}))

studentRouter.post('/', errorCapture(async (req, res) => {
  const { name, father_name, phone } = req.body
  const data = await pgClient.query(`INSERT INTO students (name, father_name, phone) VALUES ('${name}', '${father_name}', '${phone}');`)
  if (data.rowCount === 1) {
    res.json({ message: "student inserted successfully" })
  } else {
    res.statusCode = 500
    res.json({ message: "failed to insert student" })
  }
}))

export { studentRouter }