import { pgTable, bigserial, text, timestamp, pgEnum, integer, boolean, bigint } from "drizzle-orm/pg-core";
import { Student } from "./student.mjs";
import { SectionProforma } from "./proforma.mjs";
import { Employee } from "./employee.mjs";
import { AdmissionProforma } from "./proforma.mjs";

const Admission = pgTable('admissions', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  studentId: bigint('student_id', { mode: "number" }).notNull().references(() => Student.id),
  rollNumber: text('roll_number').notNull(),
  className: text('class').notNull(),
  admissionProformaId: bigint('admission_proforma_id', { mode: "number" }).notNull().references(() => AdmissionProforma.id),
  sectionProformaId: bigint('section_prforma_id', { mode: "number" }).notNull().references(() => SectionProforma.id),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
  verifiedBy: bigint('verified_by', { mode: "number" }).references(() => Employee.id),
});

export { Admission }