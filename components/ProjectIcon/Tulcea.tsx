import React from 'react';

export default function Tulcea(): JSX.Element {
  return (
    <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      <path d="M8,60 Q40,40 70,58 T150,50" stroke="currentColor" strokeWidth="1" fill="none"/>
      <path d="M8,75 Q45,90 90,72 T150,80" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.7"/>
      <path d="M8,95 Q50,80 95,100 T150,92" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.5"/>
      <rect x="55" y="95" width="55" height="45" fill="none" stroke="currentColor" strokeWidth="1"/>
      <path d="M55,95 L82,72 L110,95" fill="none" stroke="currentColor" strokeWidth="1"/>
      <circle cx="30" cy="120" r="2" fill="currentColor"/>
      <circle cx="128" cy="118" r="2" fill="currentColor"/>
      <path d="M30,122 L30,140 M128,120 L128,140" stroke="currentColor" strokeWidth="0.6"/>
    </svg>
  );
}
