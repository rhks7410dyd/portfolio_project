import { Link } from 'react-router-dom';
import Button from '../components/Button';
import TechStackIcon from '../components/TechStackIcon';

const TECH_STACK = [
  { icon: 'database', label: 'PostgreSQL' },
  { icon: 'api', label: 'GraphQL' },
  { icon: 'cloud', label: 'AWS' },
  { icon: 'deployed_code', label: 'Docker' },
  { icon: 'memory', label: 'Redis' },
];

const Home = () => {
  return (
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
          <Link to="/projects">
            <Button variant="outline">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              VIEW PROJECTS
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              CONTACT ME
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 gap-sm justify-center md:justify-end items-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none hidden md:block" />
        {TECH_STACK.map((tech) => (
          <TechStackIcon key={tech.label} icon={tech.icon} label={tech.label} />
        ))}
      </div>
    </section>
  );
};

export default Home;
