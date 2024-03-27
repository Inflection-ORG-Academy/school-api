import { bigint } from "drizzle-orm/mysql-core";
import { pgTable, bigserial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

const Roles = pgEnum('roles', ['worker', 'clerk', 'principal', 'teacher', 'accountant', 'admin', 'marketer']);

const Employee = pgTable('employees', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone').notNull(),
  password: text('password').notNull(), //$2b$10$xUNmNw6dtZoy5.v0lcQleuzjfQe6M2WskBoq8.ssXFWDYRFtmrppS // 1234
  role: Roles('roles').notNull(),
  profilePhoto: text('profile_photo'),
  forgotToken: text('forgot_token'),
  forgotTokenCreatedAt: timestamp('forgot_token_created_at', { precision: 0, withTimezone: true }),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
  createdBy: bigint('created_by', { mode: "bigint" }).references(() => Employee.id),
});

export { Employee, Roles }