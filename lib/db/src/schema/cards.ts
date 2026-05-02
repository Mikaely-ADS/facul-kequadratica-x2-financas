import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const cardsTable = pgTable("cards", {
  id: serial("id").primaryKey(),
  holder: text("holder").notNull(),
  last4: text("last4").notNull(),
  brand: text("brand").notNull(),
  limit: numeric("card_limit", { precision: 14, scale: 2 }).notNull(),
  balance: numeric("balance", { precision: 14, scale: 2 }).notNull(),
  expiry: text("expiry").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type CardRow = typeof cardsTable.$inferSelect;
