import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useVaultIndex, useVaults } from '../notes/api';
import { pick } from '../notes/format';
import Graph from '../notes/Graph';
import Modal from '../notes/Modal';
import NoteTree from '../notes/NoteTree';
import SearchModal from '../notes/SearchModal';
import { buildTree } from '../notes/tree';
import type { VaultIndex, VaultMeta } from '../notes/types';

type VaultContext = {
  vault: VaultMeta;
  index: VaultIndex;
  openGraph: () => void;
};
export const useVault = () => useOutletContext<VaultContext>();

/** /:lang/notes/:vaultId/* shell: sidebar tree + the page outlet */
const NotesVault = () => {
  const { vaultId = '' } = useParams();
  const { pathname } = useLocation();
  const { t, lang } = useLanguage();
  const vaults = useVaults();
  const index = useVaultIndex(vaultId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [graphOpen, setGraphOpen] = useState(false);

  // Ctrl/Cmd+K opens the search from anywhere in the vault
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // active note = whatever follows /notes/:vaultId/ in the url
  const activeSlug = decodeURIComponent(
    pathname.split(`/notes/${vaultId}/`)[1] ?? '',
  );
  const tree = useMemo(
    () => (index.data ? buildTree(index.data.notes) : []),
    [index.data],
  );
  const vault = vaults.data?.find((v) => v.id === vaultId);

  // collapse the mobile menu and the graph dialog (its nodes are links) after navigating
  // biome-ignore lint/correctness/useExhaustiveDependencies: close on navigation only
  useEffect(() => {
    setMenuOpen(false);
    setGraphOpen(false);
  }, [pathname]);

  if (vaults.loading || index.loading)
    return <p className="text-on-surface-variant">{t.notes.loading}</p>;
  if (vaults.error !== undefined)
    return <p className="text-error">{t.notes.loadError}</p>;
  if (!vault || index.error !== undefined || !index.data)
    return <p className="text-error">{t.notes.vaultNotFound}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-lg items-start">
      <div className="flex flex-col gap-sm lg:sticky lg:top-[88px]">
        <button
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden glass-panel rounded px-md py-sm flex items-center gap-sm font-label-caps text-label-caps text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[18px]">
            {menuOpen ? 'close' : 'menu'}
          </span>
          {pick(vault.title, lang)}
        </button>
        <aside
          className={`${menuOpen ? 'block' : 'hidden'} lg:block glass-panel rounded p-sm lg:max-h-[calc(100vh-112px)] overflow-y-auto`}
        >
          <Link
            to={`/${lang}/notes/${vaultId}`}
            className="flex items-center gap-sm px-sm py-sm mb-xs font-bold text-primary hover:text-on-background transition-colors"
          >
            <span className="material-symbols-outlined">{vault.icon}</span>
            <span className="truncate">{pick(vault.title, lang)}</span>
          </Link>
          <div className="flex gap-xs mb-sm">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex-1 flex items-center gap-sm px-sm py-xs rounded border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
              <span className="flex-1 text-left">{t.notes.search}</span>
              <kbd className="font-code-sm text-[10px] text-outline">
                Ctrl K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setGraphOpen(true)}
              aria-label={t.notes.graph}
              title={t.notes.graph}
              className="p-xs rounded border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </button>
          </div>
          <NoteTree nodes={tree} vaultId={vaultId} activeSlug={activeSlug} />
        </aside>
      </div>
      <div className="min-w-0">
        <Outlet
          context={
            {
              vault,
              index: index.data,
              openGraph: () => setGraphOpen(true),
            } satisfies VaultContext
          }
        />
      </div>
      <SearchModal
        vaultId={vaultId}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <Modal
        open={graphOpen}
        onClose={() => setGraphOpen(false)}
        label={t.notes.graph}
        className="w-[min(1100px,94vw)] h-[80vh]"
      >
        <div className="relative w-full h-full">
          <button
            type="button"
            onClick={() => setGraphOpen(false)}
            aria-label={t.notes.close}
            className="absolute top-sm right-sm p-xs rounded text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <Graph
            notes={index.data.notes}
            vaultId={vaultId}
            activeSlug={activeSlug}
            className="w-full h-full"
          />
        </div>
      </Modal>
    </div>
  );
};

export default NotesVault;
