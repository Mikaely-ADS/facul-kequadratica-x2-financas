import React from "react";

export function XMark({ className }: { className?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="x-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7FD18A" />
          <stop offset="100%" stopColor="#2F7D44" />
        </linearGradient>
      </defs>
      <text
        x="20"
        y="80"
        fontFamily="Montserrat, sans-serif"
        fontSize="80"
        fontWeight="bold"
        fill="url(#x-grad)"
        letterSpacing="-5"
      >
        X
      </text>
      <text
        x="75"
        y="40"
        fontFamily="Montserrat, sans-serif"
        fontSize="40"
        fontWeight="bold"
        fill="url(#x-grad)"
      >
        2
      </text>
    </svg>
  );
}
