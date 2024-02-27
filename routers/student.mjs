import express from "express"
import { errorCapture } from "./error.mjs"
import { pgClient } from "../database.mjs"
import { authentication, clerkAuthorization } from "../middleware/auth.mjs"

const studentRouter = express.Router()

studentRouter.use(authentication)
studentRouter.use(clerkAuthorization)

studentRouter.get('/', errorCapture(async (req, res) => {
  const data = await pgClient.query('SELECT * from students ORDER BY id DESC')
  res.json({ students: data.rows })
}))

studentRouter.post('/', errorCapture(async (req, res) => {
  const { name, father_name, phone } = req.body
  const data = await pgClient.query(`INSERT INTO students (name, father_name, phone, created_by) VALUES ('${name}', '${father_name}', '${phone}', '${req.employee.id}');`)
  if (data.rowCount === 1) {
    res.json({ message: "student inserted successfully" })
  } else {
    res.statusCode = 500
    res.json({ message: "failed to insert student" })
  }
}))

// TODO:
studentRouter.patch('/:student_id', errorCapture(async (req, res) => {
  res.json({ query: req.query, params: req.params })
}))

// TODO:
studentRouter.delete('/:student_id', errorCapture(async (req, res) => {
  res.json({ params: req.params })
}))

export { studentRouter }