import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/dashboard");
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side — Brand */}
      <div className="relative hidden md:flex flex-1 flex-col justify-between px-14 lg:px-20 py-10 bg-gradient-to-b from-[#d6f0da] via-[#c2e6c9] to-[#a8d5b0] overflow-hidden">
        {/* Logo top-left */}
        <div className="flex items-center gap-4">
          <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="4" x2="32" y2="32" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
            <line x1="32" y1="4" x2="4" y2="32" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
            <text x="22" y="14" fill="#57BC67" fontSize="11" fontWeight="bold" fontFamily="sans-serif">²</text>
          </svg>
          <div>
            <div className="font-bold text-2xl tracking-tight text-gray-900">
              KêQuadrática
            </div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">Inteligência Financeira</div>
          </div>
        </div>

        {/* Center tagline */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[34px] font-bold leading-tight text-[#2e7d32]"
          >
            Inteligência financeira<br />
            elevada ao quadrado²
          </motion.h2>
        </div>

        {/* Animated robots */}
        <motion.div
          className="flex justify-start items-end gap-4 pb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <motion.svg
            width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <rect x="18" y="18" width="64" height="64" rx="12" fill="#57BC67" />
            <circle cx="38" cy="44" r="6" fill="white" />
            <circle cx="62" cy="44" r="6" fill="white" />
            <path d="M 36 64 Q 50 76 64 64" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 82 38 H 94 V 62 H 82" stroke="#57BC67" strokeWidth="4" strokeLinecap="round" />
          </motion.svg>

          <motion.svg
            width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.4 }}
          >
            <rect x="18" y="18" width="64" height="64" rx="12" fill="#2F7D44" />
            <circle cx="38" cy="44" r="6" fill="white" />
            <circle cx="62" cy="44" r="6" fill="white" />
            <path d="M 36 64 Q 50 76 64 64" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 6 38 H 18 V 62 H 6" stroke="#2F7D44" strokeWidth="4" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Right side — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 justify-center md:hidden mb-6">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="4" x2="32" y2="32" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
              <line x1="32" y1="4" x2="4" y2="32" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <span className="text-2xl font-bold text-gray-900">KêQuadrática</span>
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
                    autoComplete="email"
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
                    autoComplete="current-password"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#57BC67] text-white hover:bg-[#4aab5a] text-md h-12 mt-6 font-bold"
                >
                  Entrar
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-gray-400 max-w-xs mx-auto">
                <p>Seus dados estão protegidos. Nunca compartilhamos sua senha.</p>
              </div>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-500">
                  Não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-[#57BC67] font-semibold hover:underline">
                    Criar conta
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
