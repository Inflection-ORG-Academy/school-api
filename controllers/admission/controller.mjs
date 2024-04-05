// admission this year verified -> show student panel
// admission this year and not verified -> show form fill student details
// admission not in this year but in last year -> payment for next class on result basis
// admission not in this year and not in last year -> payment for this new admission

import { CustomError, errorCapture } from "../../routers/error.mjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { db } from "../../database.mjs"
import { and, eq, gt } from 'drizzle-orm';
import bcrypt from "bcrypt";
import { alias } from "drizzle-orm/pg-core";
import { Registration, Student } from "../../db/models/student.mjs";
import { AdmissionProforma } from "../../db/models/proforma.mjs";

const getMyAdmission = errorCapture(async (req, res, next) => {
  const { name, fatherName, dob, phone, alterPhone, email, password, address, admissionProformaId, feesProformaIds } = req.body

  // Generate RollNumber ID
  const rollNumberId = parseInt(Math.random() * 100000000)

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
