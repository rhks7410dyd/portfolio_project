import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ExperienceItem from '../components/ExperienceItem';
import ProjectCard from '../components/ProjectCard';
import TechStackIcon from '../components/TechStackIcon';
import { EXPERIENCE } from '../data/experience';
import { FEATURED_PROJECT_COUNT, PROJECTS } from '../data/projects';
import { FEATURED_SKILL_COUNT, SKILLS } from '../data/skills';

const TECH_STACK = [
  { icon: 'database', label: 'PostgreSQL' },
  { icon: 'api', label: 'GraphQL' },
  { icon: 'cloud', label: 'AWS' },
  { icon: 'deployed_code', label: 'Docker' },
  { icon: 'memory', label: 'Redis' },
];

const ViewAllLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-xs self-start"
  >
    {label}
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
);

const Home = () => {
  return (
    <>
      <section className="flex flex-col md:flex-row gap-xl items-center py-xl relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-container/10 via-background to-background pointer-events-none" />
        <div className="flex-1 flex flex-col gap-lg">
          <div className="space-y-sm">
            <p className="font-code-sm text-code-sm text-primary">
              &gt; Hello, world.
            </p>
            <h1 className="font-headline-lg text-headline-lg text-on-background">
              Software Engineer
            </h1>
            <h2 className="font-headline-md text-headline-md text-on-surface-variant">
              Architecting Scalable Solutions
            </h2>
          </div>
          <p className="text-on-surface-variant max-w-2xl">
            Specializing in high-performance distributed systems, robust API
            design, and complex data orchestration. I build infrastructure that
            scales effortlessly.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link to="/projects">
              <Button variant="outline">
                <span className="material-symbols-outlined text-[18px]">
                  terminal
                </span>
                VIEW PROJECTS
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost">
                <span className="material-symbols-outlined text-[18px]">
                  mail
                </span>
                CONTACT ME
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-4 sm:grid-cols-5 gap-sm justify-center md:justify-end items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none hidden md:block" />
          {TECH_STACK.map((tech) => (
            <TechStackIcon
              key={tech.label}
              icon={tech.icon}
              label={tech.label}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              folder_open
            </span>
            Featured Projects
          </h3>
          <ViewAllLink to="/projects" label="VIEW ALL PROJECTS" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {PROJECTS.slice(0, FEATURED_PROJECT_COUNT).map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">bolt</span>
            Skills
          </h3>
          <ViewAllLink to="/skills" label="VIEW ALL SKILLS" />
        </div>
        <div className="flex flex-wrap gap-sm">
          {SKILLS.slice(0, FEATURED_SKILL_COUNT).map((skill) => (
            <TechStackIcon
              key={skill.label}
              icon={skill.icon}
              label={skill.label}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              work_history
            </span>
            Experience
          </h3>
          <ViewAllLink to="/experience" label="VIEW FULL HISTORY" />
        </div>
        <div className="flex flex-col gap-sm border-l-2 border-surface-bright ml-[10px] pl-md py-sm">
          <ExperienceItem {...EXPERIENCE[0]} />
        </div>
      </section>
    </>
  );
};

export default Home;
