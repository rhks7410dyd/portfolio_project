import ProjectCard from '../components/ProjectCard';
import { PROJECTS } from '../data/projects';

const Projects = () => {
  return (
    <section className="flex flex-col gap-md">
      <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">
          folder_open
        </span>
        All Projects
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
