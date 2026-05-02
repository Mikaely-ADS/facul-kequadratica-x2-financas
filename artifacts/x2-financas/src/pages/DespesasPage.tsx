import React, { useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { 
  useListTransactions, 
  useCreateTransaction, 
  useDeleteTransaction, 
  getListTransactionsQueryKey, 
  getGetDashboardSummaryQueryKey,
  getGetExpensesByCategoryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plus, Trash2, PiggyBank } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CHART_COLORS } from "@/lib/chartColors";

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que 0"),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.string().min(1, "Método é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function DespesasPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: transactions, isLoading: isLoadingTransactions } = useListTransactions({ type: "expense" });
  
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      category: "",
      amount: 0,
      type: "expense",
      paymentMethod: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    createTransaction.mutate(
      { data },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: "Despesa adicionada com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetExpensesByCategoryQueryKey() });
        },
        onError: () => {
          toast({ title: "Erro ao adicionar despesa", variant: "destructive" });
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
      deleteTransaction.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Despesa excluída" });
            queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetExpensesByCategoryQueryKey() });
          },
          onError: () => {
            toast({ title: "Erro ao excluir despesa", variant: "destructive" });
          }
        }
      );
    }
  };

  const expenses = transactions || [];
  const totalGasto = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Group by category for donut chart
  const expensesByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalGasto) * 100).toFixed(0)
  })).sort((a, b) => b.value - a.value);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Alimentação": "bg-orange-500 text-white",
      "Casa": "bg-blue-500 text-white",
      "Lazer": "bg-purple-500 text-white",
      "Transporte": "bg-yellow-500 text-white",
      "Saúde": "bg-red-500 text-white",
      "Educação": "bg-indigo-500 text-white",
    };
    return colors[category] || "bg-gray-500 text-white";
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#57BC67]/20 rounded-full">
            <PiggyBank className="w-8 h-8 text-[#57BC67]" />
          </div>
          <h2 className="text-3xl font-bold font-title text-foreground">Despesas</h2>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#57BC67] hover:bg-[#57BC67]/90 text-white">
                <Plus className="w-4 h-4" /> Adicionar nova despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nova Despesa</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="space-y-2 hidden">
                  <Input type="hidden" {...form.register("type")} value="expense" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input id="description" {...form.register("description")} placeholder="Ex: Mercado" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <Input id="amount" type="number" step="0.01" {...form.register("amount")} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" type="date" {...form.register("date")} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Método de Pagamento</Label>
                  <Controller
                    name="paymentMethod"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PIX">PIX</SelectItem>
                          <SelectItem value="Cartão Crédito">Cartão de Crédito</SelectItem>
                          <SelectItem value="Cartão Débito">Cartão de Débito</SelectItem>
                          <SelectItem value="Boleto">Boleto</SelectItem>
                          <SelectItem value="Transferência">Transferência</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={createTransaction.isPending}>
                    {createTransaction.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Despesas */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="text-lg">Gastos e despesas fixas</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              {isLoadingTransactions ? (
                <div className="p-4 space-y-3">
                  {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Valor gasto</TableHead>
                      <TableHead>Método de pagamento</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                          Nenhuma despesa encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {expenses.map((t) => (
                          <TableRow key={t.id} className="border-border hover:bg-muted/50 group">
                            <TableCell className="text-muted-foreground">
                              {formatDate(t.date)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`font-normal ${getCategoryColor(t.category)} border-0`}>
                                {t.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-foreground">{t.description}</TableCell>
                            <TableCell className="font-bold text-destructive">
                              {formatBRL(t.amount)}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{t.paymentMethod}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(t.id)}
                                disabled={deleteTransaction.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={3} className="font-bold">Total</TableCell>
                          <TableCell className="font-bold text-[#57BC67]">
                            {formatBRL(totalGasto)}
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </div>

        {/* Gráfico */}
        <div>
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="text-lg">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <Skeleton className="w-full h-64" />
              ) : chartData.length > 0 ? (
                <>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatBRL(value)}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {chartData.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                          <span>{entry.name}</span>
                        </div>
                        <div className="font-medium">
                          {entry.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Sem dados para exibir
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}