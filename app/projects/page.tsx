"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import projects from '../../content/projects';
import * as Icons from '../../components/ProjectIcon';

export default function ProjectsPage() {
  return (
    <>
      <motion.h1
        className="projects-page-title"
        layoutId="projects-title"
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        PROJECTS
      </motion.h1>

      <Link href="/" className="back-arrow" aria-label="Back to menu">
        ←
      </Link>

      <main className="projects-page-shell">
        <div className="project-grid">
          {projects.map((project) => {
            const Icon = (Icons as any)[project.iconId];

            return (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="project-card">
                <div className="project-icon-box">
                  <div className="project-wash" style={{ background: project.accent }} />
                  <Icon />
                </div>

                <div className="project-name">{project.title}</div>
                <div className="project-meta">{project.typology} · {project.year}</div>
                <div className="project-rule" style={{ background: project.accent }} />
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
