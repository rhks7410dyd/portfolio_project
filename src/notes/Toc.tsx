import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { TocItem } from './types';

/** id of the last heading that has scrolled past the top of the viewport */
const useActiveHeading = (items: TocItem[]) => {
  const [active, setActive] = useState('');

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return active;
};

const Toc = ({ items }: { items: TocItem[] }) => {
  const { t } = useLanguage();
  const active = useActiveHeading(items);
  if (!items.length) return null;

  return (
    <nav aria-label={t.notes.onThisPage}>
      <h3 className="font-label-caps text-label-caps text-primary mb-md border-b border-outline-variant/30 pb-xs">
        {t.notes.onThisPage}
      </h3>
      <ul className="flex flex-col gap-xs">
        {items.map((i) => (
          <li key={i.id} style={{ paddingLeft: (i.depth - 2) * 12 }}>
            <a
              href={`#${encodeURIComponent(i.id)}`}
              className={`block text-sm leading-snug transition-colors ${i.id === active ? 'text-primary font-medium' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Toc;
