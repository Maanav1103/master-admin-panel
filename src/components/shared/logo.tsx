import * as React from "react";

export const Logo = ({ size = 48 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--primary)" />
        <stop offset="100%" stopColor="var(--secondary)" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="22" fill="url(#logo-grad)" />
    <polygon points="24,8 38,32 10,32" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" strokeOpacity="0.9" />
    <circle cx="24" cy="24" r="5" fill="white" fillOpacity="0.95" />
    <circle cx="24" cy="8" r="2.5" fill="white" fillOpacity="0.6" />
    <circle cx="38" cy="32" r="2.5" fill="white" fillOpacity="0.6" />
    <circle cx="10" cy="32" r="2.5" fill="white" fillOpacity="0.6" />
  </svg>
);