"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/projects', label: 'PROJECTS' },
  { href: '/photos', label: 'PHOTOS' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/info', label: 'INFO' }
];

export default function Header() {
  const pathname = usePathname();
  const isProjectsPage = pathname === '/projects' || pathname.startsWith('/projects/');

  return (
    <header className="site-header">
      <Link href="/" className="site-name" aria-label="Andreea Halip home">
        ANDREEA HALIP
      </Link>
      <div className="header-mark" aria-hidden="true" />

      <nav className={`site-menu ${isProjectsPage ? 'projects-menu' : ''}`} aria-label="Main navigation">
        {links.map((link) => {
          const isCurrent = pathname === link.href || (link.href === '/projects' && isProjectsPage);
          const isHiddenProjectLink = link.href === '/projects' && isProjectsPage;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`menu-item ${isCurrent ? 'current' : ''} ${isHiddenProjectLink ? 'hidden' : ''}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
