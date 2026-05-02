import React from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  CreditCard, 
  Sparkles, 
  Settings,
  MoreHorizontal,
  Moon
} from "lucide-react";
import { XMark } from "./XMark";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Resumo", icon: LayoutDashboard },
  { href: "/fluxo-caixa", label: "Fluxo de caixa", icon: ArrowLeftRight },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/cartoes", label: "Cartões", icon: CreditCard },
  { href: "/insights", label: "Insights", icon: Sparkles },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const getPageTitle = () => {
    const item = NAV_ITEMS.find((nav) => nav.href === location);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10">
            <XMark />
          </div>
          <span className="font-title font-bold text-xl text-foreground">KêQuadrática</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
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
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Moon className="w-4 h-4" />
              <span>Modo dark</span>
            </div>
            <Switch checked={true} disabled />
          </div>
          
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary font-bold">MA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">Mikauly Alves</span>
              <span className="text-xs text-primary font-medium">Premium</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground font-title">{getPageTitle()}</h1>
            <div className="hidden sm:flex items-center px-2 py-1 rounded bg-muted text-xs font-medium text-muted-foreground">
              Este Mês
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">Mikauly</span>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">MA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
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

      {/* Mobile Bottom Tab Bar */}
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
