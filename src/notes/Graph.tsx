import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { notePath } from './api';
import { buildGraph, layoutGraph } from './graphLayout';
import type { NoteMeta } from './types';

type Props = {
  notes: NoteMeta[];
  vaultId: string;
  /** current note: highlighted, and the center of a local graph */
  activeSlug?: string;
  /** only the active note and its direct neighbors */
  local?: boolean;
  className?: string;
};

// labels for every node are fine for small vaults; bigger ones show them on hover
const LABEL_ALL_MAX = 40;

// Concepts = cyan, Language = magenta, Practice = yellow (same as the Quartz vault graph).
// A node takes the mix of its own and its neighbours' categories, nudged per node by id.
const CATS: Record<string, [number, number, number]> = {
  Concepts: [34, 211, 238],
  Language: [232, 121, 249],
  Practice: [250, 204, 21],
};
const catOf = (id: string) => CATS[id.split('/')[0]];

const nodeColor = (id: string, neighbours: string[]) => {
  const cats = [id, ...neighbours].map(catOf).filter(Boolean);
  if (cats.length === 0) return undefined;
  const [r, g, b] = [0, 1, 2].map(
    (i) => cats.reduce((sum, c) => sum + c[i], 0) / cats.length,
  );
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const shade = ((h % 41) - 20) / 100; // -0.2 .. +0.2, lighter/darker
  const mix = (v: number) =>
    Math.round(shade > 0 ? v + (255 - v) * shade : v * (1 + shade));
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
};

const Graph = ({
  notes,
  vaultId,
  activeSlug,
  local,
  className = '',
}: Props) => {
  const { lang } = useLanguage();
  const [hover, setHover] = useState<string | null>(null);
  const g = useMemo(
    () => layoutGraph(buildGraph(notes, local ? activeSlug : undefined)),
    [notes, activeSlug, local],
  );

  const near = new Set<string>();
  if (hover) {
    near.add(hover);
    for (const l of g.links) {
      if (l.source.id === hover) near.add(l.target.id);
      if (l.target.id === hover) near.add(l.source.id);
    }
  }
  const adj = new Map<string, string[]>();
  for (const l of g.links) {
    adj.set(l.source.id, [...(adj.get(l.source.id) ?? []), l.target.id]);
    adj.set(l.target.id, [...(adj.get(l.target.id) ?? []), l.source.id]);
  }
  const labelAll = g.nodes.length <= LABEL_ALL_MAX;

  return (
    <svg
      viewBox={g.viewBox}
      className={className}
      role="img"
      aria-label="graph"
    >
      {g.links.map((l) => {
        const { source: s, target: t } = l;
        const dim = hover && !(near.has(s.id) && near.has(t.id));
        return (
          <line
            key={`${s.id}-${t.id}`}
            x1={s.x}
            y1={s.y}
            x2={t.x}
            y2={t.y}
            className={`stroke-outline-variant ${dim ? 'opacity-20' : ''}`}
          />
        );
      })}
      {g.nodes.map((n) => {
        const active = n.id === activeSlug;
        const dim = hover && !near.has(n.id);
        const showLabel = active || near.has(n.id) || (labelAll && !hover);
        return (
          <Link
            key={n.id}
            to={notePath(lang, vaultId, n.id)}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n.id)}
            onBlur={() => setHover(null)}
          >
            <title>{n.title}</title>
            <circle
              cx={n.x}
              cy={n.y}
              r={active ? 7 : 4 + Math.min(n.degree, 6) * 0.5}
              style={
                active
                  ? undefined
                  : { fill: nodeColor(n.id, adj.get(n.id) ?? []) }
              }
              className={`${active ? 'fill-primary' : 'fill-outline'} transition-opacity ${dim ? 'opacity-20' : ''}`}
            />
            {showLabel && (
              <text
                x={n.x}
                y={n.y - 10}
                textAnchor="middle"
                className={`fill-on-surface-variant text-[9px] pointer-events-none ${active ? 'fill-primary font-bold' : ''}`}
              >
                {n.title}
              </text>
            )}
          </Link>
        );
      })}
    </svg>
  );
};

export default Graph;
