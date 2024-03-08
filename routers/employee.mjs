import express from "express"
import { randomBytes } from "crypto";
import * as path from 'path';
import { CustomError, errorCapture } from "./error.mjs"
import { db } from "../database.mjs"
import { eq } from 'drizzle-orm';
import { Employee } from "../db/models/employee.mjs"
import jwt from "jsonwebtoken"
import { upload } from "../multer.mjs"
import { authentication } from "../middleware/auth.mjs"
import { sendEmail } from "../email/email.mjs";
import { forgotPasswordTemplate } from "../email/emailTemplets.mjs";

const employeeRouter = express.Router()

employeeRouter.post("/login", errorCapture(async (req, res, next) => {
  const { email, pass } = req.body
  const data = await db.select().from(Employee).where(eq(Employee.email, email))
  const employee = data[0]

  if (employee.password !== pass) {
    res.statusCode = 401
    return res.json({ error: "password is wrong" })
  }

  // create token
  var token = jwt.sign({ id: employee.id, email: employee.email, name: employee.name, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token })
}))

employeeRouter.patch("/forgot_password", errorCapture(async (req, res, next) => {
  // get email from body
  const { email } = req.body
  // generate token
  const token = randomBytes(30).toString('hex');
  // get employee from DB

  // save random string to db
  // await pgClient.query(`UPDATE employees SET forgot_token='${token}' WHERE email='${email}';`)
  // send email
  await sendEmail("price", email, "Forgot Password", forgotPasswordTemplate(token))
  res.json({ message: "password reset link sent to your email" })
}))

employeeRouter.patch("/reset_password/:token", errorCapture(async (req, res, next) => {
  // get email from body
  const { token } = req.params
  const { password } = req.body // check password validity

  // update from token and its expiry
  // const data = await pgClient.query(`UPDATE employees SET forgot_token='', password='${password}' WHERE forgot_token='${token}';`)
  if (data.rowCount !== 1) {
    throw new CustomError(null, 400, "password not updated")
  }
  res.send({ message: "password updated successfully" })
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