'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type TouchEvent } from 'react';
import type { Project } from '../../../content/projects';

export default function ProjectDetailView({ project }: { project: Project }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [exitIndex, setExitIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef<number | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const touchStartRef = useRef<number | null>(null);
  const didSwipeRef = useRef(false);
  const sheets = project.sheets;
  const activeSheet = sheets[activeIndex];

  useEffect(() => {
    preloadedImagesRef.current = sheets.map((sheet) => {
      const preload = new window.Image();
      preload.decoding = 'async';
      preload.src = sheet.src;
      void preload.decode().catch(() => undefined);
      return preload;
    });

    return () => {
      preloadedImagesRef.current = [];
    };
  }, [sheets]);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current);
  }, []);

  const returnToProjects = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
    navigationTimerRef.current = window.setTimeout(() => router.push('/projects'), delay);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        changeSheet((activeIndex + 1) % sheets.length);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        changeSheet((activeIndex - 1 + sheets.length) % sheets.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, sheets.length]);

  const changeSheet = (nextIndex: number) => {
    if (nextIndex === activeIndex || sheets.length < 2) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    setDirection(nextIndex > activeIndex || (activeIndex === sheets.length - 1 && nextIndex === 0) ? 1 : -1);
    setExitIndex(activeIndex);
    setActiveIndex(nextIndex);
    setIsTransitioning(true);
    timerRef.current = window.setTimeout(() => {
      setExitIndex(null);
      setIsTransitioning(false);
    }, 400);
  };

  const handleDrawingClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const isRightSide = event.clientX >= bounds.left + bounds.width / 2;
    changeSheet((activeIndex + (isRightSide ? 1 : -1) + sheets.length) % sheets.length);
  };

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    touchStartRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    if (touchStartRef.current === null) return;
    const distance = event.changedTouches[0]?.clientX - touchStartRef.current;
    touchStartRef.current = null;

    if (Math.abs(distance) < 40) return;
    didSwipeRef.current = true;
    changeSheet((activeIndex + (distance < 0 ? 1 : -1) + sheets.length) % sheets.length);
  };

  const accentStyle = { '--project-accent': project.accent } as CSSProperties;

  return (
    <main className={`project-detail-stage ${isLeaving ? 'is-leaving' : ''}`} style={accentStyle}>
      <p className="project-detail-typology">{project.typology}</p>
      <h1 className="project-detail-name">{project.title}</h1>
      <p className="project-detail-description">{project.description}</p>
      <p className="project-detail-location">
        <span>{project.location}</span>
        <span>{project.year}</span>
      </p>

      {activeSheet && (
        <button
          className="project-detail-drawing hot-target"
          type="button"
          aria-label={activeSheet.alt}
          onClick={handleDrawingClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {exitIndex !== null && sheets[exitIndex] && (
            <Image
              className={`project-detail-image project-detail-image-exit ${direction > 0 ? 'to-left' : 'to-right'}`}
              src={sheets[exitIndex].src}
              alt=""
              fill
              aria-hidden="true"
              unoptimized
              sizes="(max-width: 820px) 100vw, 70vw"
            />
          )}
          <Image
            key={activeSheet.src}
            className={`project-detail-image ${isTransitioning ? direction > 0 ? 'from-right' : 'from-left' : ''}`}
            src={activeSheet.src}
            alt={activeSheet.alt}
            fill
            priority={activeIndex === 0}
            unoptimized
            sizes="(max-width: 820px) 100vw, 70vw"
          />
        </button>
      )}

      {sheets.length > 0 && (
        <nav className="project-sheet-navigation" aria-label="Project sheets">
          {activeIndex > 0 && (
            <button type="button" className="project-sheet-previous hot-target" onClick={() => changeSheet(activeIndex - 1)}>
              PREV
            </button>
          )}
          <span className="project-sheet-count">{String(activeIndex + 1).padStart(2, '0')} / {String(sheets.length).padStart(2, '0')}</span>
          <div className="project-sheet-dots">
            {sheets.map((sheet, index) => (
              <button
                key={sheet.src}
                type="button"
                className={`project-sheet-dot hot-target ${index === activeIndex ? 'active' : ''}`}
                aria-label={`Show sheet ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => changeSheet(index)}
              />
            ))}
          </div>
          <button type="button" className="project-sheet-next hot-target" onClick={() => changeSheet((activeIndex + 1) % sheets.length)}>
            NEXT
          </button>
        </nav>
      )}

      <button
        type="button"
        className="project-detail-back-to-grid hot-target"
        aria-label="Back to projects"
        onClick={returnToProjects}
        disabled={isLeaving}
      >
        ←
      </button>
    </main>
  );
}