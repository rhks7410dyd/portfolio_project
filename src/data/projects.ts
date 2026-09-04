import type { Project } from '../components/ProjectCard';
import githubProjects from './github-projects.json';

/**
 * 사내 프로젝트 등 GitHub에 공개되지 않은 프로젝트.
 * 상세 내용은 src/data/projects/<slug>.md 파일에 작성한다.
 */
const INTERNAL_PROJECTS: Project[] = [
  {
    icon: 'business_center',
    title: '사내 프로젝트 예시',
    description:
      '사내에서 진행한 프로젝트 예시입니다. 실제 내용으로 교체해주세요.',
    tags: ['TypeScript'],
    slug: 'internal-project-example',
    source: 'internal',
  },
];

export const PROJECTS: Project[] = [
  ...(githubProjects as Project[]),
  ...INTERNAL_PROJECTS,
];

/** Home 페이지에 노출되는 대표 프로젝트 수 */
export const FEATURED_PROJECT_COUNT = 3;
