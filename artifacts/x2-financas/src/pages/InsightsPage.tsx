import React, { useState } from "react";
import { formatBRL, formatDate } from "@/lib/format";
import { useListTransactions } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Search, Plus, CreditCard, ShoppingBag, Coffee, Home, Car, Heart, DollarSign, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InsightsPage() {
  const { data: transactions, isLoading } = useListTransactions();
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions
    ? [...transactions]
        .filter(t => t.description.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20)
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentação": return <Coffee className="w-4 h-4" />;
      case "Casa": return <Home className="w-4 h-4" />;
      case "Lazer": return <ShoppingBag className="w-4 h-4" />;
      case "Transporte": return <Car className="w-4 h-4" />;
      case "Saúde": return <Heart className="w-4 h-4" />;
      case "Renda Extra": return <DollarSign className="w-4 h-4" />;
      case "Salário": return <Briefcase className="w-4 h-4" />;
      case "Investimentos": return <CreditCard className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatus = (dateStr: string) => {
    const isPast = new Date(dateStr).getTime() <= new Date().getTime();
    return isPast ? "Concluído" : "Pendente";
  };

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-3xl font-bold font-title text-foreground">Insights Financeiros</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
        <h3 className="text-xl font-bold font-title">Transações Recentes</h3>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-8 bg-card"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="bg-[#5c47e0] hover:bg-[#5c47e0]/90 text-white whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> Nova Transação
          </Button>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma transação encontrada.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium">Descrição</th>
                    <th className="px-6 py-4 font-medium">Categoria</th>
                    <th className="px-6 py-4 font-medium text-right">Valor</th>
                    <th className="px-6 py-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTransactions.map((t, i) => {
                    const status = getStatus(t.date);
                    return (
                      <motion.tr 
                        key={t.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                              {getCategoryIcon(t.category)}
                            </div>
                            <span className="font-medium text-foreground">{t.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`font-medium ${getCategoryColor(t.category)} border-0`}>
                            {t.category}
                          </Badge>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatBRL(t.amount)}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span className={`font-medium ${status === 'Concluído' ? 'text-muted-foreground' : 'text-orange-500'}`}>
                            {status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
