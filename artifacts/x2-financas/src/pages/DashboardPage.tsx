import React from "react";
import { formatBRL } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardSummary, useGetWeeklyPerformance, useGetExpensesByCategory } from "@workspace/api-client-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, Target } from "lucide-react";

export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: weekly, isLoading: isLoadingWeekly } = useGetWeeklyPerformance();
  const { data: expenses, isLoading: isLoadingExpenses } = useGetExpensesByCategory();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const DONUT_COLORS = ['#57BC67', '#3D9B52', '#7FD18A', '#2563EB', '#7C3AED', '#EA580C', '#DC2626'];

  if (isLoadingSummary || isLoadingWeekly || isLoadingExpenses) {
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
          <Skeleton className="lg:col-span-2 h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h2 className="text-3xl font-bold font-title text-foreground">{getGreeting()}, Mikaely Alves</h2>
        <p className="text-muted-foreground mt-1">Aqui está o resumo da sua vida financeira hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Saldo Atual */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Atual</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatBRL(summary?.currentBalance || 0)}
              </div>
              <p className="text-xs mt-1 flex items-center gap-1">
                {(summary?.balanceDelta || 0) >= 0 ? (
                  <span className="text-primary flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +{summary?.balanceDelta}%</span>
                ) : (
                  <span className="text-destructive flex items-center"><ArrowDownRight className="w-3 h-3 mr-1" /> {summary?.balanceDelta}%</span>
                )}
                <span className="text-muted-foreground">vs mês anterior</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saldo de Investimento */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo de Investimento</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatBRL(summary?.investmentBalance || 0)}
              </div>
              <p className="text-xs mt-1 flex items-center gap-1">
                {(summary?.investmentDelta || 0) >= 0 ? (
                  <span className="text-primary flex items-center"><ArrowUpRight className="w-3 h-3 mr-1" /> +{summary?.investmentDelta}%</span>
                ) : (
                  <span className="text-destructive flex items-center"><ArrowDownRight className="w-3 h-3 mr-1" /> {summary?.investmentDelta}%</span>
                )}
                <span className="text-muted-foreground">vs mês anterior</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Despesas Fixas */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas Fixas</CardTitle>
              <div className="p-2 bg-destructive/10 rounded-full">
                <CreditCard className="w-4 h-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatBRL(summary?.fixedExpenses || 0)}
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Previsto para este mês
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Meta de Lucro */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border hover-elevate">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Meta de Lucro</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatBRL(summary?.profitGoal || 0)}
              </div>
              <Progress value={summary?.profitGoalProgress || 0} className="h-2 mt-3 bg-secondary" />
              <p className="text-xs mt-2 text-muted-foreground text-right">
                {summary?.profitGoalProgress || 0}% alcançado
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Desempenho Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weekly || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `R$${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--primary))', borderLeftWidth: '4px', color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [formatBRL(value), 'Valor']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expenses by Category */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)]">
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenses || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="amount"
                      stroke="none"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? (
                          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
                            {(percent * 100).toFixed(0)}%
                          </text>
                        ) : null;
                      }}
                    >
                      {(expenses || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--primary))', borderLeftWidth: '4px', color: 'hsl(var(--foreground))' }}
                      formatter={(value: number, name: string, props: any) => [formatBRL(value), 'Valor']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full mt-4 space-y-2 overflow-y-auto max-h-32">
                {(expenses || []).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                      <span className="text-muted-foreground truncate max-w-[120px]">{entry.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">{formatBRL(entry.amount)}</span>
                      <span className="text-muted-foreground w-8 text-right">{entry.percentage}%</span>
                    </div>
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
