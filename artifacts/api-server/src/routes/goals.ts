import { Router, type IRouter } from "express";
import { db, goalsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  CreateGoalBody,
  UpdateGoalBody,
  UpdateGoalParams,
  DeleteGoalParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serialize(row: typeof goalsTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    targetAmount: Number(row.targetAmount),
    currentAmount: Number(row.currentAmount),
    deadline: row.deadline.toISOString(),
  };
}

router.get("/goals", async (_req, res) => {
  const rows = await db.select().from(goalsTable).orderBy(desc(goalsTable.createdAt));
  res.json(rows.map(serialize));
});

router.post("/goals", async (req, res) => {
  const parsed = CreateGoalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(goalsTable)
    .values({
      name: parsed.data.name,
      category: parsed.data.category,
      targetAmount: String(parsed.data.targetAmount),
      currentAmount: String(parsed.data.currentAmount ?? 0),
      deadline: new Date(parsed.data.deadline),
    })
    .returning();
  res.json(serialize(row));
});

router.patch("/goals/:id", async (req, res) => {
  const params = UpdateGoalParams.safeParse(req.params);
  const body = UpdateGoalBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({
      error: params.success ? body.error?.message : params.error.message,
    });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (body.data.currentAmount !== undefined)
    updates.currentAmount = String(body.data.currentAmount);
  if (body.data.targetAmount !== undefined)
    updates.targetAmount = String(body.data.targetAmount);
  if (body.data.name !== undefined) updates.name = body.data.name;
  const [row] = await db
    .update(goalsTable)
    .set(updates)
    .where(eq(goalsTable.id, params.data.id))
    .returning();
  res.json(serialize(row));
});

router.delete("/goals/:id", async (req, res) => {
  const parsed = DeleteGoalParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.delete(goalsTable).where(eq(goalsTable.id, parsed.data.id));
  res.json({ success: true });
});

export default router;
