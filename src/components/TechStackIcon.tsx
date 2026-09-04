import type { IconValue } from '../utils/icon';
import { isFileIcon } from '../utils/icon';
import FileTypeIcon from './FileTypeIcon';

type TechStackIconProps = {
  icon: IconValue;
  label: string;
};

const TechStackIcon = ({ icon, label }: TechStackIconProps) => {
  return (
    <div className="w-10 h-10 bg-surface-container flex items-center justify-center rounded border border-outline-variant/50 hover:border-primary hover:text-primary transition-all text-on-surface-variant cursor-help group relative">
      {isFileIcon(icon) ? (
        <FileTypeIcon {...icon} className="w-7 h-7" />
      ) : (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-high px-2 py-1 rounded text-code-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </div>
  );
};

export default TechStackIcon;
