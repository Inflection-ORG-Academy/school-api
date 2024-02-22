import express from "express"
import { errorCapture } from "./error.mjs"
import { pgClient } from "../database.mjs"
import { auth } from "../middleware/auth.mjs"
import jwt from "jsonwebtoken"

const employeeRouter = express.Router()

employeeRouter.post("/login", errorCapture(async (req, res, next) => {
  const { email, pass } = req.body
  const data = await pgClient.query(`SELECT * FROM employees WHERE email='${email}' LIMIT 1;`)
  const employee = data.rows[0]

  if (employee.password !== pass) {
    res.statusCode = 401
    return res.json({ error: "password is wrong" })
  }

  // create token
  var token = jwt.sign({ id: employee.id, email: employee.email, name: employee.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token })
}))

export { employeeRouter }