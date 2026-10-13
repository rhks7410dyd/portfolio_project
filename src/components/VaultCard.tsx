import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { fmt, formatDate } from '../notes/format';

type VaultCardProps = {
  to: string;
  /** Material Symbols icon name */
  icon: string;
  title: string;
  description: string;
  count: number;
  updated: string | null;
};

const VaultCard = ({
  to,
  icon,
  title,
  description,
  count,
  updated,
}: VaultCardProps) => {
  const { t, lang } = useLanguage();

  return (
    <Link
      to={to}
      className="glass-panel rounded p-md flex flex-col gap-lg h-full group"
    >
      <div className="space-y-sm">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-primary text-[32px]">
            {icon}
          </span>
          <span className="font-code-sm text-[10px] uppercase tracking-widest text-outline border border-outline-variant/50 rounded px-1.5 py-0.5">
            {fmt(t.notes.noteCount, { n: count })}
          </span>
        </div>
        <h4 className="font-bold text-lg text-on-background group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-on-surface-variant text-sm line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-auto flex justify-between items-center">
        <span className="font-code-sm text-[11px] text-outline">
          {updated
            ? fmt(t.notes.updated, { date: formatDate(updated, lang) })
            : ''}
        </span>
        <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors flex items-center gap-xs">
          {t.notes.openVault}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </span>
      </div>
    </Link>
  );
};

export default VaultCard;
