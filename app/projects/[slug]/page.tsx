import type { Metadata } from 'next';
import ProjectDetailView from './ProjectDetailView';
import projects from '../../../content/projects';

type ProjectPageProps = { params: { slug: string } };

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) return { title: 'Project not found | Andreea Halip' };

  return {
    title: `${project.title}, ${project.typology}, ${project.year} | Andreea Halip`,
    description: project.description,
  };
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    return <main className="project-detail-not-found">Project not found.</main>;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    creator: { '@type': 'Person', name: 'Andreea Halip' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <ProjectDetailView project={project} />
    </>
  );
}