import express from "express"
import { errorCapture } from "./error.mjs"
import { pgClient } from "../database.mjs"

const admissionRouter = express.Router()

admissionRouter.get('/', errorCapture(async (req, res) => {
  const data = await pgClient.query('SELECT admissions.id AS admission_id,student_id,name,father_name,class from admissions INNER JOIN students ON admissions.student_id = students.id')
  res.json({ admissions: data.rows })
}))

export { admissionRouter }