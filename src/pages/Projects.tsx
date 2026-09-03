import ProjectCard, { type Project } from '../components/ProjectCard';

const PROJECTS: Project[] = [
  {
    icon: 'webhook',
    title: 'Nexus Event Router',
    description:
      'A high-throughput event routing engine designed to process and distribute millions of events per second with minimal latency.',
    tags: ['Rust', 'gRPC', 'Redis'],
    externalUrl: '#',
    codeUrl: '#',
  },
  {
    icon: 'database',
    title: 'Aether Analytics',
    description:
      'Real-time analytics dashboard backend, aggregating data streams from multiple sources into a unified, queryable store.',
    tags: ['Python', 'ClickHouse', 'FastAPI'],
    codeUrl: '#',
  },
  {
    icon: 'security',
    title: 'Sentinel Auth',
    description:
      'A robust, zero-trust authentication microservice offering OAuth2, SAML, and MFA capabilities for enterprise applications.',
    tags: ['Node.js', 'PostgreSQL', 'JWT'],
    externalUrl: '#',
  },
];

const Projects = () => {
  return (
    <section className="flex flex-col gap-md">
      <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">folder_open</span>
        Featured Projects
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
