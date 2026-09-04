import snapshot from './github-activity.json';

export type Commit = {
  repo: string;
  hash: string;
  when: string;
  message: string;
};

export type TopRepo = { name: string; commits: number };

export const COMMITS: Commit[] = snapshot.recentCommits;

export const TOP_REPOS: TopRepo[] = snapshot.topRepos;

/** Longest and current run of contribution days (intensity > 0), flattened across all weeks. */
function computeStreaks(weeks: number[][]) {
  const days = weeks.flat();
  let longest = 0;
  let running = 0;
  for (const level of days) {
    running = level > 0 ? running + 1 : 0;
    longest = Math.max(longest, running);
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0 && days[i] > 0; i--) {
    current++;
  }
  return { longest, current };
}

const { longest: longestStreakDays, current: currentStreakDays } =
  computeStreaks(snapshot.contributionWeeks);

export const ACTIVITY_STATS = {
  totalContributions: snapshot.totalContributionsLastYear,
  longestStreakDays,
  currentStreakDays,
  generatedAt: snapshot.generatedAt,
};

export const CONTRIBUTION_WEEKS: number[][] = snapshot.contributionWeeks;

export const GITHUB_USERNAME = snapshot.username;
