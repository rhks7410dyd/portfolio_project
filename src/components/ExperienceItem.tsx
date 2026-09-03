import { useState } from 'react';

export type Experience = {
  role: string;
  company: string;
  bullets: string[];
  tags?: string[];
  dotClassName?: string;
};

const ExperienceItem = ({ role, company, bullets, tags, dotClassName = 'bg-primary' }: Experience) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="glass-panel p-md rounded relative cursor-pointer group"
      onClick={() => setExpanded((v) => !v)}
    >
      <div className={`absolute -left-[27px] top-6 w-[14px] h-[14px] rounded-full ${dotClassName} ring-4 ring-background`} />
      <div className="flex justify-between items-start md:items-center">
        <div>
          <h4 className="font-bold text-on-background text-lg">{role}</h4>
          <p className="text-on-surface-variant font-code-sm text-code-sm">{company}</p>
        </div>
        <span
          className={`material-symbols-outlined transition-transform duration-300 text-on-surface-variant group-hover:text-primary ${expanded ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </div>
      <div className={`accordion-content mt-sm ${expanded ? 'expanded' : ''}`}>
        <ul className="list-disc list-inside text-on-surface-variant space-y-xs ml-sm marker:text-primary">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        {tags && tags.length > 0 && (
          <div className="flex gap-sm mt-md flex-wrap">
            {tags.map((tag) => (
              <span key={tag} className="bg-primary-fixed text-on-primary-fixed px-2 py-1 rounded font-code-sm text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
