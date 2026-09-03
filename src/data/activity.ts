export type Commit = {
  repo: string;
  hash: string;
  when: string;
  message: string;
  description: string;
};

export const COMMITS: Commit[] = [
  {
    repo: 'dev-architect-core',
    hash: '#a1b2c3d',
    when: '2 hours ago',
    message:
      'refactor(auth): Implement JWT rotation and secure cookie handling',
    description:
      'Migrated from local storage to httpOnly cookies for better XSS protection. Added refresh token rotation endpoint and updated middleware to handle new token format.',
  },
  {
    repo: 'nexus-engine',
    hash: '#9f8e7d6',
    when: 'Yesterday',
    message: 'feat(ui): Add glassmorphic design system components',
    description:
      'Introduced new visual tokens for translucent surfaces. Built BackdropBlur wrapper component and updated BaseCard to support configurable elevation levels.',
  },
  {
    repo: 'design-system-ui',
    hash: '#5a4b3c2',
    when: '3 days ago',
    message: 'fix(layout): Resolve grid overflow on narrow viewports',
    description:
      'Adjusted media queries for responsive grid layout. Changed minmax values to prevent horizontal scrolling on mobile devices under 320px width.',
  },
  {
    repo: 'dev-architect-core',
    hash: '#1z2x3c4',
    when: 'Oct 12, 2023',
    message: 'chore(deps): Bump typescript from 4.9 to 5.2',
    description:
      'Updated dependencies and resolved breaking changes in types. Removed deprecated compiler options from tsconfig.json.',
  },
  {
    repo: 'nexus-engine',
    hash: '#7c6d5e4',
    when: 'Oct 9, 2023',
    message: 'perf(router): Cache compiled route matchers',
    description:
      'Reduced per-request routing overhead by precompiling and caching matcher functions at startup.',
  },
  {
    repo: 'design-system-ui',
    hash: '#3f2e1d0',
    when: 'Oct 4, 2023',
    message: 'docs: Document color token usage guidelines',
    description:
      'Added a reference table mapping semantic color roles to their light/dark hex values for contributors.',
  },
];

export const TOP_REPOS = [
  { name: 'dev-architect-core', commits: 450 },
  { name: 'nexus-engine', commits: 312 },
  { name: 'design-system-ui', commits: 189 },
];

export const ACTIVITY_STATS = {
  totalCommitsYtd: 1432,
  yoyChange: '+12% vs last year',
  longestStreakDays: 42,
  currentStreakDays: 14,
};

/** Deterministic 52-week x 7-day contribution intensities (0-4), no randomness so renders stay stable. */
export const CONTRIBUTION_WEEKS: number[][] = Array.from(
  { length: 52 },
  (_, col) =>
    Array.from({ length: 7 }, (_, row) => {
      const wave = Math.sin(col * 0.35 + row * 0.9) + Math.sin(col * 0.11);
      return Math.max(0, Math.min(4, Math.round((wave + 1.6) * 1.3)));
    }),
);
