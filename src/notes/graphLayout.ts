import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import type { NoteMeta } from './types';

export type GraphNode = {
  id: string;
  title: string;
  degree: number;
  x: number;
  y: number;
};
export type GraphLink = { source: string; target: string };
export type PlacedLink = { source: GraphNode; target: GraphNode };

/**
 * Undirected link graph of a vault. With `center`, only that note and its
 * direct neighbors (links in either direction) are kept.
 */
export const buildGraph = (notes: NoteMeta[], center?: string) => {
  const known = new Set(notes.map((n) => n.slug));
  const edges = new Map<string, GraphLink>();
  for (const n of notes) {
    for (const to of n.links) {
      if (to === n.slug || !known.has(to)) continue;
      const [a, b] = n.slug < to ? [n.slug, to] : [to, n.slug];
      edges.set(`${a}\0${b}`, { source: a, target: b });
    }
  }

  let keep = known;
  if (center) {
    keep = new Set([center]);
    for (const e of edges.values()) {
      if (e.source === center) keep.add(e.target);
      if (e.target === center) keep.add(e.source);
    }
  }
  const links = [...edges.values()].filter(
    (e) => keep.has(e.source) && keep.has(e.target),
  );
  const degree = new Map<string, number>();
  for (const e of links) {
    degree.set(e.source, (degree.get(e.source) ?? 0) + 1);
    degree.set(e.target, (degree.get(e.target) ?? 0) + 1);
  }
  const nodes = notes
    .filter((n) => keep.has(n.slug))
    .map((n) => ({
      id: n.slug,
      title: n.title,
      degree: degree.get(n.slug) ?? 0,
    }));
  return { nodes, links };
};

/** run the force simulation to rest and return positions + a padded viewBox */
export const layoutGraph = (graph: ReturnType<typeof buildGraph>, pad = 24) => {
  const nodes: GraphNode[] = graph.nodes.map((n) => ({ ...n, x: 0, y: 0 }));
  const links = graph.links.map((l) => ({ ...l }));
  const sim = forceSimulation(nodes)
    .force(
      'link',
      forceLink<GraphNode, GraphLink>(links)
        .id((d) => d.id)
        .distance(48),
    )
    .force('charge', forceManyBody().strength(-90))
    // gravity: without it, notes that link to nothing are repelled to infinity and the viewBox explodes
    .force('x', forceX(0).strength(0.1))
    .force('y', forceY(0).strength(0.1))
    .force('collide', forceCollide(10))
    .stop();
  sim.tick(300);

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs, 0) - pad;
  const minY = Math.min(...ys, 0) - pad;
  const maxX = Math.max(...xs, 0) + pad;
  const maxY = Math.max(...ys, 0) + pad;
  // after the simulation d3 has replaced the ids in `links` by the node objects
  const placed = links as unknown as PlacedLink[];
  return {
    nodes,
    links: placed,
    viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`,
  };
};
