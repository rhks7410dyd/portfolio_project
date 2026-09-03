// Fetches this user's GitHub contribution calendar + recent public commits
// and writes a static snapshot consumed by src/pages/Activity.tsx.
// Run by .github/workflows/github-activity.yml on a daily cron.

const username = process.env.GH_USERNAME;
const token = process.env.GITHUB_TOKEN;

if (!username || !token) {
  console.error('GH_USERNAME and GITHUB_TOKEN env vars are required');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  'User-Agent': 'portfolio-activity-snapshot',
};

const graphqlQuery = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
            }
          }
        }
      }
    }
  }
`;

async function fetchContributionCalendar() {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: graphqlQuery,
      variables: { login: username },
    }),
  });
  if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(JSON.stringify(errors));
  return data.user.contributionsCollection.contributionCalendar;
}

// Bucket a raw contribution count into the 0-4 intensity levels the UI renders.
function toIntensity(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

async function fetchRecentPushEvents() {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    { headers },
  );
  if (!res.ok) throw new Error(`Events request failed: ${res.status}`);
  return res.json();
}

function summarizeCommits(events) {
  const pushEvents = events.filter((e) => e.type === 'PushEvent');

  const repoCounts = new Map();
  for (const event of pushEvents) {
    const repo = event.repo.name;
    repoCounts.set(
      repo,
      (repoCounts.get(repo) ?? 0) + event.payload.commits.length,
    );
  }
  const topRepos = [...repoCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, commits]) => ({ name, commits }));

  const recentCommits = pushEvents.slice(0, 10).flatMap((event) =>
    event.payload.commits.slice(0, 1).map((commit) => ({
      repo: event.repo.name.split('/')[1] ?? event.repo.name,
      hash: `#${commit.sha.slice(0, 7)}`,
      when: event.created_at,
      message: commit.message.split('\n')[0],
    })),
  );

  return {
    topRepos,
    recentCommits,
    totalPushedCommits: pushEvents.reduce(
      (n, e) => n + e.payload.commits.length,
      0,
    ),
  };
}

const [calendar, events] = await Promise.all([
  fetchContributionCalendar(),
  fetchRecentPushEvents(),
]);

const weeks = calendar.weeks.map((week) =>
  week.contributionDays.map((day) => toIntensity(day.contributionCount)),
);

const { topRepos, recentCommits, totalPushedCommits } =
  summarizeCommits(events);

const snapshot = {
  generatedAt: new Date().toISOString(),
  username,
  totalContributionsLastYear: calendar.totalContributions,
  totalPushedCommitsLast90Days: totalPushedCommits,
  contributionWeeks: weeks,
  topRepos,
  recentCommits,
};

const fs = await import('node:fs/promises');
await fs.writeFile(
  new URL('../src/data/github-activity.json', import.meta.url),
  `${JSON.stringify(snapshot, null, 2)}\n`,
);

console.log(
  `Wrote snapshot for ${username}: ${calendar.totalContributions} contributions/yr, ${recentCommits.length} recent commits.`,
);
