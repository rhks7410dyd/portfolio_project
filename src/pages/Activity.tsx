import { useState } from 'react';
import {
  ACTIVITY_STATS,
  COMMITS,
  CONTRIBUTION_WEEKS,
  GITHUB_USERNAME,
  TOP_REPOS,
} from '../data/activity';

const CONTRIB_CLASSES = [
  'bg-surface-container-high',
  'bg-on-primary-fixed-variant',
  'bg-on-primary-container',
  'bg-primary-fixed-dim',
  'bg-primary',
];

const COMMITS_PAGE_SIZE = 4;

const Activity = () => {
  const [visibleCount, setVisibleCount] = useState(COMMITS_PAGE_SIZE);
  const hasMore = visibleCount < COMMITS.length;

  return (
    <div className="flex flex-col gap-lg">
      <header>
        <h1 className="font-headline-lg text-headline-lg text-on-background mb-sm">
          Commit History
        </h1>
        <p className="text-on-surface-variant">
          A detailed log of recent engineering activity and code contributions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        <aside className="md:col-span-3 flex flex-col gap-md">
          <div className="glass-panel rounded-lg p-md flex flex-col gap-sm">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Contributions (Last 12mo)
            </h3>
            <div className="text-3xl font-code-sm font-bold text-primary">
              {ACTIVITY_STATS.totalContributions}
            </div>
            <div className="flex items-center gap-xs text-on-surface-variant font-code-sm text-code-sm mt-xs">
              <span className="material-symbols-outlined text-sm">
                schedule
              </span>
              <span>
                Updated{' '}
                {new Date(ACTIVITY_STATS.generatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="glass-panel rounded-lg p-md flex flex-col gap-sm">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
              Longest Streak
            </h3>
            <div className="text-3xl font-code-sm font-bold text-primary">
              {ACTIVITY_STATS.longestStreakDays} Days
            </div>
            <div className="text-on-surface-variant font-code-sm text-code-sm mt-xs">
              Current: {ACTIVITY_STATS.currentStreakDays} Days
            </div>
          </div>
          <div className="glass-panel rounded-lg p-md">
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=transparent&hide_border=true&hide_title=true`}
              alt={`${GITHUB_USERNAME} GitHub stats`}
              className="w-full"
              loading="lazy"
            />
          </div>
          <div className="glass-panel rounded-lg p-md flex flex-col gap-sm">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-xs">
              Top Active Repos
            </h3>
            <ul className="flex flex-col gap-xs font-code-sm text-code-sm">
              {TOP_REPOS.map((repo) => (
                <li
                  key={repo.name}
                  className="flex justify-between items-center"
                >
                  <span className="text-secondary truncate">{repo.name}</span>
                  <span className="text-on-surface-variant bg-surface-container-high px-2 py-1 rounded text-xs">
                    {repo.commits}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="md:col-span-9 flex flex-col gap-lg">
          <div className="glass-panel rounded-lg p-md overflow-x-auto">
            <div className="flex justify-between items-center mb-sm">
              <h2 className="font-headline-md text-headline-md text-on-background text-[18px]">
                Contribution Graph
              </h2>
              <div className="flex items-center gap-2 font-code-sm text-code-sm text-on-surface-variant">
                <span>Less</span>
                {CONTRIB_CLASSES.map((cls) => (
                  <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
                ))}
                <span>More</span>
              </div>
            </div>
            <div className="flex gap-[3px] min-w-max pb-2">
              {CONTRIBUTION_WEEKS.map((week, col) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size deterministic grid
                <div key={col} className="flex flex-col gap-[3px]">
                  {week.map((intensity, row) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size deterministic grid
                      key={row}
                      className={`w-[10px] h-[10px] rounded-[2px] hover:border hover:border-primary cursor-pointer transition-colors ${CONTRIB_CLASSES[intensity]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container/40 border border-outline-variant/30 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-surface-container-highest px-md py-sm border-b border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-[16px] text-on-background">
                Recent Commits
              </h2>
            </div>
            <div className="flex flex-col">
              {COMMITS.slice(0, visibleCount).map((commit) => (
                <div
                  key={commit.hash}
                  className="p-md border-b border-outline-variant/20 last:border-b-0 hover:bg-surface-container-high/30 transition-colors group flex gap-md items-start"
                >
                  <div className="mt-1 text-outline group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">commit</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-xs">
                    <div className="flex flex-wrap items-center gap-x-sm gap-y-xs">
                      <span className="font-code-sm text-code-sm text-secondary bg-secondary-container/30 px-2 py-0.5 rounded border border-outline-variant/30">
                        {commit.repo}
                      </span>
                      <span className="font-code-sm text-code-sm text-on-surface-variant font-bold">
                        {commit.hash}
                      </span>
                      <span className="font-code-sm text-code-sm text-on-tertiary-container ml-auto">
                        {new Date(commit.when).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-background font-medium group-hover:text-primary transition-colors">
                      {commit.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="bg-surface-container-highest px-md py-sm border-t border-outline-variant/30 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + COMMITS_PAGE_SIZE)}
                  className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary hover:bg-surface-container/50 px-4 py-2 rounded transition-all border border-transparent hover:border-primary/50"
                >
                  Load More Commits
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Activity;
