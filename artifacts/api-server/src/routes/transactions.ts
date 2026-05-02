import { Router, type IRouter } from "express";
import { db, transactionsTable } from "@workspace/db";
import { desc, eq, and } from "drizzle-orm";
import {
  CreateTransactionBody,
  ListTransactionsQueryParams,
  DeleteTransactionParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: typeof transactionsTable.$inferSelect) {
  return {
    id: row.id,
    description: row.description,
    category: row.category,
    amount: Number(row.amount),
    type: row.type as "income" | "expense",
    paymentMethod: row.paymentMethod,
    date: row.date.toISOString(),
  };
}

router.get("/transactions", async (req, res) => {
  const parsed = ListTransactionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const filters = [];
  if (parsed.data.type) filters.push(eq(transactionsTable.type, parsed.data.type));
  if (parsed.data.category)
    filters.push(eq(transactionsTable.category, parsed.data.category));
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(transactionsTable.date));
  res.json(rows.map(serialize));
});

router.post("/transactions", async (req, res) => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(transactionsTable)
    .values({
      description: parsed.data.description,
      category: parsed.data.category,
      amount: String(parsed.data.amount),
      type: parsed.data.type,
      paymentMethod: parsed.data.paymentMethod,
      date: new Date(parsed.data.date),
    })
    .returning();
  res.json(serialize(row));
});

router.delete("/transactions/:id", async (req, res) => {
  const parsed = DeleteTransactionParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.delete(transactionsTable).where(eq(transactionsTable.id, parsed.data.id));
  res.json({ success: true });
});

export default router;
