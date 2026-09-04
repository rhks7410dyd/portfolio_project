import type { FileIcon } from '../utils/icon';

type FileTypeIconProps = FileIcon & { className?: string };

/** 접힌 모서리가 있는 문서 모양 + 가운데 라벨 리본으로 그리는 로고 아이콘 */
const FileTypeIcon = ({
  text,
  background,
  labelBackground,
  labelColor,
  className,
}: FileTypeIconProps) => (
  <svg viewBox="0 0 120 140" role="img" aria-label={text} className={className}>
    <title>{text}</title>
    <path
      d="M24 8 H80 L96 24 V132 Q96 136 92 136 H24 Q20 136 20 132 V12 Q20 8 24 8 Z"
      fill={background}
    />
    <path d="M80 8 L96 24 H84 Q80 24 80 20 Z" fill="#000" fillOpacity="0.18" />
    <rect x="8" y="70" width="104" height="32" rx="3" fill={labelBackground} />
    <text
      x="60"
      y="93"
      textAnchor="middle"
      fontSize="20"
      fontWeight="800"
      fill={labelColor}
      fontFamily="Arial, sans-serif"
      letterSpacing="0.5"
    >
      {text}
    </text>
  </svg>
);

export default FileTypeIcon;
