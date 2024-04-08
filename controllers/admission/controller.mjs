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
import { Admission } from "../../db/models/admission.mjs";

const getMyAdmission = errorCapture(async (req, res, next) => {
  // TODO: search student in student_registration table
  console.log(req.student)

  const data = await db.select().from(Admission).where(eq(Admission.studentId, req.student.id))

  if (data.length == 0) {
    throw new CustomError(null, 404, "admission not found")
  }

  const admission = data[0]

  res.json(admission)
})

export { getMyAdmission }