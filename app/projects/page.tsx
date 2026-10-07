import Link from 'next/link';
import projects from '../../content/projects';
import * as Icons from '../../components/ProjectIcon';

export default function ProjectsPage() {
  const rows = [] as Array<typeof projects>;

  for (let index = 0; index < projects.length; index += 3) {
    rows.push(projects.slice(index, index + 3));
  }

  return (
    <main className="view projects active show" id="projectsView">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((project) => {
            const Icon = (Icons as any)[project.iconId];

            return (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="item" aria-label={project.title}>
                <div className="icon-box">
                  <div className="wash" style={{ background: project.accent }} />
                  <Icon />
                </div>
                <div className="name">{project.title}</div>
                <div className="meta">{project.typology} · {project.year}</div>
                <div className="rule" style={{ background: project.accent }} />
              </Link>
            );
          })}
        </div>
      ))}
    </main>
  );
}
