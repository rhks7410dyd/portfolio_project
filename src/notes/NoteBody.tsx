import { type MouseEvent, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { notePath } from './api';
import { resolveHtml } from './render';

type Props = { html: string; vaultId: string; lang: string };

/** Renders build-time note html. Trusted: it comes from our own vault via scripts/build-notes.mjs. */
const NoteBody = ({ html, vaultId, lang }: Props) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const resolved = useMemo(
    () => resolveHtml(html, vaultId, lang),
    [html, vaultId, lang],
  );

  // SPA navigation for wikilinks; real hrefs stay so middle-click / copy link work
  const onClick = (e: MouseEvent) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[data-note]',
    );
    if (!a) return;
    e.preventDefault();
    const hash = a.getAttribute('href')?.match(/#.*$/)?.[0] ?? '';
    navigate(notePath(lang, vaultId, a.dataset.note as string, hash));
  };

  // copy buttons on code blocks (added after mount; the html itself is static)
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run only when the rendered html changes
  useEffect(() => {
    const buttons: HTMLButtonElement[] = [];
    for (const pre of ref.current?.querySelectorAll('pre') ?? []) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = t.notes.copy;
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(
          pre.querySelector('code')?.innerText ?? '',
        );
        btn.textContent = t.notes.copied;
        setTimeout(() => {
          btn.textContent = t.notes.copy;
        }, 1500);
      });
      pre.appendChild(btn);
      buttons.push(btn);
    }
    return () => {
      for (const b of buttons) b.remove();
    };
  }, [resolved]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: delegated click on real <a> children, keyboard users get native link activation
    // biome-ignore lint/a11y/noStaticElementInteractions: same
    <div
      ref={ref}
      className="note-prose"
      onClick={onClick}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: html is generated from the owner's own vault at build time, not user input
      dangerouslySetInnerHTML={{ __html: resolved }}
    />
  );
};

export default NoteBody;
