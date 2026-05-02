import React from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { useListTransactions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

export default function InsightsPage() {
  const { data: transactions, isLoading } = useListTransactions();

  // Sort by date desc to simulate "recent"
  const recentTransactions = transactions 
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15)
    : [];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Alimentação": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "Casa": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Lazer": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "Transporte": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "Saúde": "bg-red-500/10 text-red-500 border-red-500/20",
      "Renda Extra": "bg-green-500/10 text-green-500 border-green-500/20",
      "Salário": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      "Investimentos": "bg-teal-500/10 text-teal-500 border-teal-500/20",
    };
    return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  return (
    <motion.div 
      className="space-y-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-3xl font-bold font-title text-foreground">Insights Financeiros</h2>
        <p className="text-muted-foreground mt-1">Análise inteligente dos seus hábitos de consumo recentes.</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-start gap-4 pt-6">
          <div className="p-3 bg-primary/20 rounded-full">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Bom controle de despesas</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Suas despesas com Lazer estão 15% menores nesta semana em comparação com a média do mês passado. 
              Continue assim para atingir sua Meta de Lucro mais rápido.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Sua atividade mais recente analisada.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma transação recente encontrada.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentTransactions.map((t, i) => (
                <motion.div 
                  key={t.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 sm:p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                      {t.type === 'income' ? 
                        <ArrowUpRight className="w-5 h-5 text-primary" /> : 
                        <ArrowDownRight className="w-5 h-5 text-destructive" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{t.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-semibold border ${getCategoryColor(t.category)}`}>
                          {t.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold font-mono tracking-tight ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatBRL(t.amount)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
