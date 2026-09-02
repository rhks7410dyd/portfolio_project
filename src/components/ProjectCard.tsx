export type Project = {
  /**Matarial Symbols 아이콘 이름 */
  icon: string;
  title: string;
  /** 3줄 제한 (3줄이 넘어가면 잘림)*/
  description: string;
  tags: string[];
  /**있으면 우측 상단에 외부 링크 아이콘 생김 */
  externalUrl?: string;
  /**있으면 우측 상단에 코드 링크 아이콘 생김 */
  codeUrl?: string;
};

const ProjectCard = ({
  icon,
  title,
  description,
  tags,
  externalUrl,
  codeUrl,
}: Project) => {
  return (
    <div className="glass-panel rounded p-md flex flex-col justify-between h-full group">
      <div className="space-y-sm">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-primary text-[32px]">
            {icon}
          </span>
          <div className="flex gap-xs">
            {externalUrl && (
              <a
                className="text-on-surface-variant hover:text-primary transition-colors"
                href={externalUrl}
              >
                <span className="material-symbols-outlined text-[20px]">
                  open_in_new
                </span>
              </a>
            )}
            {codeUrl && (
              <a
                className="text-on-surface-variant hover:text-primary transition-colors"
                href={codeUrl}
              >
                <span className="material-symbols-outlined text-[20px]">
                  code
                </span>
              </a>
            )}
          </div>
        </div>
        <h4 className="font-bold text-lg text-on-background group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-on-surface-variant text-sm line-clamp-3">
          {description}
        </p>
      </div>
      <div className="mt-lg">
        <div className="flex gap-sm flex-wrap mb-sm">
          {tags.map((tag) => (
            <span key={tag} className="font-code-sm text-[11px] text-outline">
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="w-full border border-surface-bright text-on-surface-variant px-sm py-sm rounded hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors font-label-caps text-label-caps flex items-center justify-center gap-xs"
        >
          SEE DETAILS{' '}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
