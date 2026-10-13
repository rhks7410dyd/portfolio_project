// Obsidian markdown -> { html, toc, links, tags, ... }. Pure functions; no fs.
// Used by scripts/build-notes.mjs, which writes the results to public/notes/.

import rehypeShiki from '@shikijs/rehype';
import GithubSlugger from 'github-slugger';
import matter from 'gray-matter';
import { findAndReplace } from 'mdast-util-find-and-replace';
import { toString as mdToString } from 'mdast-util-to-string';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)$/i;

/** "Practice/Python/My Note.md" -> "Practice/Python/My-Note" (URL- and file-safe) */
export const slugify = (relPath) =>
  relPath
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .replace(/\s+/g, '-')
    .replace(/[?#%:*"<>|]/g, '_');

const norm = (s) => slugify(s.trim()).toLowerCase();

/**
 * Obsidian "shortest path" link resolution: `[[name]]` matches by basename
 * (shortest path wins on ties), `[[dir/name]]` matches by path suffix.
 */
export const makeResolver = (slugs) => {
  const sorted = [...slugs].sort(
    (a, b) => a.length - b.length || a.localeCompare(b),
  );
  const byBase = new Map();
  for (const slug of sorted) {
    const base = norm(slug.split('/').pop());
    if (!byBase.has(base)) byBase.set(base, slug);
  }
  return (target) => {
    const t = norm(target);
    if (!t) return null;
    if (!t.includes('/')) return byBase.get(t) ?? null;
    return (
      sorted.find((s) => norm(s) === t || norm(s).endsWith(`/${t}`)) ?? null
    );
  };
};

/** reverse the `links` graph: slug -> [slugs that link to it] */
export const buildBacklinks = (notes) => {
  const back = new Map(notes.map((n) => [n.slug, []]));
  for (const n of notes) {
    for (const to of n.links) if (to !== n.slug) back.get(to)?.push(n.slug);
  }
  return back;
};

const WIKILINK = /(!)?\[\[([^\]|#]*)(#[^\]|]*)?(?:\|([^\]]*))?\]\]/g;
const INLINE_TAG = /(?<![\w&/#])#([\p{L}\p{N}_][\p{L}\p{N}_/-]*)/gu;
const slugger = new GithubSlugger();
const headingId = (text) => {
  slugger.reset();
  return slugger.slug(text);
};

const dirOf = (slug) => slug.split('/').slice(0, -1).join('/');
const joinPath = (dir, rel) => {
  const out = dir ? dir.split('/') : [];
  for (const part of rel.split('/')) {
    if (part === '..') out.pop();
    else if (part && part !== '.') out.push(part);
  }
  return out.join('/');
};

/**
 * Mutates the mdast tree: wikilinks/embeds -> links/images, callouts ->
 * <div class="callout">, relative .md links -> note links. Collects links
 * and inline tags. `ctx`: { slug, resolve, assets: Set<relPath>, assetByName: Map }
 */
const transformMdast = (tree, ctx) => {
  const links = new Set();
  const tags = new Set();
  const broken = new Set();
  const noteUrl = (slug, hash = '') =>
    `note:${slug}${hash ? `#${headingId(hash.replace(/^#/, ''))}` : ''}`;

  findAndReplace(tree, [
    [
      WIKILINK,
      (_m, bang, target, hash, alias) => {
        // "[[]]" written in prose (e.g. explaining the syntax) is not a link; Obsidian shows it as text
        if (!target.trim() && !hash) return false;
        const label = (alias || target || hash?.slice(1) || '').trim();
        if (bang && IMAGE_EXT.test(target)) {
          const rel = ctx.assetByName.get(
            target.trim().split('/').pop().toLowerCase(),
          );
          return rel
            ? { type: 'image', url: `asset:${rel}`, alt: alias || target }
            : { type: 'text', value: label };
        }
        const slug = target.trim() ? ctx.resolve(target) : ctx.slug;
        if (!slug) {
          broken.add(target.trim());
          return {
            type: 'emphasis',
            data: {
              hName: 'span',
              hProperties: { className: ['wikilink-broken'] },
            },
            children: [{ type: 'text', value: label }],
          };
        }
        links.add(slug);
        return {
          type: 'link',
          url: noteUrl(slug, hash),
          data: {
            hProperties: {
              className: bang ? ['wikilink', 'embed'] : ['wikilink'],
              'data-note': slug,
            },
          },
          children: [{ type: 'text', value: label }],
        };
      },
    ],
    [
      INLINE_TAG,
      (_m, tag) => {
        if (!/^\d+$/.test(tag)) tags.add(tag);
        return false; // collect only; leave the text as-is
      },
    ],
  ]);

  visit(tree, 'link', (node) => {
    if (!node.url || /^([a-z][a-z0-9+.-]*:|#|\/)/i.test(node.url)) return;
    const [path, hash] = decodeURI(node.url).split('#');
    if (!/\.md$/i.test(path)) return;
    const slug =
      ctx.resolve(joinPath(dirOf(ctx.slug), path)) ?? ctx.resolve(path);
    if (!slug) {
      broken.add(path);
      return;
    }
    links.add(slug);
    node.url = noteUrl(slug, hash ? `#${hash}` : '');
    node.data = { hProperties: { className: ['wikilink'], 'data-note': slug } };
  });

  visit(tree, 'image', (node) => {
    if (!node.url || /^([a-z][a-z0-9+.-]*:|\/)/i.test(node.url)) return;
    const rel = joinPath(dirOf(ctx.slug), decodeURI(node.url));
    if (ctx.assets.has(rel)) node.url = `asset:${rel}`;
  });

  visit(tree, 'blockquote', (node) => {
    const first = node.children[0];
    const text =
      first?.type === 'paragraph' && first.children[0]?.type === 'text'
        ? first.children[0]
        : null;
    const m = text?.value.match(/^\[!(\w+)\][+-]?[ \t]*([^\n]*)\n?/);
    if (!m) return;
    text.value = text.value.slice(m[0].length);
    if (!text.value) first.children.shift();
    const [, type, title] = m;
    node.data = {
      hName: 'div',
      hProperties: {
        className: ['callout'],
        'data-callout': type.toLowerCase(),
      },
    };
    node.children = [
      {
        type: 'paragraph',
        data: { hName: 'div', hProperties: { className: ['callout-title'] } },
        children: [
          {
            type: 'text',
            value: title || type[0].toUpperCase() + type.slice(1).toLowerCase(),
          },
        ],
      },
      ...(first.children.length ? [first] : []),
      ...node.children.slice(1),
    ];
  });

  return { links, tags, broken };
};

const hastText = (node) =>
  node.type === 'text'
    ? node.value
    : (node.children ?? []).map(hastText).join('');

const collectToc = (hast) => {
  const toc = [];
  visit(hast, 'element', (node) => {
    if (/^h[2-4]$/.test(node.tagName) && node.properties?.id) {
      toc.push({
        depth: Number(node.tagName[1]),
        id: String(node.properties.id),
        text: hastText(node).trim(),
      });
    }
  });
  return toc;
};

const CJK =
  /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;
export const readingMinutes = (text) => {
  const cjk = (text.match(CJK) ?? []).length;
  const words = text.replace(CJK, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 500 + words / 200));
};

const asArray = (v) =>
  Array.isArray(v) ? v : v ? String(v).split(/[,\s]+/) : [];

/**
 * @param {string} raw      file contents
 * @param {object} ctx      { slug, resolve, assets, assetByName }
 */
export const renderNote = async (raw, ctx) => {
  const { data, content } = matter(raw);
  const body = content.replace(/%%[\s\S]*?%%/g, '');
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body);

  let title = typeof data.title === 'string' ? data.title : '';
  const h1 = tree.children.find((n) => n.type === 'heading');
  if (h1?.depth === 1 && tree.children[0] === h1) {
    const h1Text = mdToString(h1);
    if (!title || title === h1Text) {
      title = h1Text;
      tree.children.shift();
    }
  }
  if (!title) title = ctx.slug.split('/').pop().replace(/-/g, ' ');

  const { links, tags, broken } = transformMdast(tree, ctx);
  for (const t of asArray(data.tags)) tags.add(String(t).replace(/^#/, ''));

  // after the transform so wikilinks contribute their labels, not "[[...]]"
  const firstPara = tree.children.find((n) => n.type === 'paragraph');
  const excerpt = firstPara
    ? mdToString(firstPara).replace(/\s+/g, ' ').slice(0, 140)
    : '';
  const text = mdToString(tree).replace(/\s+/g, ' ').trim();

  const hast = await unified()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      fallbackLanguage: 'text',
    })
    .run(tree);
  const html = unified().use(rehypeStringify).stringify(hast);

  const date = data.date ?? data.updated;
  return {
    title,
    html,
    toc: collectToc(hast),
    links: [...links],
    /** link targets that match no note; rendered as .wikilink-broken */
    broken: [...broken],
    tags: [...tags].sort(),
    excerpt,
    text,
    minutes: readingMinutes(text),
    draft: data.draft === true || data.publish === false,
    date:
      date instanceof Date ? date.toISOString() : date ? String(date) : null,
  };
};
