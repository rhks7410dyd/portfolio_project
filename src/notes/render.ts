import { appHref, assetUrl, notePath } from './api';

/**
 * The build leaves `note:<slug>#<id>` links and `asset:<relPath>` images in
 * the html (see scripts/notes/pipeline.mjs). Turn them into real URLs here,
 * where the language, vault id and deploy base are known.
 */
export const resolveHtml = (html: string, vaultId: string, lang: string) =>
  html.replace(
    /\b(href|src)="(note|asset):([^"]*)"/g,
    (_m, attr, kind, rest) => {
      if (kind === 'asset') return `${attr}="${assetUrl(vaultId, rest)}"`;
      const [slug, hash] = rest.split('#');
      return `${attr}="${appHref(notePath(lang, vaultId, slug, hash ? `#${encodeURIComponent(hash)}` : ''))}"`;
    },
  );
