import ExperienceItem, { type Experience as ExperienceEntry } from '../components/ExperienceItem';

const EXPERIENCE: ExperienceEntry[] = [
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

const Experience = () => {
  return (
    <section className="flex flex-col gap-md">
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
  );
};

export default Experience;
