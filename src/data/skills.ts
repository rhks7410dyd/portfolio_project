import type { IconValue } from '../utils/icon';

export type Skill = { icon: IconValue; label: string };

export const SKILLS: Skill[] = [
  { icon: 'terminal', label: 'Go' },
  {
    icon: {
      type: 'file',
      text: 'TS',
      background: '#BFDBFE',
      labelBackground: '#2563EB',
      labelColor: '#FFFFFF',
    },
    label: 'TypeScript',
  },
  { icon: 'data_object', label: 'Python' },
  {
    icon: {
      type: 'file',
      text: 'gRPC',
      background: '#BBF7D0',
      labelBackground: '#0F766E',
      labelColor: '#FFFFFF',
    },
    label: 'gRPC',
  },
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
