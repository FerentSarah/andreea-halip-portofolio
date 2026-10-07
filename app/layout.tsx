import './globals.css';
import React from 'react';
import { Space_Mono, Special_Elite } from 'next/font/google';
import Header from '../components/Header';
import Cursor from '../components/Cursor';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

const specialElite = Special_Elite({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-special-elite',
});

export const metadata = {
  title: 'Andreea Halip — Architect',
  description: 'Andreea Halip is an architect working across residential, cultural, landscape, and housing projects.',
  openGraph: {
    title: 'Andreea Halip — Architect',
    description: 'Architecture portfolio and project studies by Andreea Halip.',
    type: 'website',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${specialElite.variable}`}>
      <body>
        <Header />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
