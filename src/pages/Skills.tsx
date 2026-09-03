import TechStackIcon from '../components/TechStackIcon';

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

const Skills = () => {
  return (
    <section className="flex flex-col gap-md">
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
  );
};

export default Skills;
