import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { notePath, useSearchEngine } from './api';
import { fmt, splitMatches } from './format';
import Modal from './Modal';

const MAX_RESULTS = 20;

type Props = { vaultId: string; open: boolean; onClose: () => void };

const Highlight = ({ text, terms }: { text: string; terms: string[] }) => (
  <>
    {splitMatches(text, terms).map((p) =>
      p.hit ? (
        <mark
          key={p.at}
          className="bg-primary-container text-on-primary-container rounded-sm"
        >
          {p.text}
        </mark>
      ) : (
        <span key={p.at}>{p.text}</span>
      ),
    )}
  </>
);

const Results = ({ vaultId, onClose }: Omit<Props, 'open'>) => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const { data: engine, error } = useSearchEngine(vaultId, true);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const trimmed = query.trim();
  const terms = trimmed.split(/\s+/).filter(Boolean);
  const results = useMemo(
    () =>
      engine && trimmed
        ? engine
            .search(trimmed, {
              prefix: true,
              fuzzy: 0.15,
              combineWith: 'AND',
              boost: { title: 3, tags: 2 },
            })
            .slice(0, MAX_RESULTS)
        : [],
    [engine, trimmed],
  );

  const go = (slug: string) => {
    onClose();
    navigate(notePath(lang, vaultId, slug));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')
      setSelected((s) => Math.min(s + 1, results.length - 1));
    else if (e.key === 'ArrowUp') setSelected((s) => Math.max(s - 1, 0));
    else if (e.key === 'Enter' && results[selected]) go(results[selected].id);
    else return;
    e.preventDefault();
  };

  return (
    <div className="w-[min(640px,92vw)] flex flex-col">
      <div className="flex items-center gap-sm px-md border-b border-outline-variant">
        <span className="material-symbols-outlined text-on-surface-variant">
          search
        </span>
        <input
          // biome-ignore lint/a11y/noAutofocus: the dialog exists only to type a query
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={t.notes.searchPlaceholder}
          aria-label={t.notes.search}
          className="flex-1 bg-transparent py-md outline-none text-on-surface placeholder:text-outline"
        />
        <kbd className="font-code-sm text-[11px] text-outline border border-outline-variant rounded px-1.5 py-0.5">
          Esc
        </kbd>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        {error !== undefined && (
          <p className="p-md text-error">{t.notes.loadError}</p>
        )}
        {terms.length > 0 && engine && results.length === 0 && (
          <p className="p-md text-on-surface-variant">
            {fmt(t.notes.noResults, { q: query.trim() })}
          </p>
        )}
        <ul>
          {results.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                aria-current={i === selected}
                onClick={() => go(r.id)}
                onMouseEnter={() => setSelected(i)}
                className={`w-full text-left px-md py-sm flex flex-col gap-xs ${i === selected ? 'bg-primary/10' : ''}`}
              >
                <span className="font-label-caps text-label-caps text-on-surface">
                  <Highlight text={r.title} terms={terms} />
                </span>
                <span className="text-xs text-on-surface-variant line-clamp-2">
                  <Highlight text={r.excerpt} terms={terms} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SearchModal = ({ vaultId, open, onClose }: Props) => {
  const { t } = useLanguage();
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={t.notes.search}
      className="mt-[10vh] mb-auto"
    >
      <Results vaultId={vaultId} onClose={onClose} />
    </Modal>
  );
};

export default SearchModal;
