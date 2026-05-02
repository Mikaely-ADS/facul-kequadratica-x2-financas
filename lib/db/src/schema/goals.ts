import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  targetAmount: numeric("target_amount", { precision: 14, scale: 2 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 14, scale: 2 })
    .notNull()
    .default("0"),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GoalRow = typeof goalsTable.$inferSelect;
