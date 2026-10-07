"use client";
import { useEffect, useState } from 'react';

export default function Cursor() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    if (isReducedMotion) {
      return () => mediaQuery.removeEventListener('change', updateMotionPreference);
    }

    const cur = document.createElement('div');
    cur.id = 'cur';
    cur.innerHTML = '<div id="cur-dot"></div><span id="cur-label">VIEW</span>';
    document.body.appendChild(cur);

    const move = (event: MouseEvent) => {
      cur.style.left = `${event.clientX}px`;
      cur.style.top = `${event.clientY}px`;
    };

    const setView = (target: HTMLElement | null, active: boolean) => {
      if (!target) return;
      target.classList.toggle('view', active);
    };

    const interactiveTargets = document.querySelectorAll('.project-icon-box, .menu-item, .back-arrow, .project-card');

    interactiveTargets.forEach((element) => {
      element.addEventListener('mouseenter', () => setView(cur, true));
      element.addEventListener('mouseleave', () => setView(cur, false));
    });

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', () => cur.classList.add('pulse'));
    window.addEventListener('mouseup', () => cur.classList.remove('pulse'));

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', () => cur.classList.add('pulse'));
      window.removeEventListener('mouseup', () => cur.classList.remove('pulse'));
      cur.remove();
    };
  }, [isReducedMotion]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  if (isReducedMotion) {
    return null;
  }

  return null;
}
