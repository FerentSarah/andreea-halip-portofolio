import React from 'react';

export default function Mures(): JSX.Element {
  return (
    <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="140" height="140" fill="none" stroke="currentColor" strokeWidth="1"/>
      <path d="M10,90 Q45,60 80,95 T150,85" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M20,150 L20,70 M20,70 L35,55" stroke="currentColor" strokeWidth="0.8" fill="none"/>
      <path d="M120,150 L120,60 Q120,45 135,40" stroke="currentColor" strokeWidth="0.8" fill="none"/>
      <circle cx="80" cy="55" r="14" fill="none" stroke="currentColor" strokeWidth="0.7"/>
      <path d="M65,150 Q80,130 95,150" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.6"/>
    </svg>
  );
}
