import TechStackIcon from '../components/TechStackIcon';
import { SKILLS_PAGE } from '../data/skillsPage';
import { SKILLS } from '../data/skills';
import { useLanguage } from '../i18n/LanguageContext';

const Skills = () => {
  const { t, lang } = useLanguage();
  const page = SKILLS_PAGE[lang];

  return (
    <div className="flex flex-col gap-xl">
      <section className="flex flex-col gap-md">
        <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">bolt</span>
          {t.skills.title}
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
              {page.studyLabsTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {page.studyLabs.map((lab) => (
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
                        lab.statusKey === 'active'
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
                      <span className="text-primary">{page.insightLabel}</span>{' '}
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
              {page.milestonesTitle}
            </h2>
            <div className="relative pl-lg border-l border-outline-variant/50 space-y-lg">
              {page.milestones.map((milestone) => (
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
              {page.readingQueueTitle}
            </h3>
            <ul className="space-y-sm">
              {page.readingQueue.map((book) => (
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
              {page.radarTitle}
            </h3>
            <div className="space-y-sm">
              {page.radar.map((item) => (
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
