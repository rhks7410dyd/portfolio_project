import type { Experience } from '../components/ExperienceItem';

export const EXPERIENCE: Experience[] = [
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
