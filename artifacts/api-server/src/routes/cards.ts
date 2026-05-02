import { Router, type IRouter } from "express";
import { db, cardsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { CreateCardBody } from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: typeof cardsTable.$inferSelect) {
  return {
    id: row.id,
    holder: row.holder,
    last4: row.last4,
    brand: row.brand,
    limit: Number(row.limit),
    balance: Number(row.balance),
    expiry: row.expiry,
    color: row.color,
  };
}

router.get("/cards", async (_req, res) => {
  const rows = await db.select().from(cardsTable).orderBy(desc(cardsTable.createdAt));
  res.json(rows.map(serialize));
});

router.post("/cards", async (req, res) => {
  const parsed = CreateCardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(cardsTable)
    .values({
      holder: parsed.data.holder,
      last4: parsed.data.last4,
      brand: parsed.data.brand,
      limit: String(parsed.data.limit),
      balance: String(parsed.data.balance),
      expiry: parsed.data.expiry,
      color: parsed.data.color,
    })
    .returning();
  res.json(serialize(row));
});

export default router;
