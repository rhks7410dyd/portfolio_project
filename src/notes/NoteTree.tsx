import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { notePath } from './api';
import { ancestorFolders, type TreeNode } from './tree';

const ROW =
  'flex items-center gap-sm px-sm py-xs rounded text-body-md font-body-md w-full text-left transition-colors';
const INDENT = 16;

type Props = { nodes: TreeNode[]; vaultId: string; activeSlug: string };

const NoteTree = ({ nodes, vaultId, activeSlug }: Props) => {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(() => new Set(ancestorFolders(activeSlug)));

  // keep the active note visible when navigating from elsewhere (links, search)
  useEffect(() => {
    setOpen((prev) => new Set([...prev, ...ancestorFolders(activeSlug)]));
  }, [activeSlug]);

  const toggle = (path: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(path)) next.add(path);
      return next;
    });

  const renderLevel = (level: TreeNode[], depth: number) =>
    level.map((n) => {
      const pad = { paddingLeft: 8 + depth * INDENT };
      if (n.note) {
        const active = n.path === activeSlug;
        return (
          <Link
            key={n.path}
            to={notePath(lang, vaultId, n.path)}
            aria-current={active ? 'page' : undefined}
            style={pad}
            className={`${ROW} ${active ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50'}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              description
            </span>
            <span className="truncate">{n.name}</span>
          </Link>
        );
      }
      const isOpen = open.has(n.path);
      return (
        <div key={n.path}>
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => toggle(n.path)}
            style={pad}
            className={`${ROW} font-medium text-on-surface hover:bg-surface-container-high/50`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isOpen ? 'expand_more' : 'chevron_right'}
            </span>
            <span className="truncate">{n.name}</span>
          </button>
          {isOpen && renderLevel(n.children, depth + 1)}
        </div>
      );
    });

  return <nav className="flex flex-col gap-px">{renderLevel(nodes, 0)}</nav>;
};

export default NoteTree;
