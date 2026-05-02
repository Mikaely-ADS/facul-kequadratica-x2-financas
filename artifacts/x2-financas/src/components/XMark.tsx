import React from "react";

export function XMark({ className }: { className?: string }) {
  return (
    <div className={`relative flex-shrink-0 ${className ?? ""}`} style={{ width: "100%", height: "100%" }}>
      <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 10 L40 40 M40 10 L10 40" stroke="#57BC67" strokeWidth="8" strokeLinecap="round" fill="none"/>
      </svg>
      <span style={{ position: "absolute", top: "-4px", right: "-2px", color: "#57BC67", fontWeight: 700, fontSize: "28%", lineHeight: 1, fontFamily: "Montserrat, sans-serif" }}>2</span>
    </div>
  );
}
