import React, { useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { useListGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, getListGoalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
            <Button className="gap-2 bg-[#57BC67] hover:bg-[#57BC67]/90 text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[280px] w-full rounded-xl" />)}
        </div>
      ) : goals?.length === 0 ? (
        <Card className="bg-[#2A2A2A] border-0">
          <CardContent className="flex flex-col items-center justify-center h-[280px] text-center">
            <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-white">Nenhuma meta cadastrada</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Crie sua primeira meta para começar a poupar.</p>
            <Button onClick={() => setIsNewDialogOpen(true)} variant="outline">Criar Meta</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <div className="bg-[#2A2A2A] rounded-xl p-5 flex flex-col h-full relative group">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground bg-transparent font-medium rounded-full text-xs">
                        {goal.category}
                      </Badge>
                      <button 
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{goal.name}</h3>
                    
                    <div className="mt-auto">
                      <div className="text-[28px] font-bold text-[#57BC67] tracking-tight leading-none mb-1">
                        {formatBRL(goal.currentAmount)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        de {formatBRL(goal.targetAmount)}
                      </div>
                      
                      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-2">
                        <div 
                          className="bg-[#57BC67] h-full transition-all duration-500 ease-out" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs mb-5">
                        <span className="font-medium text-white">{progress}% concluído</span>
                        <span className="text-muted-foreground">Até {formatDate(goal.deadline)}</span>
                      </div>
                      
                      <Dialog open={aporteGoalId === goal.id} onOpenChange={(open) => !open && setAporteGoalId(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="w-full border border-border/50 text-white hover:bg-white/5 transition-colors h-10">
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
                              <Button type="submit" disabled={updateGoal.isPending || !aporteAmount} className="bg-[#57BC67] text-white hover:bg-[#57BC67]/90">
                                Confirmar
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
