import { bigint } from "drizzle-orm/mysql-core";
import { pgTable, bigserial, text, timestamp, pgEnum, integer, boolean } from "drizzle-orm/pg-core";
import { Employee } from "./employee.mjs";

// TODO: add session_id as int not null
const AdmissionProforma = pgTable('admission_proformas', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  session: text('session').notNull(),

  className: text('class').notNull(),
  standard: integer('standard').notNull(),
  startTime: timestamp('start_time', { precision: 0, withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { precision: 0, withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
  createdBy: bigint('created_by', { mode: "number" }).references(() => Employee.id),
}, (t) => {
  unq: unique('unique_admission_proforma').on(t.session, t.className)
});

const FeesFor = pgEnum('fees_for', ['old', 'new', 'both']);

const FeesProforma = pgTable('fees_proformas', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  admisionProformaId: bigint('admision_proforma_id', { mode: "number" }).references(() => AdmissionProforma.id),
  category: text('category').notNull(),
  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  appliedFor: FeesFor('fees_for').notNull(),
  optional: boolean('optional').notNull().default(false),
  isRecuring: boolean('is_recuring').notNull().default(false),
  dueDate: timestamp('due_date', { precision: 0, withTimezone: true }).notNull(),
  penaltyRate: integer('penalty_rate').notNull().default(0),
  penaltyIncDay: integer('penalty_inc_day').notNull().default(30),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
  createdBy: bigint('created_by', { mode: "number" }).references(() => Employee.id),
});

const SectionProforma = pgTable('section_proformas', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  admisionProformaId: bigint('admision_proforma_id', { mode: "number" }).references(() => AdmissionProforma.id),
  name: text('name').notNull(),
  seat: integer('seat').notNull(),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
  createdBy: bigint('created_by', { mode: "number" }).references(() => Employee.id),
});

export { AdmissionProforma, FeesProforma, FeesFor, SectionProforma }