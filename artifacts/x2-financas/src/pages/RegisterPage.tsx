import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const steps = ["Dados Pessoais", "Segurança", "Confirmação"];

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) setStep(s => s + 1);
    else setLocation("/dashboard");
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side — Brand */}
      <div className="relative hidden md:flex flex-1 flex-col justify-between px-14 lg:px-20 py-10 bg-gradient-to-b from-[#d6f0da] via-[#c2e6c9] to-[#a8d5b0] overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative w-11 h-11 flex-shrink-0">
            <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="4" x2="32" y2="32" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
              <line x1="32" y1="4" x2="4" y2="32" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <span style={{ position:"absolute", top:0, right:"-3px", color:"#57BC67", fontWeight:700, fontSize:"11px", lineHeight:1 }}>2</span>
          </div>
          <div>
            <div className="font-bold text-2xl tracking-tight text-gray-900">
              <span className="text-[#57BC67]">X²</span> KêQuadrática
            </div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">Inteligência Financeira</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[34px] font-bold leading-tight text-[#2e7d32]"
          >
            Comece sua jornada<br />
            financeira hoje²
          </motion.h2>

          <div className="space-y-4">
            {["Controle total das suas finanças", "Metas e investimentos em um lugar", "Insights inteligentes com IA"].map((txt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-[#57BC67] flex-shrink-0" />
                <span className="text-gray-700 font-medium">{txt}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="flex justify-start items-end gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.svg width="90" height="90" viewBox="0 0 100 100" fill="none"
            animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <rect x="18" y="18" width="64" height="64" rx="12" fill="#57BC67" />
            <circle cx="38" cy="44" r="6" fill="white" />
            <circle cx="62" cy="44" r="6" fill="white" />
            <path d="M 36 64 Q 50 76 64 64" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      </div>

      {/* Right side — Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-2">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= step ? "bg-[#57BC67] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${i <= step ? "text-[#57BC67]" : "text-gray-400"}`}>
                  {label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-px w-8 mx-1 ${i < step ? "bg-[#57BC67]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-1 pb-4 px-0 text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {step === 0 && "Criar conta"}
                {step === 1 && "Defina sua senha"}
                {step === 2 && "Confirmar cadastro"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <motion.form
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleNext}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Nome completo*</Label>
                      <Input
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Seu nome"
                        required
                        autoComplete="name"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">E-mail*</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="seu@email.com"
                        required
                        autoComplete="email"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Telefone</Label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="(00) 00000-0000"
                        autoComplete="tel"
                        className="border-gray-300"
                      />
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Senha*</Label>
                      <Input
                        type="password"
                        value={form.password}
                        onChange={set("password")}
                        placeholder="Mínimo 8 caracteres"
                        required
                        autoComplete="new-password"
                        className="border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Confirmar senha*</Label>
                      <Input
                        type="password"
                        value={form.confirm}
                        onChange={set("confirm")}
                        placeholder="Repita a senha"
                        required
                        autoComplete="new-password"
                        className="border-gray-300"
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <div className="py-4 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#57BC67]/10 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-[#57BC67]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Tudo certo, {form.name || "usuário"}!</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Clique em "Criar conta" para acessar o dashboard.
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#57BC67] text-white hover:bg-[#4aab5a] h-12 font-bold mt-2"
                >
                  {step < steps.length - 1 ? "Continuar" : "Criar conta"}
                </Button>
              </motion.form>

              <div className="mt-5 text-center">
                <p className="text-sm text-gray-500">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-[#57BC67] font-semibold hover:underline">
                    Entrar
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
