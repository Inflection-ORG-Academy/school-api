import express from "express"
import { randomBytes } from "crypto";
import * as path from 'path';
import { CustomError, errorCapture } from "./error.mjs"
import { db } from "../database.mjs"
import { and, eq, gt } from 'drizzle-orm';
import { Employee } from "../db/models/employee.mjs"
import jwt from "jsonwebtoken"
import { upload } from "../multer.mjs"
import { authentication } from "../middleware/auth.mjs"
import { sendEmail } from "../email/email.mjs";
import { forgotPasswordTemplate } from "../email/emailTemplets.mjs";
import bcrypt from "bcrypt";

const employeeRouter = express.Router()

employeeRouter.post("/signup", errorCapture(async (req, res, next) => {
  const { name, email, pass, role } = req.body

  const hashedPasswrod = await bcrypt.hash(pass, 10);

  const data = await db.insert(Employee).values({ name, email, password: hashedPasswrod, role }).returning()
  const employee = data[0]

  // create token
  var token = jwt.sign({ id: employee.id, email: employee.email, name: employee.name, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token })
}))

employeeRouter.post("/login", errorCapture(async (req, res, next) => {
  const { email, pass } = req.body

  const data = await db.select().from(Employee).where(eq(Employee.email, email)).limit(1)
  if (data.length == 0) {
    throw new CustomError(null, 401, "employee not found")
  }
  const employee = data[0]
  if (!(await bcrypt.compare(pass, employee.password))) {
    throw new CustomError(null, 401, "password is wrong")
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
  console.log(token)

  // save random string to db
  const data = await db.update(Employee).set({ forgotToken: token, forgotTokenCreatedAt: new Date() }).where(eq(Employee.email, email)).returning()
  if (data.length == 0) {
    throw new CustomError(null, 400, "employee not found")
  }
  // send email
  await sendEmail("price", email, "Forgot Password", forgotPasswordTemplate(token))
  res.json({ message: "password reset link sent to your email" })
}))

employeeRouter.patch("/reset_password/:token", errorCapture(async (req, res, next) => {
  // get email from body
  const { token } = req.params
  const { password } = req.body // check password validity

  const hashedPasswrod = await bcrypt.hash(password, 10);

  const time = new Date(Date.now() - process.env.RESET_PASSWORD_TOEKN_TIME_MIN * 60 * 1000)
  // update from token and its expiry
  const data = await db.update(Employee)
    .set({ password: hashedPasswrod })
    .where(and(eq(Employee.forgotToken, token), gt(Employee.forgotTokenCreatedAt, time))).returning()
  if (data.length == 0) {
    throw new CustomError(null, 400, "invalid token or expired")
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