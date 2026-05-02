import React, { useState } from "react";
import { formatBRL } from "@/lib/format";
import { useListCards, useCreateCard, getListCardsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card as CardUI, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, CreditCard as CardIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const cardSchema = z.object({
  holder: z.string().min(1, "Titular é obrigatório"),
  last4: z.string().length(4, "Deve ter 4 dígitos"),
  brand: z.string().min(1, "Bandeira é obrigatória"),
  limit: z.coerce.number().min(1, "Limite deve ser > 0"),
  balance: z.coerce.number().min(0),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA"),
  color: z.string().min(1, "Cor é obrigatória"),
});

type CardFormValues = z.infer<typeof cardSchema>;

const COLOR_OPTIONS = [
  { value: "#57BC67", label: "Verde Primário" },
  { value: "#1F1F1F", label: "Grafite" },
  { value: "#8B5CF6", label: "Roxo" },
  { value: "#3B82F6", label: "Azul" },
  { value: "#F59E0B", label: "Laranja" },
  { value: "#E11D48", label: "Vermelho" },
];

export default function CardsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cards, isLoading } = useListCards();
  const createCard = useCreateCard();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      holder: "",
      last4: "",
      brand: "Mastercard",
      limit: 1000,
      balance: 0,
      expiry: "",
      color: "#57BC67",
    },
  });

  const onSubmit = (data: CardFormValues) => {
    createCard.mutate(
      { data },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          toast({ title: "Cartão adicionado com sucesso!" });
          queryClient.invalidateQueries({ queryKey: getListCardsQueryKey() });
        },
        onError: () => toast({ title: "Erro ao adicionar cartão", variant: "destructive" })
      }
    );
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
          <h2 className="text-3xl font-bold font-title text-foreground">Cartões</h2>
          <p className="text-muted-foreground mt-1">Gerencie seus cartões de crédito e limites.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar Cartão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Cartão</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="holder">Nome no Cartão</Label>
                <Input id="holder" {...form.register("holder")} placeholder="Mikaely Alves" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last4">Últimos 4 dígitos</Label>
                  <Input id="last4" maxLength={4} {...form.register("last4")} placeholder="1234" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Validade (MM/AA)</Label>
                  <Input id="expiry" {...form.register("expiry")} placeholder="12/28" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="limit">Limite Total</Label>
                  <Input id="limit" type="number" step="0.01" {...form.register("limit")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="balance">Fatura Atual</Label>
                  <Input id="balance" type="number" step="0.01" {...form.register("balance")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cor do Cartão</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <div
                      key={color.value}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${form.watch("color") === color.value ? "ring-2 ring-offset-2 ring-primary scale-110" : ""}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => form.setValue("color", color.value)}
                    />
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createCard.isPending}>
                  {createCard.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2].map(i => <Skeleton key={i} className="h-56 w-full rounded-xl" />)}
        </div>
      ) : cards?.length === 0 ? (
        <CardUI className="bg-card border-border border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <CardIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Nenhum cartão adicionado</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Adicione seus cartões para centralizar seus limites.</p>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline">Adicionar Cartão</Button>
          </CardContent>
        </CardUI>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {cards?.map((card) => {
              const available = card.limit - card.balance;
              const usedPercentage = Math.min(100, (card.balance / card.limit) * 100);
              
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-4">
                    {/* The Credit Card Graphic */}
                    <div 
                      className="relative rounded-2xl p-6 h-56 flex flex-col justify-between overflow-hidden shadow-xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${card.color}dd 0%, ${card.color}88 100%)`,
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      {/* Glass effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      
                      <div className="flex justify-between items-start relative z-10">
                        {/* Fake Chip */}
                        <div className="w-12 h-10 rounded bg-gradient-to-br from-[#E0B976] to-[#A37B3C] shadow-inner opacity-90" />
                        <span className="font-bold text-white/90 text-lg tracking-wider italic">{card.brand}</span>
                      </div>

                      <div className="relative z-10 space-y-4">
                        <div className="text-white/90 font-mono tracking-[0.2em] text-xl drop-shadow-md">
                          **** **** **** {card.last4}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-white/60 uppercase tracking-widest">Titular</span>
                            <span className="text-white/90 font-medium tracking-wide truncate max-w-[150px]">
                              {card.holder}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-white/60 uppercase tracking-widest">Validade</span>
                            <span className="text-white/90 font-mono">{card.expiry}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Stats */}
                    <CardUI className="bg-card border-border border-t-0 rounded-t-none -mt-6 pt-6 relative z-0">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Fatura atual</span>
                          <span className="font-bold">{formatBRL(card.balance)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-muted-foreground">Limite disponível</span>
                          <span className="font-medium text-primary">{formatBRL(available)}</span>
                        </div>
                        <Progress value={usedPercentage} className="h-2 bg-secondary" />
                      </CardContent>
                    </CardUI>
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
