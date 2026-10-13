// Obsidian vaults -> public/notes/ (static JSON read by the /notes pages)
// Run: bun scripts/build-notes.mjs
// Vaults are listed in notes.config.json; output is committed like the other
// generated data, so CI never needs the vault checkout.
//
// public/notes/vaults.json              vault list for the hub
// public/notes/<id>/index.json          note list (meta + links), tag counts
// public/notes/<id>/n/<slug>.json       one note: html, toc, backlinks
// public/notes/<id>/search.json         serialized MiniSearch index
// public/notes/<id>/assets/<relPath>    images referenced by notes

import { execFileSync } from 'node:child_process';
import {
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MiniSearch from 'minisearch';
import {
  buildBacklinks,
  IMAGE_EXT,
  makeResolver,
  renderNote,
  slugify,
} from './notes/pipeline.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'notes');
const SEARCH_OPTIONS = JSON.parse(
  await readFile(join(ROOT, 'src/notes/search-options.json'), 'utf8'),
);

const walk = async (dir, base = dir) => {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue; // .obsidian, .git, .trash ...
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full, base)));
    else files.push({ full, rel: relative(base, full).replace(/\\/g, '/') });
  }
  return files;
};

const updatedAt = async (file) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: dirname(file),
      encoding: 'utf8',
    }).trim();
    if (out) return out;
  } catch {}
  return (await stat(file)).mtime.toISOString();
};

const writeJson = async (path, data) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data));
};

const buildVault = async (cfg) => {
  const source = resolve(ROOT, cfg.source);
  const outDir = join(OUT, cfg.id);
  const files = await walk(source);
  const mdFiles = files.filter((f) => /\.md$/i.test(f.rel));
  const assetFiles = files.filter((f) => IMAGE_EXT.test(f.rel));

  const assets = new Set(assetFiles.map((f) => f.rel));
  const assetByName = new Map(
    assetFiles.map((f) => [f.rel.split('/').pop().toLowerCase(), f.rel]),
  );

  // first pass: render everything, drop drafts, then resolve links among what's left
  const rendered = [];
  const slugOf = (rel) => slugify(rel);
  const slugs = mdFiles.map((f) => slugOf(f.rel));
  const resolveLink = makeResolver(slugs);
  for (const f of mdFiles) {
    const slug = slugOf(f.rel);
    const r = await renderNote(await readFile(f.full, 'utf8'), {
      slug,
      resolve: resolveLink,
      assets,
      assetByName,
    });
    if (r.draft) continue;
    rendered.push({ slug, file: f.full, ...r });
  }
  const published = new Set(rendered.map((n) => n.slug));
  const broken = []; // "note -> [[target]]" for every link that points nowhere
  for (const n of rendered) {
    const before = n.links.length;
    n.links = n.links.filter((s) => published.has(s));
    if (before !== n.links.length)
      broken.push(`${n.slug} -> link to an unpublished (draft) note`);
    for (const target of n.broken) broken.push(`${n.slug} -> [[${target}]]`);
    n.updated = n.date ?? (await updatedAt(n.file));
  }
  rendered.sort((a, b) => a.slug.localeCompare(b.slug));
  const byslug = new Map(rendered.map((n) => [n.slug, n]));
  const back = buildBacklinks(rendered);

  await rm(outDir, { recursive: true, force: true });
  for (const n of rendered) {
    await writeJson(join(outDir, 'n', `${n.slug}.json`), {
      slug: n.slug,
      title: n.title,
      tags: n.tags,
      updated: n.updated,
      minutes: n.minutes,
      html: n.html,
      toc: n.toc,
      backlinks: back.get(n.slug).map((s) => ({
        slug: s,
        title: byslug.get(s).title,
        excerpt: byslug.get(s).excerpt,
      })),
    });
  }

  const tags = {};
  for (const n of rendered)
    for (const t of n.tags) tags[t] = (tags[t] ?? 0) + 1;
  await writeJson(join(outDir, 'index.json'), {
    id: cfg.id,
    notes: rendered.map(
      ({ slug, title, tags, updated, minutes, excerpt, links }) => ({
        slug,
        title,
        tags,
        updated,
        minutes,
        excerpt,
        links,
      }),
    ),
    tags,
  });

  const search = new MiniSearch(SEARCH_OPTIONS);
  search.addAll(
    rendered.map((n) => ({
      id: n.slug,
      title: n.title,
      tags: n.tags.join(' '),
      text: n.text.slice(0, 20000),
      excerpt: n.excerpt,
    })),
  );
  await writeJson(join(outDir, 'search.json'), search.toJSON());

  for (const rel of assets) {
    await mkdir(dirname(join(outDir, 'assets', rel)), { recursive: true });
    await cp(join(source, rel), join(outDir, 'assets', rel));
  }

  return {
    id: cfg.id,
    icon: cfg.icon,
    lang: cfg.lang,
    title: cfg.title,
    description: cfg.description,
    count: rendered.length,
    updated:
      rendered
        .map((n) => n.updated)
        .sort()
        .at(-1) ?? null,
    _stats: {
      skipped: mdFiles.length - rendered.length,
      broken,
      assets: assets.size,
    },
  };
};

const config = JSON.parse(
  await readFile(join(ROOT, 'notes.config.json'), 'utf8'),
);
await mkdir(OUT, { recursive: true });
const vaults = [];
for (const cfg of config.vaults) {
  const { _stats, ...meta } = await buildVault(cfg);
  console.log(
    `${cfg.id}: ${meta.count} notes (${_stats.skipped} drafts skipped, ${_stats.broken.length} unresolved links, ${_stats.assets} assets)`,
  );
  for (const b of _stats.broken) console.log(`  unresolved: ${b}`);
  vaults.push(meta);
}
await writeJson(join(OUT, 'vaults.json'), vaults);
