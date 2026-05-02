import React from "react";
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";

import { AppShell } from "@/components/AppShell";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CashflowPage from "@/pages/CashflowPage";
import GoalsPage from "@/pages/GoalsPage";
import CardsPage from "@/pages/CardsPage";
import InsightsPage from "@/pages/InsightsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      {/* Routes wrapped in AppShell */}
      <Route path="/">
        <AppShell><DashboardPage /></AppShell>
      </Route>
      <Route path="/fluxo-caixa">
        <AppShell><CashflowPage /></AppShell>
      </Route>
      <Route path="/metas">
        <AppShell><GoalsPage /></AppShell>
      </Route>
      <Route path="/cartoes">
        <AppShell><CardsPage /></AppShell>
      </Route>
      <Route path="/insights">
        <AppShell><InsightsPage /></AppShell>
      </Route>
      <Route path="/configuracoes">
        <AppShell><SettingsPage /></AppShell>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
