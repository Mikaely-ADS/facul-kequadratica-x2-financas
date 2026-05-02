import React from "react";
import { Link } from "wouter";
import { XMark } from "@/components/XMark";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white relative overflow-hidden flex items-center">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </pattern>
            <pattern id="diagonal" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            </pattern>
            <pattern id="diagonal-reverse" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#diagonal)" />
          <rect width="100%" height="100%" fill="url(#diagonal-reverse)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8">
              <XMark />
            </div>
            <div className="flex items-center gap-1 font-title font-bold">
              <span>Kê</span><span className="text-[#57BC67]">Quadrática</span>
            </div>
          </div>

          <div className="space-y-2 text-[18px] sm:text-[20px] font-light text-white/90 leading-tight">
            <p>Transformando gastos</p>
            <p>em decisões</p>
            <p>inteligentes</p>
          </div>

          <div className="pt-4">
            <h1 className="text-[64px] font-bold font-title leading-none">
              X²<br />
              Finanças
            </h1>
            <p className="text-[#57BC67]/80 text-sm mt-2 font-mono">#kêx²</p>
          </div>

          <div className="pt-8 flex flex-col items-start gap-4">
            <Link href="/login" className="bg-[#57BC67] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#57BC67]/90 transition-colors">
              Começar agora
            </Link>
            <Link href="/login" className="text-[#57BC67] text-sm font-medium hover:underline">
              Já tem uma conta? Clique aqui
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center">
          <div className="w-[300px] h-[300px]">
            <XMark />
          </div>
        </div>
      </div>
    </div>
  );
}