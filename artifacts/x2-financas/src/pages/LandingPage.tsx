import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-8 md:px-16 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-screen py-12">
        <div className="flex flex-col justify-center space-y-10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8 L40 40" stroke="#57BC67" strokeWidth="6" strokeLinecap="round"/>
                <path d="M40 8 L8 40" stroke="#57BC67" strokeWidth="6" strokeLinecap="round"/>
              </svg>
              <span className="absolute -top-2 -right-1 text-[#57BC67] font-bold text-[9px] leading-none">2</span>
            </div>
            <div className="font-bold text-xl tracking-wide">
              <span className="text-white">Kê</span><span className="text-[#57BC67]">Quadrática</span>
            </div>
          </div>

          <div className="space-y-1 text-[22px] sm:text-[26px] font-light text-white/80 leading-snug">
            <p>Transformando gastos</p>
            <p>em decisões</p>
            <p>inteligentes</p>
          </div>

          <div>
            <h1 className="font-bold" style={{ fontFamily: "'Montserrat', sans-serif", lineHeight: 1.05 }}>
              <span className="text-[72px]">X</span><span className="text-[42px] font-bold" style={{ verticalAlign: 'super', fontSize: '42px', lineHeight: 1 }}>²</span>
              <br />
              <span className="text-[72px]">Finanças</span>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-3">
            <Link href="/login">
              <motion.button
                className="bg-[#57BC67] text-white px-10 py-3.5 rounded-full font-bold text-lg cursor-pointer"
                whileHover={{ scale: 1.04, backgroundColor: "#4aab5a" }}
                whileTap={{ scale: 0.96 }}
                animate={{ boxShadow: ["0 0 0px #57BC67", "0 0 22px #57BC6799", "0 0 0px #57BC67"] }}
                transition={{ boxShadow: { repeat: Infinity, duration: 2.4, ease: "easeInOut" }, scale: { duration: 0.15 } }}
              >
                Começar agora
              </motion.button>
            </Link>

            <Link href="/login" className="text-sm font-semibold text-white/70 hover:text-white transition-colors">
              Já tem uma conta? <span className="text-[#57BC67]">Clique aqui</span>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center items-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <svg width="380" height="380" viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="42" y1="42" x2="338" y2="338" stroke="#57BC67" strokeWidth="72" strokeLinecap="round"/>
              <line x1="338" y1="42" x2="42" y2="338" stroke="#57BC67" strokeWidth="72" strokeLinecap="round"/>
              <rect x="286" y="38" width="54" height="54" rx="18" fill="#1A1A1A"/>
              <text x="313" y="73" textAnchor="middle" fill="#57BC67" fontSize="42" fontWeight="bold" fontFamily="'Montserrat', 'Arial', sans-serif">2</text>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
