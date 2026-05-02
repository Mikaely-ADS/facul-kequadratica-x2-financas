import React from "react";

export function XMark({ className }: { className?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left arrow pointing right (>) shape */}
      <path d="M4 6 L16 20 L4 34" stroke="#57BC67" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Right arrow pointing left (<) shape — together they form X */}
      <path d="M36 6 L24 20 L36 34" stroke="#57BC67" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Superscript 2 */}
      <text x="28" y="11" fontFamily="Montserrat, sans-serif" fontSize="10" fontWeight="bold" fill="#57BC67">2</text>
    </svg>
  );
}
