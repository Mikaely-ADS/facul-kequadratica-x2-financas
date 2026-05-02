import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative overflow-hidden flex items-center">
      {/* Grid Background */}
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
        {/* Left column */}
        <div className="flex flex-col justify-center space-y-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* X² icon */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="5" y1="5" x2="31" y2="31" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
                <line x1="31" y1="5" x2="5" y2="31" stroke="#57BC67" strokeWidth="5" strokeLinecap="round"/>
              </svg>
              <span className="absolute -top-1 -right-2 text-[#57BC67] font-bold text-[11px] leading-none">2</span>
            </div>
            <div className="font-bold text-xl tracking-wide">
              <span className="text-white">Kê</span><span className="text-[#57BC67]">Quadrática</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1 text-[22px] sm:text-[26px] font-light text-white/80 leading-snug">
            <p>Transformando gastos</p>
            <p>em decisões</p>
            <p>inteligentes</p>
          </div>

          {/* Headline */}
          <div>
            <h1 className="font-bold" style={{ fontFamily: "'Montserrat', sans-serif", lineHeight: 1.05 }}>
              <span className="text-[72px]">X</span><span className="text-[42px] font-bold" style={{ verticalAlign: 'super', fontSize: '42px', lineHeight: 1 }}>²</span>
              <br />
              <span className="text-[72px]">Finanças</span>
            </h1>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-start gap-4">
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

            <Link
              href="/login"
              className="text-sm font-semibold text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
            >
              Já tem uma conta? <span className="text-[#57BC67]">Clique aqui</span>
            </Link>
          </div>
        </div>

        {/* Right column — X² illustration */}
        <div className="hidden md:flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <svg width="380" height="380" viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Main X bars */}
              <line x1="40" y1="40" x2="340" y2="340" stroke="#57BC67" strokeWidth="70" strokeLinecap="round"/>
              <line x1="340" y1="40" x2="40" y2="340" stroke="#57BC67" strokeWidth="70" strokeLinecap="round"/>
              {/* Superscript 2 — top-right, clearly visible */}
              <circle cx="316" cy="60" r="44" fill="#1A1A1A"/>
              <text
                x="316"
                y="78"
                textAnchor="middle"
                fill="#57BC67"
                fontSize="52"
                fontWeight="bold"
                fontFamily="'Montserrat', 'Arial', sans-serif"
              >2</text>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
