import { pgTable, bigserial, text, timestamp, pgEnum, date, bigint } from "drizzle-orm/pg-core";

const Genders = pgEnum('genders', ['male', 'female']);
const Categories = pgEnum('categories', ['gen', 'obc', 'sc', 'st']);

const Student = pgTable('students', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  registrationId: text('registration_id').unique().notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  forgotToken: text('forgot_token'),
  forgotTokenCreatedAt: timestamp('forgot_token_created_at', { precision: 0, withTimezone: true }),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
});

const Registration = pgTable('students_registration', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  studentId: bigint('student_id', { mode: "number" }).notNull().references(() => Student.id),
  fatherName: text('father_name').notNull(),
  phone: text('phone').notNull(),
  alterPhone: text('alter_phone'),
  category: Categories('category'),
  email: text('email'),
  religion: text('religion'),
  address: text('address').notNull(),
  aadhar: bigint('aadhar', { mode: "number" }),
  nationality: text('nationality'),
  dob: date('dob').notNull(),
  motherName: text('mother_name'),
  gender: text('gender'),
  note: text('note'),
  photoUrl: text('photo_url'),
  signUrl: text('sign_url'),
  aadharUrl: text('aadhar_url'),
  lastYearResultUrl: text('last_year_result_url'),
  tc: text('tc'),
  cc: text('cc'),
});

export { Student, Registration, Genders, Categories }