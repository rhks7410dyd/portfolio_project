import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { notePath } from '../notes/api';
import { fmt, formatDate, pick } from '../notes/format';
import TagChip from '../notes/TagChip';
import { useVault } from './NotesVault';

const RECENT_LIMIT = 10;

const NotesVaultHome = () => {
  const { vault, index } = useVault();
  const { t, lang } = useLanguage();
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag');
  const home = `/${lang}/notes/${vault.id}`;

  const sorted = [...index.notes].sort((a, b) =>
    b.updated.localeCompare(a.updated),
  );
  const list = tag
    ? sorted.filter((n) => n.tags.includes(tag))
    : sorted.slice(0, RECENT_LIMIT);
  const tags = Object.entries(index.tags).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-lg items-start">
      <div className="flex flex-col gap-lg min-w-0">
        <header className="flex flex-col gap-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            {pick(vault.title, lang)}
          </h1>
          <p className="text-on-surface-variant">
            {pick(vault.description, lang)}
          </p>
          <p className="font-code-sm text-[11px] text-outline">
            {fmt(t.notes.noteCount, { n: vault.count })}
            {vault.updated &&
              ` · ${fmt(t.notes.updated, { date: formatDate(vault.updated, lang) })}`}
          </p>
        </header>

        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-sm">
            <span className="material-symbols-outlined">
              {tag ? 'sell' : 'schedule'}
            </span>
            {tag ? fmt(t.notes.filterTag, { tag }) : t.notes.recent}
            {tag && (
              <button
                type="button"
                onClick={() => setParams({})}
                className="ml-sm font-label-caps text-label-caps text-on-surface-variant hover:text-primary"
              >
                {t.notes.clearFilter}
              </button>
            )}
          </h2>
          <ul className="flex flex-col gap-sm">
            {list.map((n) => (
              <li key={n.slug}>
                <Link
                  to={notePath(lang, vault.id, n.slug)}
                  className="glass-panel rounded p-md flex flex-col gap-xs group"
                >
                  <span className="flex justify-between items-baseline gap-md">
                    <span className="font-label-caps text-label-caps text-on-surface group-hover:text-primary transition-colors">
                      {n.title}
                    </span>
                    <span className="font-code-sm text-[11px] text-outline shrink-0">
                      {formatDate(n.updated, lang)}
                    </span>
                  </span>
                  {n.excerpt && (
                    <span className="text-sm text-on-surface-variant line-clamp-2">
                      {n.excerpt}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {tags.length > 0 && (
        <aside className="xl:sticky xl:top-[88px]">
          <h3 className="font-label-caps text-label-caps text-primary mb-md border-b border-outline-variant/30 pb-xs">
            {t.notes.tags}
          </h3>
          <div className="flex flex-wrap gap-sm">
            {tags.map(([name, count]) => (
              <TagChip
                key={name}
                tag={name}
                count={count}
                active={name === tag}
                to={`${home}?tag=${encodeURIComponent(name)}`}
              />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};

export default NotesVaultHome;
