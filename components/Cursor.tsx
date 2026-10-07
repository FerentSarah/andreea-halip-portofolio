"use client";

import { useEffect, useState } from 'react';

export default function Cursor() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');

    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    if (mediaQuery.matches || pointerQuery.matches) {
      return () => mediaQuery.removeEventListener('change', updateMotionPreference);
    }

    const cur = document.createElement('div');
    cur.id = 'cur';
    cur.innerHTML = '<div id="cur-dot"></div>';
    document.body.appendChild(cur);

    const handleMove = (event: MouseEvent) => {
      cur.style.left = `${event.clientX}px`;
      cur.style.top = `${event.clientY}px`;
      const hot = !!(event.target as HTMLElement | null)?.closest?.('.icon-box, .menu-item, .back-arrow, .hot-target');
      cur.classList.toggle('hot', hot);
    };

    const handleMouseDown = () => cur.classList.add('pulse');
    const handleMouseUp = () => cur.classList.remove('pulse');

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cur.remove();
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  if (isReducedMotion) {
    return null;
  }

  return null;
}
