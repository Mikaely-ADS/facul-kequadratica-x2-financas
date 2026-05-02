import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  CreditCard, 
  Sparkles, 
  Settings,
  MoreHorizontal,
  Moon,
  LogOut,
  CalendarIcon,
  Bell,
  Plus,
  Minus,
  Receipt
} from "lucide-react";
import { XMark } from "./XMark";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Resumo", icon: LayoutDashboard },
  { href: "/fluxo-caixa", label: "Fluxo de caixa", icon: ArrowLeftRight },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/despesas", label: "Despesas", icon: Receipt },
  { href: "/cartoes", label: "Cartões", icon: CreditCard },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { theme, toggle } = useTheme();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [hasUnread, setHasUnread] = useState(true);

  const getPageTitle = () => {
    const item = NAV_ITEMS.find((nav) => nav.href === location);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 relative">
            <XMark />
          </div>
          <div className="w-px h-10 bg-border/50 mx-1" />
          <div className="flex flex-col">
            <span className="font-title font-bold text-lg leading-tight">
              <span className="text-foreground">Kê</span><span className="text-primary">Quadrática</span>
            </span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Inteligência Financeira</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive 
                      ? "bg-primary/20 text-primary border-l-4 border-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-4 border-transparent"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-border">
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atalhos</span>
            <div className="mt-2 space-y-1">
              <button onClick={() => setLocation("/fluxo-caixa")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted text-primary">
                <Plus className="w-4 h-4" /> Nova Entrada
              </button>
              <button onClick={() => setLocation("/fluxo-caixa")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted text-destructive">
                <Minus className="w-4 h-4" /> Nova Despesa
              </button>
              <button onClick={() => setLocation("/fluxo-caixa")} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted text-foreground">
                <ArrowLeftRight className="w-4 h-4" /> Transferências
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Moon className="w-4 h-4" />
              <span>Modo dark</span>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggle} />
          </div>
          
          <button 
            onClick={() => setLocation("/login")}
            className="flex items-center gap-2 px-2 py-2 mb-4 w-full rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
          
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary font-bold">MA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Mikaely Alves</span>
              <span className="text-xs text-primary font-medium">Premium</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground font-title">{getPageTitle()}</h1>
            <div className="hidden sm:flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd MMM", { locale: ptBR })} - {format(dateRange.to, "dd MMM", { locale: ptBR })}
                        </>
                      ) : (
                        format(dateRange.from, "dd MMM", { locale: ptBR })
                      )
                    ) : (
                      "05 Abr - 05 Mai"
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h4 className="font-semibold">Alertas</h4>
                  <button onClick={() => setHasUnread(false)} className="text-xs text-primary hover:underline">Marcar como lido</button>
                </div>
                <div className="py-2">
                  <div className="px-4 py-3 border-l-4 border-primary hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">Meta 'Viagem' atingiu 80%</p>
                    <p className="text-xs text-muted-foreground mt-1">há 2h</p>
                  </div>
                  <div className="px-4 py-3 border-l-4 border-yellow-500 hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">Despesa acima da média mensal detectada</p>
                    <p className="text-xs text-muted-foreground mt-1">há 5h</p>
                  </div>
                  <div className="px-4 py-3 border-l-4 border-blue-500 hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">Nova transação adicionada com sucesso</p>
                    <p className="text-xs text-muted-foreground mt-1">há 1d</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">Mikaely</span>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">MA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-8 h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-sidebar border-t border-border flex items-center justify-around px-2 z-40">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
        <Link href="/configuracoes">
          <div className="flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer">
            <MoreHorizontal className={cn("w-5 h-5", location === "/configuracoes" ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-[10px] font-medium", location === "/configuracoes" ? "text-primary" : "text-muted-foreground")}>
              Mais
            </span>
          </div>
        </Link>
      </nav>
    </div>
  );
}
