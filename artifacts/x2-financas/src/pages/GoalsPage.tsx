import React, { useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { useListGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, getListGoalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const goalSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  targetAmount: z.coerce.number().min(1, "Valor alvo deve ser maior que 0"),
  currentAmount: z.coerce.number().min(0),
  deadline: z.string().min(1, "Prazo é obrigatório"),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [aporteGoalId, setAporteGoalId] = useState<number | null>(null);
  const [aporteAmount, setAporteAmount] = useState("");

  const { data: goals, isLoading } = useListGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      category: "",
      targetAmount: 0,
      currentAmount: 0,
      deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: GoalFormValues) => {
    createGoal.mutate(
      { data },
      {
        onSuccess: () => {
          setIsNewDialogOpen(false);
          form.reset();
          toast({ title: "Meta criada com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
        },
        onError: () => toast({ title: "Erro ao criar meta", variant: "destructive" })
      }
    );
  };

  const handleAporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aporteGoalId || !aporteAmount) return;

    const goal = goals?.find(g => g.id === aporteGoalId);
    if (!goal) return;

    const amountNum = parseFloat(aporteAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    updateGoal.mutate(
      { id: aporteGoalId, data: { currentAmount: goal.currentAmount + amountNum } },
      {
        onSuccess: () => {
          setAporteGoalId(null);
          setAporteAmount("");
          toast({ title: "Aporte realizado com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
        },
        onError: () => toast({ title: "Erro ao realizar aporte", variant: "destructive" })
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      deleteGoal.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Meta excluída" });
            queryClient.invalidateQueries({ queryKey: getListGoalsQueryKey() });
          },
          onError: () => toast({ title: "Erro ao excluir meta", variant: "destructive" })
        }
      );
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-title text-foreground">Metas</h2>
          <p className="text-muted-foreground mt-1">Acompanhe seus objetivos financeiros.</p>
        </div>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Meta Financeira</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Meta</Label>
                <Input id="name" {...form.register("name")} placeholder="Ex: Carro Novo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" {...form.register("category")} placeholder="Ex: Veículos" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Valor Alvo</Label>
                  <Input id="targetAmount" type="number" step="0.01" {...form.register("targetAmount")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Valor Atual</Label>
                  <Input id="currentAmount" type="number" step="0.01" {...form.register("currentAmount")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo</Label>
                <Input id="deadline" type="date" {...form.register("deadline")} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createGoal.isPending}>
                  {createGoal.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      ) : goals?.length === 0 ? (
        <Card className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Nenhuma meta cadastrada</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Crie sua primeira meta para começar a poupar.</p>
            <Button onClick={() => setIsNewDialogOpen(true)} variant="outline">Criar Meta</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals?.map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <motion.div 
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-card border-border hover-elevate overflow-hidden flex flex-col h-full group">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-secondary text-secondary-foreground border-transparent font-medium">
                          {goal.category}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2"
                          onClick={() => handleDelete(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-xl mt-2">{goal.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 flex-1">
                      <div className="flex items-end gap-2 mt-4">
                        <span className="text-3xl font-bold font-title tracking-tight text-primary">
                          {formatBRL(goal.currentAmount)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        de {formatBRL(goal.targetAmount)}
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{progress}% concluído</span>
                          <span className="text-muted-foreground text-xs">Até {formatDate(goal.deadline)}</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-secondary" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 border-t border-border mt-auto pt-4 pb-4">
                      <Dialog open={aporteGoalId === goal.id} onOpenChange={(open) => !open && setAporteGoalId(null)}>
                        <DialogTrigger asChild>
                          <Button variant="secondary" className="w-full" onClick={() => setAporteGoalId(goal.id)}>
                            + Aportar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[325px]">
                          <DialogHeader>
                            <DialogTitle>Novo Aporte</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAporte} className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="aporte">Valor (R$)</Label>
                              <Input 
                                id="aporte" 
                                type="number" 
                                step="0.01" 
                                value={aporteAmount}
                                onChange={(e) => setAporteAmount(e.target.value)}
                                placeholder="0.00"
                                autoFocus
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={updateGoal.isPending || !aporteAmount}>
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
