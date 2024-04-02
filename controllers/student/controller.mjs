import { CustomError, errorCapture } from "../../routers/error.mjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { db } from "../../database.mjs"
import { and, eq, gt } from 'drizzle-orm';
import bcrypt from "bcrypt";
import { alias } from "drizzle-orm/pg-core";
import { Registration, Student } from "../../db/models/student.mjs";
import { AdmissionProforma } from "../../db/models/proforma.mjs";

const registerStudent = errorCapture(async (req, res, next) => {
  const { name, fatherName, dob, phone, alterPhone, email, password, address, admissionProformaId, feesProformaIds } = req.body

  // Generate Registration ID
  const registrationId = parseInt(Math.random() * 100000000)

  // Create Note for class and fees
  const note = `${admissionProformaId}-${feesProformaIds.join(",")}`

  // TODO: search student in student_registration table

  const hashedPasswrod = await bcrypt.hash(password, 10);
  const studentData = await db.insert(Student).values({ name, password: hashedPasswrod, registrationId }).returning()
  const student = studentData[0]
  const registrationData = await db.insert(Registration).values({ studentId: student.id, fatherName, phone, alterPhone, dob, address, email, note }).returning({ studentId: Registration.studentId, fatherName: Registration.fatherName, phone: Registration.phone, alterPhone: Registration.alterPhone, dob: Registration.dob, address: Registration.address, email: Registration.email })
  const registration = registrationData[0]

  res.json({ registration: { ...registration, registrationId: student.registrationId } })
})

const loginStudent = errorCapture(async (req, res, next) => {
  const { registrationId, password } = req.body
  const studentData = await db.select().from(Student).where(eq(registrationId, Student.registrationId))
  if (studentData.length === 0) {
    throw new CustomError(null, 404, "student not found")
  }
  const student = studentData[0]

  if (!await bcrypt.compare(password, student.password)) {
    throw new CustomError(null, 401, "your password is wrong")
  }

  // TODO: seclect only required data need to show on dashboard
  const registrationData = await db.select().from(Registration).where(eq(Registration.studentId, student.id))
  const registration = registrationData[0]

  var token = jwt.sign({ id: registration.studentId, registration: registrationId, name: student.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, registration: { ...registration, registrationId: student.registrationId } })
})

export { registerStudent, loginStudent }