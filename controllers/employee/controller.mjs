import { Employee } from "../../db/models/employee.mjs";
import { CustomError, errorCapture } from "../../routers/error.mjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import * as path from 'path';
import { db } from "../../database.mjs"
import { and, eq, gt } from 'drizzle-orm';
import { sendEmail } from "../../email/email.mjs";
import { forgotPasswordTemplate } from "../../email/emailTemplets.mjs";
import bcrypt from "bcrypt";
import { alias } from "drizzle-orm/pg-core";
import { AdmissionProforma } from "../../db/models/proforma.mjs";

const signup = errorCapture(async (req, res, next) => {
  const { name, email, pass, role, phone } = req.body

  const hashedPasswrod = await bcrypt.hash(pass, 10);

  const data = await db.insert(Employee).values({ name, email, password: hashedPasswrod, role, phone, createdBy: req.employee.id }).returning()
  const employee = data[0]

  // create token
  var token = jwt.sign({ id: employee.id, email: employee.email, name: employee.name, role: employee.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token })
})

const signin = errorCapture(async (req, res, next) => {
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
})

const forgotPassword = errorCapture(async (req, res, next) => {
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
  await sendEmail(data[0].name, email, "Forgot Password", forgotPasswordTemplate(token, data[0].name))
  res.json({ message: "password reset link sent to your email" })
})

const resetPassword = errorCapture(async (req, res, next) => {
  // get email from body
  const { token } = req.params
  const { password } = req.body // check password validity

  const hashedPasswrod = await bcrypt.hash(password, 10);

  const time = new Date(Date.now() - process.env.RESET_PASSWORD_TOEKN_TIME_MIN * 60 * 1000)
  // update from token and its expiry
  const data = await db.update(Employee)
    .set({ password: hashedPasswrod, forgotToken: '' })
    .where(and(eq(Employee.forgotToken, token), gt(Employee.forgotTokenCreatedAt, time))).returning()
  if (data.length == 0) {
    throw new CustomError(null, 400, "invalid token or expired")
  }
  res.send({ message: "password updated successfully" })
})

const updateProfile = errorCapture(async (req, res, next) => {
  const dataRes = await db.select().from(Employee).where(eq(Employee.id, req.employee.id))
  let { name, profilePhoto } = dataRes[0]
  req.body.name ? name = req.body.name : ""
  req.file ? profilePhoto = req.file.filename : ""

  const data = await db.update(Employee)
    .set({ name, profilePhoto })
    .where(eq(Employee.id, req.employee.id));

  res.json({
    message: "profile updated successfully"
  })
})

const getMyProfile = errorCapture(async (req, res, next) => {
  const parent = alias(Employee, "parent")
  const dataRes = await db.select({
    id: Employee.id,
    name: Employee.name,
    email: Employee.email,
    phone: Employee.phone,
    role: Employee.role,
    createdAt: Employee.createdAt,
    profilePhoto: Employee.profilePhoto,
    createdByName: parent.name,
    createdByEmail: parent.email
  }).from(Employee).where(eq(Employee.id, req.employee.id)).innerJoin(parent, eq(parent.id, Employee.createdBy))

  const data = dataRes[0]

  res.json(data)
})

const listProfiles = errorCapture(async function (req, res, next) {
  const data = await db.select().from(Employee)
  res.json(data)
})

const getMyProfilePhoto = errorCapture(async function (req, res, next) {

  const data = await db.select({ profilePhoto: Employee.profilePhoto }).from(Employee).where(eq(Employee.id, req.employee.id))
  const fileName = data[0].profilePhoto
  if (!fileName) {
    throw new CustomError(null, 401, "no profile photo updated")
  }
  res.sendFile(path.resolve(`uploads/${fileName}`));
})

const getProfilePhoto = errorCapture(async function (req, res, next) {
  const data = await db.select({ profilePhoto: Employee.profilePhoto }).from(Employee).where(eq(Employee.id, req.params.id))
  const fileName = data[0].profilePhoto
  if (!fileName) {
    throw new CustomError(null, 401, "no profile photo updated")
  }
  res.sendFile(path.resolve(`uploads/${fileName}`));
})

export {
  signup, signin, forgotPassword, resetPassword,
  updateProfile, getMyProfile, listProfiles, getMyProfilePhoto, getProfilePhoto
}