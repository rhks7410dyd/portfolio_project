import type { NoteMeta } from './types';

export type TreeNode = {
  /** folder name, or the note title for a file */
  name: string;
  /** folder path ("a/b") or note slug */
  path: string;
  note?: NoteMeta;
  children: TreeNode[];
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

const sortNodes = (nodes: TreeNode[]) => {
  nodes.sort(
    (a, b) =>
      Number(!!a.note) - Number(!!b.note) || collator.compare(a.name, b.name),
  );
  for (const n of nodes) sortNodes(n.children);
};

/** notes -> folder tree: folders first, then files, natural sort */
export const buildTree = (notes: NoteMeta[]): TreeNode[] => {
  const root: TreeNode = { name: '', path: '', children: [] };
  for (const note of notes) {
    const dirs = note.slug.split('/').slice(0, -1);
    let node = root;
    dirs.forEach((name, i) => {
      const path = dirs.slice(0, i + 1).join('/');
      let child = node.children.find((c) => !c.note && c.path === path);
      if (!child) {
        child = { name, path, children: [] };
        node.children.push(child);
      }
      node = child;
    });
    node.children.push({
      name: note.title,
      path: note.slug,
      note,
      children: [],
    });
  }
  sortNodes(root.children);
  return root.children;
};

/** "a/b/c" -> ["a", "a/b"]: the folders to open so that `slug` is visible */
export const ancestorFolders = (slug: string): string[] => {
  const dirs = slug.split('/').slice(0, -1);
  return dirs.map((_, i) => dirs.slice(0, i + 1).join('/'));
};

export const countNotes = (node: TreeNode): number =>
  node.note ? 1 : node.children.reduce((sum, c) => sum + countNotes(c), 0);
