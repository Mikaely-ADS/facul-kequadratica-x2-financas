import React from "react";

export function XMark({ className }: { className?: string }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bold Green X */}
      <path d="M10 10 L40 40 M40 10 L10 40" stroke="#57BC67" strokeWidth="8" strokeLinecap="square" strokeLinejoin="round" fill="none"/>
      {/* Superscript 2 */}
      <text x="35" y="15" fontFamily="Montserrat, sans-serif" fontSize="14" fontWeight="bold" fill="#57BC67">2</text>
    </svg>
  );
}