import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useNote } from '../notes/api';
import Backlinks from '../notes/Backlinks';
import { fmt, formatDate, pick } from '../notes/format';
import Graph from '../notes/Graph';
import NoteBody from '../notes/NoteBody';
import TagChip from '../notes/TagChip';
import Toc from '../notes/Toc';
import { useVault } from './NotesVault';

const NotesNote = () => {
  const { vault, index, openGraph } = useVault();
  const { '*': slug = '' } = useParams();
  const { hash } = useLocation();
  const { t, lang } = useLanguage();
  const { data: note, error, loading } = useNote(vault.id, slug);

  // jump to #heading once the body is in the DOM, otherwise start at the top
  // biome-ignore lint/correctness/useExhaustiveDependencies: run when a different note finished loading
  useEffect(() => {
    if (!note) return;
    const el = hash
      ? document.getElementById(decodeURIComponent(hash.slice(1)))
      : null;
    if (el) el.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [note?.slug]);

  if (loading)
    return <p className="text-on-surface-variant">{t.notes.loading}</p>;
  if (error !== undefined || !note)
    return <p className="text-error">{t.notes.notFound}</p>;

  const home = `/${lang}/notes/${vault.id}`;
  const folders = note.slug.split('/').slice(0, -1);
  // a graph of one lonely dot says nothing
  const hasLinks =
    note.backlinks.length > 0 ||
    (index.notes.find((n) => n.slug === note.slug)?.links.length ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-lg items-start">
      <article className="min-w-0 flex flex-col gap-md">
        <nav
          aria-label="breadcrumb"
          className="font-code-sm text-code-sm text-on-surface-variant flex flex-wrap items-center gap-xs"
        >
          <Link to={home} className="hover:text-primary transition-colors">
            {pick(vault.title, lang)}
          </Link>
          {folders.map((f) => (
            <span key={f} className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
              {f}
            </span>
          ))}
        </nav>
        <h1 className="font-headline-lg text-headline-lg text-on-background">
          {note.title}
        </h1>
        <div className="flex flex-wrap items-center gap-sm font-code-sm text-[11px] text-outline">
          <span>
            {fmt(t.notes.updated, { date: formatDate(note.updated, lang) })}
          </span>
          <span>·</span>
          <span>{fmt(t.notes.minRead, { n: note.minutes })}</span>
          {note.tags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              to={`${home}?tag=${encodeURIComponent(tag)}`}
            />
          ))}
        </div>
        <div lang={vault.lang}>
          <NoteBody html={note.html} vaultId={vault.id} lang={lang} />
        </div>
      </article>

      <aside className="flex flex-col gap-lg xl:sticky xl:top-[88px] xl:max-h-[calc(100vh-112px)] xl:overflow-y-auto">
        <Toc items={note.toc} />
        <Backlinks vaultId={vault.id} items={note.backlinks} />
        {hasLinks && (
          <section>
            <h3 className="font-label-caps text-label-caps text-primary mb-md border-b border-outline-variant/30 pb-xs flex items-center justify-between">
              {t.notes.graphLocal}
              <button
                type="button"
                onClick={openGraph}
                aria-label={t.notes.graph}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  open_in_full
                </span>
              </button>
            </h3>
            <Graph
              notes={index.notes}
              vaultId={vault.id}
              activeSlug={note.slug}
              local
              className="w-full h-48 glass-panel rounded"
            />
          </section>
        )}
      </aside>
    </div>
  );
};

export default NotesNote;
