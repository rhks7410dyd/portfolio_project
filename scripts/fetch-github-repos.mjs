// GitHub public repo -> src/data/github-projects.json
// Run: bun scripts/fetch-github-repos.mjs
// Scheduled daily by .github/workflows/update-projects.yml

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const GITHUB_USER = 'rhks7410dyd';
const OUT_PATH = fileURLToPath(
  new URL('../src/data/github-projects.json', import.meta.url),
);
const MAX_REPOS = 12;

const headers = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

const res = await fetch(
  `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
  { headers },
);
if (!res.ok) {
  throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
}

const repos = await res.json();

const projects = repos
  .filter((repo) => !repo.fork && !repo.archived)
  .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
  .slice(0, MAX_REPOS)
  .map((repo) => ({
    icon: 'code',
    title: repo.name,
    description: repo.description || 'No description provided.',
    tags: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 5),
    externalUrl: repo.homepage || undefined,
    codeUrl: repo.html_url,
    slug: repo.name,
    source: 'github',
  }));

await writeFile(OUT_PATH, `${JSON.stringify(projects, null, 2)}\n`);
console.log(`Wrote ${projects.length} projects to ${OUT_PATH}`);
