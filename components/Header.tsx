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
  const originRef = useRef<HTMLAnchorElement | null>(null);
  const returningHomeRef = useRef(false);
  const [transitioning, setTransitioning] = useState(false);
  const [menuState, setMenuState] = useState<'home' | 'page'>('home');
  const [arrowVisible, setArrowVisible] = useState(false);
  const [arrowExiting, setArrowExiting] = useState(false);
  const [returningHome, setReturningHome] = useState(false);
  const [returningLinkHref, setReturningLinkHref] = useState<string | null>(null);
  const [pageTitleText, setPageTitleText] = useState('');

  useEffect(() => {
    const root = document.documentElement;
    const pageTitle = pageTitleRef.current;
    const backArrow = backArrowRef.current;

    if (current === 'home') {
      root.classList.remove('compact', 'snap');
      if (returningHomeRef.current) {
        setArrowVisible(false);
        return;
      }

      setTransitioning(false);
      setPageTitleText('');
      pageTitle?.classList.remove('show');
      pageTitle?.setAttribute('data-state', 'hidden');
      if (pageTitle) {
        pageTitle.style.transition = 'none';
        pageTitle.style.opacity = '0';
        pageTitle.style.transform = 'translate3d(0, 0, 0)';
      }
      if (backArrow) {
        backArrow.classList.remove('show', 'exit');
      }
      setArrowVisible(false);
      setArrowExiting(false);
      setReturningHome(false);
      setReturningLinkHref(null);
      originRef.current = null;
      menuRefs.current.forEach((link) => link?.classList.remove('hide', 'exit', 'returning'));
      setMenuState('home');
      return;
    }

    setArrowVisible(true);
    setArrowExiting(false);
    setTransitioning(false);

    root.classList.add('compact');
    if (current === 'projects') {
      root.classList.add('snap');
    }

    const label = titleMap[current as keyof typeof titleMap];
    if (pageTitle) {
      setPageTitleText(label);
      pageTitle.setAttribute('data-state', 'visible');
      pageTitle.classList.add('show');
      if (!originRef.current) {
        pageTitle.style.transition = 'none';
        pageTitle.style.opacity = '1';
        pageTitle.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    setMenuState('page');
  }, [current]);

  const getOrigin = (link: HTMLAnchorElement) => {
    const title = pageTitleRef.current;
    if (!title) {
      return 'translate3d(0, 0, 0)';
    }

    const linkRect = link.getBoundingClientRect();
    const titleRect = title.getBoundingClientRect();
    return `translate3d(${linkRect.left - titleRect.left}px, ${linkRect.top - titleRect.top}px, 0)`;
  };

  const getHomeOrigin = (link: HTMLAnchorElement) => {
    const title = pageTitleRef.current;
    const menu = link.parentElement;
    if (!title || !menu) return 'translate3d(0, 0, 0)';

    const root = document.documentElement;
    const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue('--header-home')) || 132;
    const titleLeft = Number.parseFloat(getComputedStyle(title).left) || 40;
    const titleTop = Number.parseFloat(getComputedStyle(title).top) || 46;
    const targetLeft = window.innerWidth - 40 - link.offsetWidth;
    const targetTop = (headerHeight - menu.offsetHeight) / 2 + link.offsetTop;

    return `translate3d(${targetLeft - titleLeft}px, ${targetTop - titleTop}px, 0)`;
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

    setPageTitleText(titleMap[page]);
    pageTitle.style.transition = 'none';
    pageTitle.style.opacity = '1';
    pageTitle.style.transform = getOrigin(activeLink);
    pageTitle.classList.add('show');
    pageTitle.setAttribute('data-state', 'visible');
    void pageTitle.offsetWidth;
    originRef.current = activeLink;

    activeLink.classList.add('hide');
    others.forEach((item) => item?.classList.add('exit'));

    document.documentElement.classList.add('compact');
    if (page === 'projects') {
      document.documentElement.classList.add('snap');
    }

    requestAnimationFrame(() => {
      pageTitle.style.transition = 'transform 0.9s cubic-bezier(.4,0,.2,1)';
      pageTitle.style.transform = 'translate3d(0, 0, 0)';
      backArrowRef.current?.classList.add('show');
    });
    router.push(targetHref);
  };

  const triggerHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (current === 'home' || transitioning) {
      if (transitioning) event.preventDefault();
      return;
    }

    event.preventDefault();

    setTransitioning(true);

    const page = current;
    const activeLink = menuRefs.current[links.findIndex((link) => link.href === (page === 'projects' ? '/projects' : page === 'resume' ? '/resume' : '/contact'))];
    const others = menuRefs.current.filter((item) => item !== activeLink);
    const pageTitle = pageTitleRef.current;

    if (pageTitle) {
      const homeOrigin = activeLink ? getHomeOrigin(activeLink) : 'translate3d(0, 0, 0)';
      pageTitle.style.transition = 'none';
      pageTitle.style.opacity = '1';
      pageTitle.style.transform = 'translate3d(0, 0, 0)';
      void pageTitle.offsetWidth;
      pageTitle.style.transition = 'transform 0.9s cubic-bezier(.4,0,.2,1)';
      pageTitle.style.transform = homeOrigin;
      pageTitle.style.opacity = '1';
    }

    setArrowVisible(false);
    setArrowExiting(true);
    setReturningHome(true);
    setReturningLinkHref(activeLink?.getAttribute('href') ?? null);
    returningHomeRef.current = true;

    document.documentElement.classList.remove('compact', 'snap');
    activeLink?.classList.add('returning');
    others.forEach((item) => item?.classList.remove('exit'));

    router.push('/');
    window.setTimeout(() => {
      const title = pageTitleRef.current;
      title?.classList.remove('show');
      title?.setAttribute('data-state', 'hidden');
      if (title) {
        title.style.transition = 'none';
        title.style.opacity = '0';
        title.style.transform = 'translate3d(0, 0, 0)';
      }
      backArrowRef.current?.classList.remove('show', 'exit');
      setPageTitleText('');
      setArrowVisible(false);
      setArrowExiting(false);
      setReturningHome(false);
      setReturningLinkHref(null);
      setTransitioning(false);
      returningHomeRef.current = false;
      originRef.current = null;
      menuRefs.current.forEach((link) => link?.classList.remove('hide', 'exit', 'returning'));
      setMenuState('home');
    }, 900);
  };

  return (
    <>
      <header id="header" className={`site-header ${current === 'home' || returningHome ? '' : 'compact'} ${current === 'projects' && !returningHome ? 'scrolled' : ''}`}>
        <Link href="/" className="site-name" aria-label="Andreea Halip home">
          ANDREEA HALIP
        </Link>
        <div className="mark" aria-hidden="true" />

        <nav className={`menu ${current !== 'home' && !returningHome ? 'menu--hidden' : ''}`} aria-label="Main navigation">
          {links.map((link) => {
            const isCurrent = pathname === link.href || (link.href === '/projects' && current === 'projects');
            const isVisible = current === 'home' || returningHome || link.href === '/projects';

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
                className={`menu-item ${isCurrent ? 'current' : ''} ${isVisible ? '' : 'exit'} ${returningHome && link.href === returningLinkHref ? 'returning' : ''} ${menuState === 'page' ? 'page-state' : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <h1 ref={pageTitleRef} className="page-title" aria-live="polite">
        {pageTitleText && (
          <Link
            href="/"
            className="page-title-link"
            aria-label="Back to menu"
            onClick={triggerHome}
          >
            {pageTitleText}
          </Link>
        )}
      </h1>

      {current !== 'home' || returningHome ? (
        <Link
          href="/"
          className={`back-arrow ${arrowVisible ? 'show' : ''} ${arrowExiting ? 'exit' : ''}`}
          aria-label="Back to menu"
          onClick={triggerHome}
          ref={backArrowRef}
        >
          ←
        </Link>
      ) : null}
    </>
  );
}
