import { useState } from 'react';
import ProjectCard, { type Project } from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { PROJECTS } from '../data/projects';
import { useLanguage } from '../i18n/LanguageContext';

const Projects = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const { t } = useLanguage();

  return (
    <section className="flex flex-col gap-md">
      <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">
          folder_open
        </span>
        {t.projects.title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.slug}
            {...project}
            onSeeDetails={setSelected}
          />
        ))}
      </div>
      {selected && (
        <ProjectDetailModal
          project={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
};

export default Projects;
