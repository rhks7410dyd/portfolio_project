import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Button from './components/Button';
import TechStackIcon from './components/TechStackIcon';
import ExperienceItem, { type Experience } from './components/ExperienceItem';
import ProjectCard, { type Project } from './components/ProjectCard';

const TECH_STACK = [
  { icon: 'database', label: 'PostgreSQL' },
  { icon: 'api', label: 'GraphQL' },
  { icon: 'cloud', label: 'AWS' },
  { icon: 'deployed_code', label: 'Docker' },
  { icon: 'memory', label: 'Redis' },
];

const SKILLS = [
  { icon: 'terminal', label: 'Go' },
  { icon: 'code', label: 'TypeScript' },
  { icon: 'data_object', label: 'Python' },
  { icon: 'hub', label: 'gRPC' },
  { icon: 'database', label: 'PostgreSQL' },
  { icon: 'bolt', label: 'Redis' },
  { icon: 'api', label: 'GraphQL' },
  { icon: 'cloud', label: 'AWS' },
  { icon: 'deployed_code', label: 'Docker' },
  { icon: 'account_tree', label: 'Kubernetes' },
  { icon: 'memory', label: 'Kafka' },
  { icon: 'security', label: 'OAuth2 / JWT' },
];

const CONTACT_LINKS = [
  { icon: 'mail', label: 'EMAIL ME', href: 'mailto:hello@devarchitect.dev' },
  { icon: 'code', label: 'GITHUB', href: 'https://github.com' },
  { icon: 'link', label: 'LINKEDIN', href: 'https://linkedin.com' },
];

const EXPERIENCE: Experience[] = [
  {
    role: 'Senior Systems Engineer',
    company: 'TechNova Solutions // 2021 - Present',
    bullets: [
      'Architected microservices transition, reducing deployment time by 40%.',
      'Implemented distributed caching strategy handling 10k+ req/sec.',
      'Led a team of 4 engineers in redesigning the core data pipeline.',
    ],
    tags: ['Go', 'Kubernetes', 'Kafka'],
    dotClassName: 'bg-primary',
  },
  {
    role: 'Backend Developer',
    company: 'DataSync Inc. // 2018 - 2021',
    bullets: [
      'Developed RESTful APIs supporting mobile and web platforms.',
      'Optimized legacy database queries, improving read speeds by 25%.',
    ],
    dotClassName: 'bg-surface-bright',
  },
];

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

const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Nav />
      <main className="flex-grow pt-[80px] pb-xl px-gutter max-w-container-max mx-auto w-full flex flex-col gap-xl">
        <section className="flex flex-col md:flex-row gap-xl items-center py-xl relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-container/10 via-background to-background pointer-events-none" />
          <div className="flex-1 flex flex-col gap-lg">
            <div className="space-y-sm">
              <p className="font-code-sm text-code-sm text-primary">&gt; Hello, world.</p>
              <h1 className="font-headline-lg text-headline-lg text-on-background">Software Engineer</h1>
              <h2 className="font-headline-md text-headline-md text-on-surface-variant">Architecting Scalable Solutions</h2>
            </div>
            <p className="text-on-surface-variant max-w-2xl">
              Specializing in high-performance distributed systems, robust API design, and complex data
              orchestration. I build infrastructure that scales effortlessly.
            </p>
            <div className="flex flex-wrap gap-md">
              <Button variant="outline">
                <span className="material-symbols-outlined text-[18px]">terminal</span>
                VIEW PROJECTS
              </Button>
              <Button variant="ghost">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                CONTACT ME
              </Button>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 gap-sm justify-center md:justify-end items-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none hidden md:block" />
            {TECH_STACK.map((tech) => (
              <TechStackIcon key={tech.label} icon={tech.icon} label={tech.label} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-md" id="experience">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">work_history</span>
            Experience
          </h3>
          <div className="flex flex-col gap-sm border-l-2 border-surface-bright ml-[10px] pl-md py-sm">
            {EXPERIENCE.map((exp) => (
              <ExperienceItem key={exp.role} {...exp} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-md" id="projects">
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

        <section className="flex flex-col gap-md" id="skills">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">bolt</span>
            Skills
          </h3>
          <div className="flex flex-wrap gap-sm">
            {SKILLS.map((skill) => (
              <TechStackIcon key={skill.label} icon={skill.icon} label={skill.label} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-md items-start" id="contact">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">mail</span>
            Contact
          </h3>
          <p className="text-on-surface-variant max-w-2xl">
            Have a project in mind or just want to talk systems design? My inbox is open.
          </p>
          <div className="flex flex-wrap gap-md">
            {CONTACT_LINKS.map((link) => (
              <Button key={link.label} variant="outline" onClick={() => window.open(link.href, '_blank')}>
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                {link.label}
              </Button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
