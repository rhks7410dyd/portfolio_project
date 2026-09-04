// GitHub commit activity -> src/data/github-activity.json
// Run: bun scripts/fetch-github-activity.mjs
// Requires a GITHUB_TOKEN env var (see .github/workflows/update-activity.yml).
// Scheduled daily by .github/workflows/update-activity.yml

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const GITHUB_USER = 'rhks7410dyd';
const OUT_PATH = fileURLToPath(
  new URL('../src/data/github-activity.json', import.meta.url),
);
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  throw new Error(
    'GITHUB_TOKEN env var is required (contributionsCollection needs an authenticated GraphQL request).',
  );
}

const restHeaders = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TOKEN}`,
};

// ---- Recent commits: GitHub Events API (public push events) ----

const relativeTime = (isoDate) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const eventsRes = await fetch(
  `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`,
  { headers: restHeaders },
);
if (!eventsRes.ok) {
  throw new Error(`GitHub events API error: ${eventsRes.status}`);
}
const events = await eventsRes.json();

const commits = events
  .filter((e) => e.type === 'PushEvent')
  .flatMap((e) =>
    e.payload.commits.map((c) => {
      const [message, ...rest] = c.message.split('\n');
      return {
        repo: e.repo.name.split('/')[1],
        hash: `#${c.sha.slice(0, 7)}`,
        when: relativeTime(e.created_at),
        message,
        description: rest.join(' ').trim() || message,
      };
    }),
  )
  .slice(0, 15);

// ---- Contribution stats: GraphQL contributionsCollection (needs auth) ----

const now = new Date();
const oneYearAgo = new Date(now);
oneYearAgo.setFullYear(now.getFullYear() - 1);
const twoYearsAgo = new Date(now);
twoYearsAgo.setFullYear(now.getFullYear() - 2);

const query = `
  query($login: String!, $from: DateTime!, $to: DateTime!, $prevFrom: DateTime!, $prevTo: DateTime!) {
    user(login: $login) {
      recent: contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
        commitContributionsByRepository(maxRepositories: 5) {
          repository { name }
          contributions { totalCount }
        }
      }
      previous: contributionsCollection(from: $prevFrom, to: $prevTo) {
        contributionCalendar { totalContributions }
      }
    }
  }
`;

const gqlRes = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { ...restHeaders, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query,
    variables: {
      login: GITHUB_USER,
      from: oneYearAgo.toISOString(),
      to: now.toISOString(),
      prevFrom: twoYearsAgo.toISOString(),
      prevTo: oneYearAgo.toISOString(),
    },
  }),
});
if (!gqlRes.ok) {
  throw new Error(`GitHub GraphQL API error: ${gqlRes.status}`);
}
const gqlJson = await gqlRes.json();
if (gqlJson.errors) {
  throw new Error(`GitHub GraphQL error: ${JSON.stringify(gqlJson.errors)}`);
}

const { recent, previous } = gqlJson.data.user;

const days = recent.contributionCalendar.weeks.flatMap((w) =>
  w.contributionDays.map((d) => d.contributionCount),
);

// ponytail: static thresholds instead of quantile buckets, close enough to GitHub's heatmap look
const level = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  return 4;
};

const contributionWeeks = recent.contributionCalendar.weeks.map((w) =>
  w.contributionDays.map((d) => level(d.contributionCount)),
);

let longestStreakDays = 0;
let currentRun = 0;
for (const count of days) {
  currentRun = count > 0 ? currentRun + 1 : 0;
  longestStreakDays = Math.max(longestStreakDays, currentRun);
}
let currentStreakDays = 0;
for (let i = days.length - 1; i >= 0 && days[i] > 0; i--) currentStreakDays++;

const totalCommitsYtd = recent.contributionCalendar.totalContributions;
const previousTotal = previous.contributionCalendar.totalContributions;
const yoyChange =
  previousTotal === 0
    ? 'N/A'
    : `${totalCommitsYtd >= previousTotal ? '+' : ''}${Math.round(
        ((totalCommitsYtd - previousTotal) / previousTotal) * 100,
      )}% vs last year`;

const topRepos = recent.commitContributionsByRepository
  .map((r) => ({
    name: r.repository.name,
    commits: r.contributions.totalCount,
  }))
  .sort((a, b) => b.commits - a.commits);

await writeFile(
  OUT_PATH,
  `${JSON.stringify(
    {
      stats: {
        totalCommitsYtd,
        yoyChange,
        longestStreakDays,
        currentStreakDays,
      },
      topRepos,
      contributionWeeks,
      commits,
    },
    null,
    2,
  )}\n`,
);
console.log(`Wrote activity data to ${OUT_PATH}`);
