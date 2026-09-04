import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { isFileIcon } from '../utils/icon';
import FileTypeIcon from './FileTypeIcon';
import type { Project } from './ProjectCard';

const loadDetailMd = (slug: string) =>
  import(`../data/projects/${slug}.md`).then((mod) => mod.default as string);

const ProjectDetailModal = ({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) => {
  const [html, setHtml] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setHtml(null);
    setNotFound(false);
    if (project.source !== 'internal') return;
    loadDetailMd(project.slug)
      .then((md) => setHtml(marked.parse(md) as string))
      .catch(() => setNotFound(true));
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-md">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        className="relative glass-panel rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-lg"
      >
        <div className="flex justify-between items-start mb-md gap-md">
          <div className="flex items-center gap-sm">
            {isFileIcon(project.icon) ? (
              <FileTypeIcon {...project.icon} className="w-8 h-8 shrink-0" />
            ) : (
              <span className="material-symbols-outlined text-primary text-[28px]">
                {project.icon}
              </span>
            )}
            <h3 className="font-headline-md text-headline-md text-on-background">
              {project.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex gap-sm flex-wrap mb-md">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-code-sm text-[11px] text-outline border border-outline-variant/50 rounded px-1.5 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.source === 'internal' ? (
          notFound ? (
            <p className="text-on-surface-variant text-sm">
              상세 내용이 아직 작성되지 않았습니다. `src/data/projects/
              {project.slug}.md` 파일을 추가해주세요.
            </p>
          ) : html === null ? (
            <p className="text-on-surface-variant text-sm">Loading...</p>
          ) : (
            <div
              className="prose-content text-on-background text-sm"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown is authored by the project owner, not user input
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        ) : (
          <p className="text-on-surface-variant text-sm">
            {project.description}
          </p>
        )}

        <div className="flex gap-sm mt-lg">
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                open_in_new
              </span>
              LIVE
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[16px]">
                code
              </span>
              CODE
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
