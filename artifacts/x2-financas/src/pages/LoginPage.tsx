import React from "react";
import { Link, useLocation } from "wouter";
import { XMark } from "@/components/XMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-background">
      {/* Left side - Brand */}
      <div className="relative hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 bg-card overflow-hidden border-r border-border">
        {/* SVG Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16">
              <XMark />
            </div>
            <h1 className="text-4xl font-bold font-title text-foreground">KêQuadrática</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-bold font-title tracking-tight text-white">
              Inteligência financeira <br />
              <span className="text-primary">elevada ao quadrado²</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Transformando gastos em decisões inteligentes.
            </p>
          </div>

          <div className="pt-12 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">by KêQuadrática</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 justify-center md:hidden mb-8">
            <div className="w-12 h-12">
              <XMark />
            </div>
            <span className="text-2xl font-bold font-title">KêQuadrática</span>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Login Cliente</CardTitle>
              <CardDescription className="text-center">
                Acesse sua conta para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail*</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="mikauly@exemplo.com" 
                    required 
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha*</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="bg-background"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-md h-12 mt-6 font-semibold">
                  Entrar na plataforma
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <span className="text-muted-foreground">Não tem uma conta? </span>
                <a href="#" className="text-primary font-medium hover:underline">
                  Cadastre-se
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
