import { Link } from 'react-router-dom';

type Props = { to: string; tag: string; count?: number; active?: boolean };

const TagChip = ({ to, tag, count, active }: Props) => (
  <Link
    to={to}
    className={`font-code-sm text-code-sm px-sm py-xs rounded-full transition-colors ${active ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'}`}
  >
    #{tag}
    {count !== undefined && <span className="opacity-60"> {count}</span>}
  </Link>
);

export default TagChip;
