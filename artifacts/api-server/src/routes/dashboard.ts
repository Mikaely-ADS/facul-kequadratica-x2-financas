import { Router, type IRouter } from "express";
import { db, transactionsTable } from "@workspace/db";
import { desc, gte, lte, and } from "drizzle-orm";

const router: IRouter = Router();

function serializeTx(row: typeof transactionsTable.$inferSelect) {
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

router.get("/dashboard/summary", async (_req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(
      and(
        gte(transactionsTable.date, monthStart),
        lte(transactionsTable.date, monthEnd),
      ),
    );
  let income = 0;
  let expenses = 0;
  let fixed = 0;
  for (const r of rows) {
    const amt = Number(r.amount);
    if (r.type === "income") income += amt;
    else {
      expenses += amt;
      if (r.category === "Casa" || r.category === "Despesa Fixa") fixed += amt;
    }
  }
  const allRows = await db.select().from(transactionsTable);
  let totalIncome = 0;
  let totalExpenses = 0;
  for (const r of allRows) {
    const amt = Number(r.amount);
    if (r.type === "income") totalIncome += amt;
    else totalExpenses += amt;
  }
  const currentBalance = totalIncome - totalExpenses;
  const investmentBalance = 85530.16;
  const profitGoal = 5000;
  const monthProfit = income - expenses;
  const profitGoalProgress = Math.max(
    0,
    Math.min(1, monthProfit / profitGoal),
  );
  res.json({
    currentBalance: Number(currentBalance.toFixed(2)),
    balanceDelta: 5.4,
    investmentBalance,
    investmentDelta: 8.1,
    fixedExpenses: Number(fixed.toFixed(2)),
    profitGoal,
    profitGoalProgress: Number(profitGoalProgress.toFixed(2)),
    monthIncome: Number(income.toFixed(2)),
    monthExpenses: Number(expenses.toFixed(2)),
  });
});

router.get("/dashboard/performance", async (_req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(gte(transactionsTable.date, start));
  const weekly = [0, 0, 0, 0, 0];
  for (const r of rows) {
    const day = r.date.getDate();
    const wk = Math.min(4, Math.floor((day - 1) / 7));
    const amt = Number(r.amount);
    weekly[wk] += r.type === "income" ? amt : -amt;
  }
  res.json(
    weekly.map((value, i) => ({
      week: `Semana ${i + 1}`,
      value: Number(value.toFixed(2)),
    })),
  );
});

router.get("/dashboard/expenses-by-category", async (_req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(gte(transactionsTable.date, start));
  const map = new Map<string, number>();
  let total = 0;
  for (const r of rows) {
    if (r.type !== "expense") continue;
    const amt = Number(r.amount);
    map.set(r.category, (map.get(r.category) ?? 0) + amt);
    total += amt;
  }
  const result = Array.from(map.entries()).map(([category, amount]) => ({
    category,
    amount: Number(amount.toFixed(2)),
    percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
  }));
  res.json(result.sort((a, b) => b.amount - a.amount));
});

router.get("/dashboard/cashflow", async (_req, res) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const rows = await db
    .select()
    .from(transactionsTable)
    .where(gte(transactionsTable.date, start))
    .orderBy(transactionsTable.date);
  const map = new Map<string, { income: number; expense: number }>();
  for (const r of rows) {
    const key = r.date.toISOString().slice(0, 10);
    const cur = map.get(key) ?? { income: 0, expense: 0 };
    const amt = Number(r.amount);
    if (r.type === "income") cur.income += amt;
    else cur.expense += amt;
    map.set(key, cur);
  }
  const result = Array.from(map.entries()).map(([date, v]) => ({
    date,
    income: Number(v.income.toFixed(2)),
    expense: Number(v.expense.toFixed(2)),
  }));
  res.json(result);
});

router.get("/dashboard/recent-transactions", async (_req, res) => {
  const rows = await db
    .select()
    .from(transactionsTable)
    .orderBy(desc(transactionsTable.date))
    .limit(8);
  res.json(rows.map(serializeTx));
});

export default router;
