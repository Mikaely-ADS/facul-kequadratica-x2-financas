import React from "react";
import { Link, useLocation } from "wouter";
import { XMark } from "@/components/XMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="light bg-white min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side - Brand */}
      <div className="relative hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] overflow-hidden border-r border-gray-200">
        
        <div className="absolute top-8 left-12 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <XMark />
            </div>
            <span className="font-title font-bold text-xl text-gray-900">KêQuadrática</span>
          </div>
          <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Inteligência Financeira</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg mt-16">
          <h2 className="text-[32px] font-bold font-title tracking-tight text-[#57BC67]">
            Inteligencia financeira<br />
            elevada ao quadrado²
          </h2>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="10" fill="#57BC67" />
            <circle cx="40" cy="45" r="5" fill="white" />
            <circle cx="60" cy="45" r="5" fill="white" />
            <path d="M 40 65 Q 50 75 60 65" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M 80 40 H 90 V 60 H 80" stroke="#57BC67" strokeWidth="4" />
          </svg>
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="10" fill="#2F7D44" />
            <circle cx="40" cy="45" r="5" fill="white" />
            <circle cx="60" cy="45" r="5" fill="white" />
            <path d="M 40 65 Q 50 75 60 65" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M 10 40 H 20 V 60 H 10" stroke="#2F7D44" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 justify-center md:hidden mb-8">
            <div className="w-12 h-12">
              <XMark />
            </div>
            <span className="text-2xl font-bold font-title text-gray-900">KêQuadrática</span>
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1 pb-6 px-0 text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">Login Cliente</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">E-mail*</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    required 
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Senha*</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Digite sua senha"
                    required 
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full bg-[#57BC67] text-white hover:bg-[#57BC67]/90 text-md h-12 mt-6 font-bold">
                  Submit
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-500 max-w-xs mx-auto">
                <p>Seu nome de perfil no Canva não será compartilhado. Nunca envie senhas.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}