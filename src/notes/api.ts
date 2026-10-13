import MiniSearch, { type AsPlainObject } from 'minisearch';
import { useEffect, useRef, useState } from 'react';
import searchOptions from './search-options.json';
import type { Note, VaultIndex, VaultMeta } from './types';

// server.base from rsbuild.config.ts, always with a trailing slash ('/' under rstest, which doesn't set it)
const BASE = import.meta.env.BASE_URL ?? '/';

/** encode each path segment, keep the slashes of a slug */
export const seg = (path: string) =>
  path.split('/').map(encodeURIComponent).join('/');

const cache = new Map<string, Promise<unknown>>();

const getJson = <T>(path: string): Promise<T> => {
  let hit = cache.get(path);
  if (!hit) {
    hit = fetch(`${BASE}notes/${path}`).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${path}`);
      return res.json();
    });
    cache.set(path, hit);
    hit.catch(() => cache.delete(path)); // let a later visit retry
  }
  return hit as Promise<T>;
};

export const fetchVaults = () => getJson<VaultMeta[]>('vaults.json');
export const fetchIndex = (vaultId: string) =>
  getJson<VaultIndex>(`${vaultId}/index.json`);
export const fetchNote = (vaultId: string, slug: string) =>
  getJson<Note>(`${vaultId}/n/${seg(slug)}.json`);
export const fetchSearchIndex = (vaultId: string) =>
  getJson<AsPlainObject>(`${vaultId}/search.json`);

export const assetUrl = (vaultId: string, rel: string) =>
  `${BASE}notes/${vaultId}/assets/${seg(rel)}`;

/** router path (no basename) of a note */
export const notePath = (
  lang: string,
  vaultId: string,
  slug: string,
  hash = '',
) => `/${lang}/notes/${vaultId}/${seg(slug)}${hash}`;

type State<T> = { key: string | null; data?: T; error?: unknown };

/** key === null skips loading; data/error always belong to the current key */
const useLoad = <T>(key: string | null, load: () => Promise<T>) => {
  const [state, setState] = useState<State<T>>({ key: null });
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (key === null) return;
    let live = true;
    loadRef.current().then(
      (data) => live && setState({ key, data }),
      (error) => live && setState({ key, error }),
    );
    return () => {
      live = false;
    };
  }, [key]);

  const current = state.key === key;
  return {
    data: current ? state.data : undefined,
    error: current ? state.error : undefined,
    loading: key !== null && !current,
  };
};

export const useVaults = () => useLoad('vaults', fetchVaults);
export const useVaultIndex = (vaultId: string) =>
  useLoad(`index:${vaultId}`, () => fetchIndex(vaultId));
export const useNote = (vaultId: string, slug: string) =>
  useLoad(`note:${vaultId}:${slug}`, () => fetchNote(vaultId, slug));

/** the search index is only downloaded once the search dialog is first opened */
export const useSearchEngine = (vaultId: string, enabled: boolean) =>
  useLoad(enabled ? `search:${vaultId}` : null, async () =>
    MiniSearch.loadJS(await fetchSearchIndex(vaultId), searchOptions),
  );

/** real URL (with the router basename) of a route path, for href attributes */
export const appHref = (routePath: string) => BASE.slice(0, -1) + routePath;
