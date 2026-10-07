"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

const links = [
  { href: '/projects', label: 'PROJECTS' },
  { href: '/resume', label: 'RESUME' },
  { href: '/contact', label: 'CONTACT' },
] as const;

const titleMap = {
  projects: 'PROJECTS',
  resume: 'RESUME',
  contact: 'CONTACT',
} as const;

function clampCurrentPath(pathname: string) {
  if (pathname === '/') return 'home';
  if (pathname === '/projects' || pathname.startsWith('/projects/')) return 'projects';
  if (pathname === '/resume') return 'resume';
  if (pathname === '/contact') return 'contact';
  return 'home';
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const current = clampCurrentPath(pathname);
  const pageTitleRef = useRef<HTMLHeadingElement | null>(null);
  const backArrowRef = useRef<HTMLAnchorElement | null>(null);
  const menuRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [menuState, setMenuState] = useState<'home' | 'page'>('home');
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const pageTitle = pageTitleRef.current;
    const backArrow = backArrowRef.current;

    if (current === 'home') {
      setTransitioning(false);
      root.classList.remove('compact', 'snap');
      if (pageTitle) {
        pageTitle.textContent = '';
        pageTitle.style.transition = 'none';
        pageTitle.style.transform = 'translate(0, 0)';
        pageTitle.style.opacity = '0';
      }
      if (backArrow) {
        backArrow.classList.remove('show');
      }
      setMenuState('home');
      return;
    }

    root.classList.add('compact');
    if (current === 'projects') {
      root.classList.add('snap');
    }

    const label = titleMap[current as keyof typeof titleMap];
    if (pageTitle) {
      pageTitle.textContent = label;
      pageTitle.style.transition = 'none';
      pageTitle.style.opacity = '1';
      pageTitle.style.transform = 'translate(0, 0)';
    }

    if (backArrow) {
      backArrow.classList.add('show');
    }

    setMenuState('page');
  }, [current]);

  const getHomePosition = (link: HTMLAnchorElement) => {
    const root = document.documentElement;
    const nav = document.querySelector('.menu') as HTMLElement | null;
    const headerHome = parseFloat(getComputedStyle(root).getPropertyValue('--header-home'));
    const TITLE_TOP = 46;
    const TITLE_LEFT = 40;

    return {
      left: root.clientWidth - 40 - link.offsetWidth,
      top: (headerHome - (nav?.offsetHeight ?? 0)) / 2 + link.offsetTop,
      titleTop: TITLE_TOP,
      titleLeft: TITLE_LEFT,
    };
  };

  const fromTransform = (link: HTMLAnchorElement) => {
    const { left, top, titleLeft, titleTop } = getHomePosition(link);
    return `translate(${left - titleLeft}px, ${top - titleTop}px)`;
  };

  const triggerPage = (event: MouseEvent<HTMLAnchorElement>, page: 'projects' | 'resume' | 'contact') => {
    if (current !== 'home' || transitioning) return;

    event.preventDefault();
    setTransitioning(true);

    const targetHref = page === 'projects' ? '/projects' : page === 'resume' ? '/resume' : '/contact';
    const activeLink = menuRefs.current[links.findIndex((link) => link.href === targetHref)];
    const others = menuRefs.current.filter((link) => link !== activeLink);
    const pageTitle = pageTitleRef.current;

    if (!activeLink || !pageTitle) {
      router.push(targetHref);
      return;
    }

    pageTitle.textContent = titleMap[page];
    pageTitle.style.transition = 'none';
    pageTitle.style.transform = fromTransform(activeLink);
    pageTitle.style.opacity = '1';

    activeLink.classList.add('hide');
    others.forEach((item) => item?.classList.add('exit'));

    document.documentElement.classList.add('compact');
    if (page === 'projects') {
      document.documentElement.classList.add('snap');
    }

    requestAnimationFrame(() => {
      pageTitle.style.transition = 'transform 0.7s cubic-bezier(.22,1,.36,1)';
      pageTitle.style.transform = 'translate(0, 0)';
      const backArrow = backArrowRef.current;
      if (backArrow) {
        backArrow.classList.add('show');
      }
    });

    router.push(targetHref);
  };

  const triggerHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (current === 'home' || transitioning) return;

    event.preventDefault();
    setTransitioning(true);

    const page = current;
    const activeLink = menuRefs.current[links.findIndex((link) => link.href === (page === 'projects' ? '/projects' : page === 'resume' ? '/resume' : '/contact'))];
    const others = menuRefs.current.filter((item) => item !== activeLink);
    const pageTitle = pageTitleRef.current;

    if (pageTitle) {
      pageTitle.style.transition = 'transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.3s ease 0.25s';
      if (activeLink) {
        pageTitle.style.transform = fromTransform(activeLink);
      }
      pageTitle.style.opacity = '0';
    }

    const backArrow = backArrowRef.current;
    if (backArrow) {
      backArrow.classList.remove('show');
    }

    document.documentElement.classList.remove('compact', 'snap');
    activeLink?.classList.remove('hide');
    others.forEach((item) => item?.classList.remove('exit'));

    if (pageTitle) {
      pageTitle.style.transition = 'none';
    }
    router.push('/');
  };

  return (
    <>
      <header id="header" className={`site-header ${current === 'home' ? '' : 'compact'} ${current === 'projects' ? 'scrolled' : ''}`}>
        <Link href="/" className="site-name" aria-label="Andreea Halip home">
          ANDREEA HALIP
        </Link>
        <div className="mark" aria-hidden="true" />

        <nav className={`menu ${current !== 'home' ? 'menu--hidden' : ''}`} aria-label="Main navigation">
          {links.map((link) => {
            const isCurrent = pathname === link.href || (link.href === '/projects' && current === 'projects');
            const isVisible = current === 'home' || link.href === '/projects';

            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(node) => {
                  menuRefs.current[links.indexOf(link)] = node;
                }}
                onClick={(event) => {
                  if (current === 'home') {
                    triggerPage(event as MouseEvent<HTMLAnchorElement>, link.href === '/projects' ? 'projects' : link.href === '/resume' ? 'resume' : 'contact');
                  }
                }}
                className={`menu-item ${isCurrent ? 'current' : ''} ${isVisible ? '' : 'exit'}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <h1 ref={pageTitleRef} className="page-title" aria-live="polite" />

      {current !== 'home' ? (
        <Link href="/" className="back-arrow show" aria-label="Back to menu" onClick={triggerHome} ref={backArrowRef}>
          ←
        </Link>
      ) : null}
    </>
  );
}
