import { isImageIcon } from '../utils/icon';

export type Project = {
  /** Matarial Symbols 아이콘 이름, 또는 svg/png 로고 경로(URL) */
  icon: string;
  title: string;
  /** 3줄 제한 (3줄이 넘어가면 잘림)*/
  description: string;
  tags: string[];
  /**있으면 우측 상단에 외부 링크 아이콘 생김 */
  externalUrl?: string;
  /**있으면 우측 상단에 코드 링크 아이콘 생김 */
  codeUrl?: string;
  /** 상세 모달을 열기 위한 고유 식별자 (md 파일명과 매칭) */
  slug: string;
  /** github: GitHub API에서 가져온 공개 레포 / internal: 사내 등 비공개 프로젝트 */
  source: 'github' | 'internal';
};

type ProjectCardProps = Project & {
  onSeeDetails?: (project: Project) => void;
};

const ProjectCard = ({ onSeeDetails, ...project }: ProjectCardProps) => {
  const { icon, title, description, tags, externalUrl, codeUrl, source } =
    project;

  return (
    <div className="glass-panel rounded p-md flex flex-col justify-between h-full group">
      <div className="space-y-sm">
        <div className="flex justify-between items-start">
          {isImageIcon(icon) ? (
            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center">
              <img src={icon} alt="" className="w-6 h-6 object-contain" />
            </div>
          ) : (
            <span className="material-symbols-outlined text-primary text-[32px]">
              {icon}
            </span>
          )}
          <div className="flex items-center gap-xs">
            <span className="font-code-sm text-[10px] uppercase tracking-widest text-outline border border-outline-variant/50 rounded px-1.5 py-0.5">
              {source === 'github' ? 'GitHub' : 'Internal'}
            </span>
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
          onClick={() => onSeeDetails?.(project)}
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
