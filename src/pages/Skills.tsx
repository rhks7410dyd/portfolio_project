import TechStackIcon from '../components/TechStackIcon';
import { SKILLS } from '../data/skills';

type Lab = {
  name: string;
  status: 'Active' | 'Reference';
  description: string;
  insight: string;
};

const STUDY_LABS: Lab[] = [
  {
    name: 'Algorithm-Solving',
    status: 'Active',
    description:
      'Performance optimization focus. Deep dives into dynamic programming and graph traversals.',
    insight: 'Memoization strategies for tree-based recursion.',
  },
  {
    name: 'Design-Pattern-Notes',
    status: 'Reference',
    description:
      'System design focus. Compendium of microservices architectures and domain-driven design patterns.',
    insight: 'Event sourcing vs CRUD in high-throughput systems.',
  },
  {
    name: 'New-Tech-PoC',
    status: 'Active',
    description:
      'WebAssembly & Rust. Evaluating compilation targets and JS interop performance.',
    insight: 'Memory management boundaries between V8 and Wasm.',
  },
];

const MILESTONES = [
  {
    title: 'Mastered Kubernetes Fundamentals',
    description:
      'Achieved deep understanding of cluster architecture, pod lifecycles, and ingress controllers.',
    dotClassName: 'bg-primary shadow-[0_0_8px_var(--color-primary-container)]',
  },
  {
    title: 'Deep Dive into React Reconciliation',
    description:
      'Analyzed the Fiber architecture and render phase optimizations for complex UI states.',
    dotClassName: 'bg-outline-variant',
  },
];

const READING_QUEUE = [
  { title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann' },
  { title: 'Rust in Action', author: 'Tim McNamara' },
];

const CURRENT_RADAR = [
  { label: 'Rust for WebAssembly', progress: 45 },
  { label: 'eBPF Networking', progress: 15 },
];

const Skills = () => {
  return (
    <div className="flex flex-col gap-xl">
      <section className="flex flex-col gap-md">
        <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">bolt</span>
          Skills
        </h3>
        <div className="flex flex-wrap gap-sm">
          {SKILLS.map((skill) => (
            <TechStackIcon
              key={skill.label}
              icon={skill.icon}
              label={skill.label}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <div className="lg:col-span-8 flex flex-col gap-xl">
          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">
                science
              </span>{' '}
              Study Labs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {STUDY_LABS.map((lab) => (
                <article
                  key={lab.name}
                  className="glass-panel p-md rounded-lg flex flex-col gap-sm h-full group"
                >
                  <header className="flex justify-between items-start">
                    <h3 className="font-label-caps text-label-caps text-on-surface group-hover:text-primary transition-colors">
                      {lab.name}
                    </h3>
                    <span
                      className={
                        lab.status === 'Active'
                          ? 'bg-primary/10 text-primary font-code-sm text-code-sm px-2 py-xs rounded border border-primary/30'
                          : 'bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm px-2 py-xs rounded border border-outline-variant/30'
                      }
                    >
                      {lab.status}
                    </span>
                  </header>
                  <p className="text-on-surface-variant font-body-md text-body-md flex-grow">
                    {lab.description}
                  </p>
                  <div className="mt-sm pt-sm border-t border-outline-variant/50">
                    <p className="font-code-sm text-code-sm text-secondary">
                      <span className="text-primary">Insight:</span>{' '}
                      {lab.insight}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-headline-md text-headline-md text-primary mb-lg flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">
                timeline
              </span>{' '}
              Learning Milestones
            </h2>
            <div className="relative pl-lg border-l border-outline-variant/50 space-y-lg">
              {MILESTONES.map((milestone) => (
                <div key={milestone.title} className="relative">
                  <div
                    className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full ${milestone.dotClassName}`}
                  />
                  <h3 className="font-label-caps text-label-caps text-on-surface mb-xs">
                    {milestone.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 flex flex-col gap-lg">
          <div className="glass-panel p-md rounded-lg">
            <h3 className="font-label-caps text-label-caps text-primary mb-md border-b border-outline-variant/30 pb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[16px]">
                menu_book
              </span>{' '}
              Reading Queue
            </h3>
            <ul className="space-y-sm">
              {READING_QUEUE.map((book) => (
                <li key={book.title} className="flex items-start gap-sm">
                  <span className="material-symbols-outlined text-secondary mt-xs text-[16px]">
                    book
                  </span>
                  <div>
                    <p className="font-code-sm text-code-sm text-on-surface">
                      {book.title}
                    </p>
                    <p className="font-code-sm text-code-sm text-on-surface-variant text-xs">
                      {book.author}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-md rounded-lg">
            <h3 className="font-label-caps text-label-caps text-primary mb-md border-b border-outline-variant/30 pb-xs flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-[16px]">
                radar
              </span>{' '}
              Current Radar
            </h3>
            <div className="space-y-sm">
              {CURRENT_RADAR.map((item) => (
                <div key={item.label}>
                  <p className="font-code-sm text-code-sm text-on-surface mb-xs">
                    {item.label}
                  </p>
                  <div className="w-full bg-surface-container-lowest rounded-full h-1">
                    <div
                      className="bg-primary h-1 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Skills;
