import { pgTable, bigserial, text, timestamp } from "drizzle-orm/pg-core";

const Employee = pgTable('employees', {
  id: bigserial('id', { mode: "number" }).primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  profilePhoto: text('profile_photo'),
  forgotToken: text('forgot_token'),
  forgotTokenCreatedAt: timestamp('forgot_token_created_at', { precision: 0, withTimezone: true }),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: true }).notNull().default('now()'),
});

export { Employee }