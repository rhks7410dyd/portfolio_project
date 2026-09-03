export type Skill = { icon: string; label: string };

export const SKILLS: Skill[] = [
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

/** Home 페이지에 노출되는 대표 스킬 수 */
export const FEATURED_SKILL_COUNT = 6;
