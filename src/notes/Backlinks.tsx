import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { notePath } from './api';
import type { Note } from './types';

const Backlinks = ({
  vaultId,
  items,
}: {
  vaultId: string;
  items: Note['backlinks'];
}) => {
  const { t, lang } = useLanguage();

  return (
    <section>
      <h3 className="font-label-caps text-label-caps text-primary mb-md border-b border-outline-variant/30 pb-xs">
        {t.notes.backlinks}
      </h3>
      {items.length ? (
        <ul className="flex flex-col gap-sm">
          {items.map((b) => (
            <li key={b.slug}>
              <Link
                to={notePath(lang, vaultId, b.slug)}
                className="group block"
              >
                <span className="font-code-sm text-code-sm text-on-surface group-hover:text-primary transition-colors">
                  {b.title}
                </span>
                <span className="block text-xs text-on-surface-variant line-clamp-2">
                  {b.excerpt}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-on-surface-variant">{t.notes.noBacklinks}</p>
      )}
    </section>
  );
};

export default Backlinks;
