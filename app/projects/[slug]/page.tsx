import Link from 'next/link';
import projects from '../../../content/projects';

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    return (
      <main className="projects-page-shell">
        <h1 className="projects-page-title">PROJECT</h1>
        <div className="landing-note" style={{ paddingTop: '90px' }}>Project not found.</div>
      </main>
    );
  }

  return (
    <main className="projects-page-shell">
      <Link href="/projects" className="back-arrow" aria-label="Back to projects">
        ←
      </Link>

      <div style={{ paddingTop: '90px' }}>
        <h1 className="project-detail-title">{project.title}</h1>
        <div className="project-detail-meta">
          {project.typology} · {project.year}
        </div>
        <div style={{ marginTop: '32px', height: '340px', background: project.accent, opacity: 0.2, border: '1px solid var(--line)' }} />
      </div>
    </main>
  );
}
