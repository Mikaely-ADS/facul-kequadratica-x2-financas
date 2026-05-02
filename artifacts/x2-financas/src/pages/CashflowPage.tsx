import React, { useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { useGetCashflow, useListTransactions, useCreateTransaction, useDeleteTransaction, getListTransactionsQueryKey, getGetDashboardSummaryQueryKey, getGetCashflowQueryKey, getGetExpensesByCategoryQueryKey, getGetWeeklyPerformanceQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que 0"),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.string().min(1, "Método é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function CashflowPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cashflow, isLoading: isLoadingCashflow } = useGetCashflow();
  
  const createTransaction = useCreateTransaction();

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
          toast({ title: "Transação criada com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetCashflowQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetExpensesByCategoryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetWeeklyPerformanceQueryKey() });
        },
        onError: () => {
          toast({ title: "Erro ao criar transação", variant: "destructive" });
        }
      }
    );
  };

  const totalIncome = cashflow?.reduce((acc, curr) => acc + curr.income, 0) || 0;
  const totalExpense = cashflow?.reduce((acc, curr) => acc + curr.expense, 0) || 0;
  const totalNet = totalIncome - totalExpense;

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-title text-foreground">Fluxo de Caixa</h2>
          <p className="text-muted-foreground mt-1">Acompanhe suas entradas e saídas.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="r-expense" />
                        <Label htmlFor="r-expense" className="text-destructive">Saída</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="r-income" />
                        <Label htmlFor="r-income" className="text-primary">Entrada</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
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
                        <SelectItem value="Renda Extra">Renda Extra</SelectItem>
                        <SelectItem value="Salário">Salário</SelectItem>
                        <SelectItem value="Investimentos">Investimentos</SelectItem>
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

      {isLoadingCashflow ? (
        <Skeleton className="h-80 w-full" />
      ) : (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Caixa ao longo do mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflow || []} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => formatDate(val, 'dd/MM')}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `R$${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--primary))', borderLeftWidth: '4px', color: 'hsl(var(--foreground))' }}
                    labelFormatter={(val) => formatDate(val as string, 'dd/MM/yyyy')}
                    formatter={(value: number, name: string) => [
                      formatBRL(value), 
                      name === 'income' ? 'Entradas' : name === 'expense' ? 'Saídas' : 'Líquido'
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" name="Entradas" stroke="#57BC67" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" name="Saídas" stroke="#E5484D" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="net" name="Líquido" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Extrato de Fluxo de Caixa</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          {isLoadingCashflow ? (
            <div className="p-4 space-y-3">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Entradas</TableHead>
                  <TableHead className="text-right">Saídas</TableHead>
                  <TableHead className="text-right">Líquido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashflow?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                      Nenhum fluxo de caixa encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {cashflow?.map((c, i) => {
                      const net = c.income - c.expense;
                      return (
                        <TableRow key={i} className="border-border hover:bg-muted/50">
                          <TableCell className="font-medium text-muted-foreground">
                            {formatDate(c.date)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-[#57BC67]">
                            {formatBRL(c.income)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-[#E5484D]">
                            {formatBRL(c.expense)}
                          </TableCell>
                          <TableCell className={`text-right font-medium ${net >= 0 ? "text-white" : "text-white"}`}>
                            {formatBRL(net)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/30">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold text-[#57BC67]">
                        {formatBRL(totalIncome)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-[#E5484D]">
                        {formatBRL(totalExpense)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-white">
                        {formatBRL(totalNet)}
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
