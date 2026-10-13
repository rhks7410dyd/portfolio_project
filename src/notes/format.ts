import type { Localized } from './types';

/** fmt('{n} NOTES', { n: 3 }) -> '3 NOTES' */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));

export const formatDate = (iso: string | null, lang: string) =>
  iso
    ? new Date(iso).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

/** localized text for the UI language, falling back to English, then anything */
export const pick = (text: Localized, lang: string) =>
  text[lang] ?? text.en ?? Object.values(text)[0] ?? '';

/** split text into runs, marking the ones that match any query term (for <mark>); `at` is the run's offset, a stable key */
export const splitMatches = (text: string, terms: string[]) => {
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const usable = terms.filter(Boolean).map(escapeRegExp);
  if (!usable.length) return [{ text, hit: false, at: 0 }];
  let at = 0;
  return text
    .split(new RegExp(`(${usable.join('|')})`, 'gi'))
    .map((s, i) => {
      const run = { text: s, hit: i % 2 === 1, at }; // split() puts the captures at odd indexes
      at += s.length;
      return run;
    })
    .filter((p) => p.text);
};
