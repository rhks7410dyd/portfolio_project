import { expect, test } from '@rstest/core';
import { fmt, pick } from './format';
import { ancestorFolders, buildTree, countNotes } from './tree';
import type { NoteMeta } from './types';

const note = (
  slug: string,
  title = slug.split('/').pop() as string,
): NoteMeta => ({
  slug,
  title,
  tags: [],
  updated: '2026-01-01',
  minutes: 1,
  excerpt: '',
  links: [],
});

test('buildTree: folders first, natural sort, nested folders created once', () => {
  const tree = buildTree([
    note('root'),
    note('b/x'),
    note('a/n10'),
    note('a/n2'),
    note('a/sub/deep'),
  ]);
  expect(tree.map((n) => n.name)).toEqual(['a', 'b', 'root']);
  const a = tree[0];
  expect(a.children.map((n) => n.name)).toEqual(['sub', 'n2', 'n10']);
  expect(a.children[0].children[0].path).toBe('a/sub/deep');
  expect(countNotes(a)).toBe(3);
});

test('ancestorFolders lists every parent folder', () => {
  expect(ancestorFolders('a/b/c')).toEqual(['a', 'a/b']);
  expect(ancestorFolders('root')).toEqual([]);
});

test('fmt and pick', () => {
  expect(fmt('{n} of {m} {x}', { n: 1, m: 2 })).toBe('1 of 2 {x}');
  expect(pick({ ko: '가', en: 'a' }, 'ko')).toBe('가');
  expect(pick({ en: 'a' }, 'ko')).toBe('a');
});

test('resolveHtml turns build placeholders into real URLs', async () => {
  const { resolveHtml } = await import('./render');
  const out = resolveHtml(
    '<a href="note:Language/def#가나" data-note="Language/def">x</a><img src="asset:img/a b.png"><a href="https://x.dev">e</a>',
    'v1',
    'ko',
  );
  // the deploy base prefix depends on the build, so only assert what follows it
  expect(out).toContain('/ko/notes/v1/Language/def#%EA%B0%80%EB%82%98"');
  expect(out).toContain('notes/v1/assets/img/a%20b.png"');
  expect(out).toContain('href="https://x.dev"');
});

test('buildGraph: undirected, deduped, ignores self/unknown links; center keeps direct neighbors only', async () => {
  const { buildGraph } = await import('./graphLayout');
  const n = (slug: string, links: string[]) => ({ ...note(slug), links });
  const notes = [
    n('a', ['b', 'a', 'ghost']),
    n('b', ['a', 'c']),
    n('c', []),
    n('d', ['c']),
  ];
  const all = buildGraph(notes);
  expect(all.links).toHaveLength(3); // a-b (once), b-c, c-d
  expect(all.nodes.find((x) => x.id === 'b')?.degree).toBe(2);
  const local = buildGraph(notes, 'b');
  expect(local.nodes.map((x) => x.id).sort()).toEqual(['a', 'b', 'c']);
  expect(local.links).toHaveLength(2);
});

test('splitMatches marks query terms case-insensitively and escapes regex chars', async () => {
  const { splitMatches } = await import('./format');
  expect(splitMatches('Def and def.', ['def'])).toEqual([
    { text: 'Def', hit: true, at: 0 },
    { text: ' and ', hit: false, at: 3 },
    { text: 'def', hit: true, at: 8 },
    { text: '.', hit: false, at: 11 },
  ]);
  expect(splitMatches('a+b', ['+'])).toEqual([
    { text: 'a', hit: false, at: 0 },
    { text: '+', hit: true, at: 1 },
    { text: 'b', hit: false, at: 2 },
  ]);
  expect(splitMatches('x', [])).toEqual([{ text: 'x', hit: false, at: 0 }]);
});
