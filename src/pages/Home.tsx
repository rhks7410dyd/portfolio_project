import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ExperienceItem from '../components/ExperienceItem';
import ProjectCard, { type Project } from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import TechStackIcon from '../components/TechStackIcon';
import { EXPERIENCE } from '../data/experience';
import { FEATURED_PROJECT_COUNT, PROJECTS } from '../data/projects';
import { FEATURED_SKILL_COUNT, SKILLS } from '../data/skills';
import { useLanguage } from '../i18n/LanguageContext';

const TECH_STACK = [
  { icon: 'database', label: 'PostgreSQL' },
  { icon: 'api', label: 'GraphQL' },
  { icon: 'cloud', label: 'AWS' },
  { icon: 'deployed_code', label: 'Docker' },
  { icon: 'memory', label: 'Redis' },
  { icon: 'hub', label: 'Kubernetes' },
  { icon: 'bolt', label: 'Kafka' },
  { icon: 'terminal', label: 'Linux' },
  { icon: 'account_tree', label: 'Git' },
];

// 3 copies laid side by side so dragging never runs out of icons; the scroll
// position gets silently re-centered into the middle copy when it nears an edge.
const LOOPED_TECH_STACK = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK];

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
  const [selected, setSelected] = useState<Project | null>(null);
  const { lang, t } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; scrollLeft: number; lastX: number; lastT: number; velocity: number } | null>(null);
  const inertiaFrame = useRef<number | null>(null);

  const recenter = (track: HTMLDivElement) => {
    // wrapped around one of the outer copies, jump back into the middle copy
    const setWidth = track.scrollWidth / 3;
    if (track.scrollLeft < setWidth * 0.5) {
      track.scrollLeft += setWidth;
    } else if (track.scrollLeft > setWidth * 1.5) {
      track.scrollLeft -= setWidth;
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = track.scrollWidth / 3;
  }, []);

  const onDragStart = (e: PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    if (inertiaFrame.current) cancelAnimationFrame(inertiaFrame.current);
    track.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    };
  };

  const onDragMove = (e: PointerEvent) => {
    const track = trackRef.current;
    if (!track || !drag.current) return;
    track.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX);

    const now = performance.now();
    const dt = now - drag.current.lastT || 16;
    drag.current.velocity = (drag.current.lastX - e.clientX) / dt;
    drag.current.lastX = e.clientX;
    drag.current.lastT = now;
  };

  const onDragEnd = () => {
    const track = trackRef.current;
    if (!track || !drag.current) return;
    let velocity = drag.current.velocity;
    drag.current = null;

    const step = () => {
      if (!track || Math.abs(velocity) < 0.02) {
        inertiaFrame.current = null;
        return;
      }
      track.scrollLeft += velocity * 16;
      velocity *= 0.95;
      recenter(track);
      inertiaFrame.current = requestAnimationFrame(step);
    };
    recenter(track);
    inertiaFrame.current = requestAnimationFrame(step);
  };

  return (
    <>
      <section className="flex flex-col md:flex-row gap-xl items-center py-xl relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-container/10 via-background to-background pointer-events-none" />
        <div className="flex-1 flex flex-col gap-lg">
          <div className="space-y-sm">
            <p className="font-code-sm text-code-sm text-primary">
              {t.home.hello}
            </p>
            <h1 className="font-headline-lg text-headline-lg text-on-background">
              {t.home.title}
            </h1>
            <h2 className="font-headline-md text-headline-md text-on-surface-variant">
              {t.home.subtitle}
            </h2>
          </div>
          <p className="text-on-surface-variant max-w-2xl">
            {t.home.description}
          </p>
          <div className="flex flex-wrap gap-md">
            <Link to={`/${lang}/projects`}>
              <Button variant="outline">
                <span className="material-symbols-outlined text-[18px]">
                  terminal
                </span>
                {t.home.viewProjects}
              </Button>
            </Link>
            <Link to={`/${lang}/contact`}>
              <Button variant="ghost">
                <span className="material-symbols-outlined text-[18px]">
                  mail
                </span>
                {t.home.contactMe}
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
          <div
            ref={trackRef}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
            className="flex gap-[13px] overflow-x-auto touch-pan-y cursor-grab active:cursor-grabbing select-none pt-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {LOOPED_TECH_STACK.map((tech, index) => (
              <div key={`${tech.label}-${index}`} className="shrink-0">
                <TechStackIcon icon={tech.icon} label={tech.label} plain />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">
              folder_open
            </span>
            {t.home.featuredProjects}
          </h3>
          <ViewAllLink to={`/${lang}/projects`} label={t.home.viewAllProjects} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {PROJECTS.slice(0, FEATURED_PROJECT_COUNT).map((project) => (
            <ProjectCard
              key={project.slug}
              {...project}
              onSeeDetails={setSelected}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary">bolt</span>
            {t.home.skills}
          </h3>
          <ViewAllLink to={`/${lang}/skills`} label={t.home.viewAllSkills} />
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
            {t.home.experience}
          </h3>
          <ViewAllLink to={`/${lang}/experience`} label={t.home.viewFullHistory} />
        </div>
        <div className="flex flex-col gap-sm border-l-2 border-surface-bright ml-[10px] pl-md py-sm">
          <ExperienceItem {...EXPERIENCE[0]} />
        </div>
      </section>

      {selected && (
        <ProjectDetailModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default Home;
