import { expect, test } from '@rstest/core';
import {
  buildBacklinks,
  makeResolver,
  readingMinutes,
  renderNote,
  slugify,
} from './pipeline.mjs';

const slugs = [
  'index',
  'MOC',
  'Language/Python/def',
  'Practice/Python/x/index',
  'Practice/Java/README',
  'Language/README',
];
const resolve = makeResolver(slugs);
const ctx = (slug = 'Language/Python/decorator') => ({
  slug,
  resolve,
  assets: new Set(['img/a.png']),
  assetByName: new Map([['a.png', 'img/a.png']]),
});

test('slugify makes paths URL- and file-safe', () => {
  expect(slugify('Practice/My Note.md')).toBe('Practice/My-Note');
  expect(slugify('a\\b?.md')).toBe('a/b_');
});

test('resolver: basename (shortest path wins), path suffix, case-insensitive, unknown', () => {
  expect(resolve('MOC')).toBe('MOC');
  expect(resolve('moc')).toBe('MOC');
  expect(resolve('def')).toBe('Language/Python/def');
  expect(resolve('index')).toBe('index'); // root index beats nested ones
  expect(resolve('Practice/README')).toBe(null); // no such note: README exists only under Java/ and Language/
  expect(resolve('Java/README')).toBe('Practice/Java/README');
  expect(resolve('nope')).toBe(null);
});

test('buildBacklinks reverses links and ignores self links', () => {
  const back = buildBacklinks([
    { slug: 'a', links: ['b', 'a'] },
    { slug: 'b', links: ['a'] },
  ]);
  expect(back.get('b')).toEqual(['a']);
  expect(back.get('a')).toEqual(['b']);
});

test('renderNote: wikilinks, alias, anchor, broken link, links collected', async () => {
  const r = await renderNote(
    'See [[MOC|목차]] and [[def#Some Heading]] and [[ghost]].',
    ctx(),
  );
  expect(r.html).toContain(
    '<a href="note:MOC" class="wikilink" data-note="MOC">목차</a>',
  );
  expect(r.html).toContain('href="note:Language/Python/def#some-heading"');
  expect(r.html).toContain('<span class="wikilink-broken">ghost</span>');
  expect(r.links.sort()).toEqual(['Language/Python/def', 'MOC']);
});

test('renderNote: title from H1 (removed from body), frontmatter title wins, toc + ids', async () => {
  const a = await renderNote(
    '# My Title\n\n## First\n\ntext\n\n### Second\n',
    ctx(),
  );
  expect(a.title).toBe('My Title');
  expect(a.html).not.toContain('My Title');
  expect(a.toc).toEqual([
    { depth: 2, id: 'first', text: 'First' },
    { depth: 3, id: 'second', text: 'Second' },
  ]);
  const b = await renderNote('---\ntitle: FM\n---\n# Other\n', ctx());
  expect(b.title).toBe('FM');
  expect(b.html).toContain('Other');
  const c = await renderNote(
    'no heading here',
    ctx('Language/Python/some-note'),
  );
  expect(c.title).toBe('some note');
});

test('renderNote: callout, tags, comments, task of code not treated as tags', async () => {
  const r = await renderNote(
    [
      '> [!warning] Careful',
      '> body line',
      '',
      'inline #python tag, `#notatag` and %%hidden%% C# 1',
      '',
      '```py',
      '# comment',
      '```',
    ].join('\n'),
    ctx(),
  );
  expect(r.html).toContain('class="callout" data-callout="warning"');
  expect(r.html).toContain('<div class="callout-title">Careful</div>');
  expect(r.html).toContain('body line');
  expect(r.tags).toEqual(['python']);
  expect(r.html).not.toContain('hidden');
  expect(r.html).toContain('shiki'); // code highlighted at build time
});

test('renderNote: frontmatter tags, draft flag, image embeds and relative md links', async () => {
  const r = await renderNote(
    '---\ntags: [a, "#b"]\ndraft: true\n---\n![[a.png]]\n\n[rel](../Python/def.md#x) ![](img/a.png)',
    ctx('Language/Other/n'),
  );
  expect(r.draft).toBe(true);
  expect(r.tags).toEqual(['a', 'b']);
  expect(r.html).toContain('src="asset:img/a.png"');
  expect(r.html).toContain('href="note:Language/Python/def#x"');
});

test('readingMinutes counts CJK characters and latin words', () => {
  expect(readingMinutes('word '.repeat(400))).toBe(2);
  expect(readingMinutes('가'.repeat(1000))).toBe(2);
  expect(readingMinutes('')).toBe(1);
});

test('renderNote: a literal "[[]]" in prose stays text; unresolved targets are reported', async () => {
  const r = await renderNote(
    'Link notes with [[]] and see [[ghost]] or [x](nope.md).',
    ctx(),
  );
  expect(r.html).toContain('with [[]] and');
  expect(r.html).not.toContain('data-note');
  expect(r.broken.sort()).toEqual(['ghost', 'nope.md']);
  expect(r.links).toEqual([]);
});
