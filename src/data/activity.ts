import githubActivity from './github-activity.json';

export type Commit = {
  repo: string;
  hash: string;
  when: string;
  message: string;
  description: string;
};

export const COMMITS: Commit[] = githubActivity.commits;
export const TOP_REPOS: { name: string; commits: number }[] =
  githubActivity.topRepos;
export const ACTIVITY_STATS = githubActivity.stats;

/** GitHub Actions가 매일 scripts/fetch-github-activity.mjs로 갱신 (weeks x days, 0-4 intensity) */
export const CONTRIBUTION_WEEKS: number[][] = githubActivity.contributionWeeks;
