import type { Project } from '../components/ProjectCard';

export const PROJECTS: Project[] = [
  {
    icon: 'webhook',
    title: 'Nexus Event Router',
    description:
      'A high-throughput event routing engine designed to process and distribute millions of events per second with minimal latency.',
    tags: ['Rust', 'gRPC', 'Redis'],
    externalUrl: '#',
    codeUrl: '#',
  },
  {
    icon: 'database',
    title: 'Aether Analytics',
    description:
      'Real-time analytics dashboard backend, aggregating data streams from multiple sources into a unified, queryable store.',
    tags: ['Python', 'ClickHouse', 'FastAPI'],
    codeUrl: '#',
  },
  {
    icon: 'security',
    title: 'Sentinel Auth',
    description:
      'A robust, zero-trust authentication microservice offering OAuth2, SAML, and MFA capabilities for enterprise applications.',
    tags: ['Node.js', 'PostgreSQL', 'JWT'],
    externalUrl: '#',
  },
  {
    icon: 'account_tree',
    title: 'Orbit CI/CD',
    description:
      'A pipeline orchestration platform for building, testing, and deploying containerized services across multiple clusters.',
    tags: ['Go', 'Kubernetes', 'Docker'],
    codeUrl: '#',
  },
  {
    icon: 'hub',
    title: 'Mesh Gateway',
    description:
      'Service mesh sidecar proxy providing traffic shaping, mTLS, and observability for polyglot microservice fleets.',
    tags: ['Envoy', 'gRPC', 'Go'],
    externalUrl: '#',
    codeUrl: '#',
  },
  {
    icon: 'bolt',
    title: 'Flux Cache',
    description:
      'A distributed, write-through caching layer with automatic invalidation, built to cut database load on read-heavy services.',
    tags: ['Redis', 'TypeScript'],
    codeUrl: '#',
  },
];

/** Home 페이지에 노출되는 대표 프로젝트 수 */
export const FEATURED_PROJECT_COUNT = 3;
