import express from "express"
import * as path from 'path';
import { errorCapture } from "./error.mjs"
import { pgClient } from "../database.mjs"
import jwt from "jsonwebtoken"
import { upload } from "../multer.mjs"
import { authentication } from "../middleware/auth.mjs"

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
  var token = jwt.sign({ id: employee.id, email: employee.email, name: employee.name, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token })
}))

employeeRouter.post("/upload", authentication, errorCapture(upload.single("image")), errorCapture(async (req, res, next) => {
  // todo: save file name to employee profile photo in column name profile_photo
  console.log(req.file)
  res.json({
    message: "file uploaded successfully"
  })
}))

employeeRouter.get('/myprofile_photo', errorCapture(function (req, res, next) {
  // TODO: get file name from DB
  const fileName = "apple.jpg"
  res.sendFile(path.resolve(`uploads/${fileName}`));
}))

export { employeeRouter }