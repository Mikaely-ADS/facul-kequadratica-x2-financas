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
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7 L33 33" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
                <path d="M33 7 L7 33" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
              </svg>
              <span className="absolute -top-1.5 -right-1.5 text-[#57BC67] font-bold text-[10px] leading-none">2</span>
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
              <line x1="40" y1="40" x2="340" y2="340" stroke="#57BC67" strokeWidth="70" strokeLinecap="round"/>
              <line x1="340" y1="40" x2="40" y2="340" stroke="#57BC67" strokeWidth="70" strokeLinecap="round"/>
              <circle cx="316" cy="60" r="44" fill="#1A1A1A"/>
              <text x="316" y="78" textAnchor="middle" fill="#57BC67" fontSize="52" fontWeight="bold" fontFamily="'Montserrat', 'Arial', sans-serif">2</text>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
