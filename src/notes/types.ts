// Shapes of the JSON written by scripts/build-notes.mjs into public/notes/

export type Localized = Record<string, string>;

export type VaultMeta = {
  id: string;
  icon: string;
  lang: string;
  title: Localized;
  description: Localized;
  count: number;
  updated: string | null;
};

export type NoteMeta = {
  slug: string;
  title: string;
  tags: string[];
  updated: string;
  minutes: number;
  excerpt: string;
  /** slugs this note links to */
  links: string[];
};

export type VaultIndex = {
  id: string;
  notes: NoteMeta[];
  /** tag -> number of notes */
  tags: Record<string, number>;
};

export type TocItem = { depth: number; id: string; text: string };

export type Note = {
  slug: string;
  title: string;
  tags: string[];
  updated: string;
  minutes: number;
  /** note links are `note:<slug>#<id>` and images `asset:<relPath>` until rendered, see render.ts */
  html: string;
  toc: TocItem[];
  backlinks: { slug: string; title: string; excerpt: string }[];
};
