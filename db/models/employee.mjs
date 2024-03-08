import { pgTable, serial, text } from "drizzle-orm/pg-core";

const Employee = pgTable('employees', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
});

export { Employee }