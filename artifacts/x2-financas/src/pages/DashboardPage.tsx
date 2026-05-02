import React, { useMemo } from "react";
import { formatBRL } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardSummary, useGetWeeklyPerformance, useGetExpensesByCategory } from "@workspace/api-client-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from "recharts";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, Target } from "lucide-react";

const DONUT_COLORS = ['#57BC67', '#3D9B52', '#7FD18A', '#4ade80', '#86efac', '#22c55e', '#16a34a'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e2b1e', border: '1px solid #57BC67', borderRadius: 8, padding: '8px 14px' }}>
      <p style={{ color: '#ffffff', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.value >= 0 ? '#57BC67' : '#E5484D', margin: 0, fontSize: 13 }}>
          {formatBRL(p.value)}
        </p>
      ))}
    </div>
  );
};

const DonutTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e2b1e', border: '1px solid #57BC67', borderRadius: 8, padding: '8px 14px' }}>
      <p style={{ color: '#ffffff', fontWeight: 600, margin: 0 }}>{payload[0].name}</p>
      <p style={{ color: '#57BC67', margin: 0, fontSize: 13 }}>{formatBRL(payload[0].value)}</p>
    </div>
  );
};

export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: weekly, isLoading: isLoadingWeekly } = useGetWeeklyPerformance();
  const { data: expenses, isLoading: isLoadingExpenses } = useGetExpensesByCategory();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Bom dia";
    if (h >= 12 && h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const isLoading = isLoadingSummary || isLoadingWeekly || isLoadingExpenses;

  const weeklyData = useMemo(() =>
    (weekly || []).map(d => ({ ...d, color: (d.value ?? 0) >= 0 ? '#57BC67' : '#E5484D' })),
    [weekly]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[340px] w-full" />
          <Skeleton className="h-[340px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <div>
        <h2 className="text-3xl font-bold font-title text-foreground">{getGreeting()}, Mikaely Alves</h2>
        <p className="text-muted-foreground mt-1">Aqui está o resumo da sua vida financeira hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="h-full">
          <Card className="bg-card border-border hover-elevate h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Atual</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full"><DollarSign className="w-4 h-4 text-primary" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatBRL(summary?.currentBalance || 0)}</div>
              <p className="text-xs mt-1 flex items-center gap-1">
                {(summary?.balanceDelta || 0) >= 0
                  ? <span className="text-primary flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" />+{summary?.balanceDelta}%</span>
                  : <span className="text-destructive flex items-center"><ArrowDownRight className="w-3 h-3 mr-1" />{summary?.balanceDelta}%</span>}
                <span className="text-muted-foreground">vs mês anterior</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="bg-card border-border hover-elevate h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo de Investimento</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full"><Wallet className="w-4 h-4 text-primary" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatBRL(summary?.investmentBalance || 0)}</div>
              <p className="text-xs mt-1 flex items-center gap-1">
                {(summary?.investmentDelta || 0) >= 0
                  ? <span className="text-primary flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" />+{summary?.investmentDelta}%</span>
                  : <span className="text-destructive flex items-center"><ArrowDownRight className="w-3 h-3 mr-1" />{summary?.investmentDelta}%</span>}
                <span className="text-muted-foreground">vs mês anterior</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="bg-card border-border hover-elevate h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Fixas</CardTitle>
              <div className="p-2 bg-destructive/10 rounded-full"><CreditCard className="w-4 h-4 text-destructive" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatBRL(summary?.fixedExpenses || 0)}</div>
              <p className="text-xs mt-1 text-muted-foreground">Previsto para este mês</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="bg-card border-border hover-elevate h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meta de Lucro</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full"><Target className="w-4 h-4 text-primary" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{formatBRL(summary?.profitGoal || 0)}</div>
              <Progress value={summary?.profitGoalProgress || 0} className="h-1.5 mt-3 bg-secondary" />
              <p className="text-xs mt-1.5 text-muted-foreground text-right">
                {summary?.profitGoalProgress || 0}% alcançado
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div variants={itemVariants} className="lg:col-span-2 lg:mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Desempenho Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1.5} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#57BC67' : '#E5484D'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:self-start lg:mt-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[190px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenses || []} cx="50%" cy="46%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="amount" nameKey="category" stroke="none" labelLine={false}>
                      {(expenses || []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-1 space-y-1.5">
                {(expenses || []).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm leading-none">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                      <span className="text-muted-foreground truncate max-w-[110px]">{entry.category}</span>
                    </div>
                    <span className="font-medium text-foreground">{entry.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
