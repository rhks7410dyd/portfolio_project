/** 문서형 로고 아이콘 (배경/라벨 리본/텍스트 3가지 색상만 지정) */
export type FileIcon = {
  type: 'file';
  /** 리본에 들어갈 텍스트, 예: 'JAVA', 'TS' */
  text: string;
  /** 문서 배경 색상 */
  background: string;
  /** 가운데 리본 배경 색상 */
  labelBackground: string;
  /** 리본 텍스트 색상 */
  labelColor: string;
};

/** Material Symbols 아이콘 이름 또는 문서형 로고(FileIcon) */
export type IconValue = string | FileIcon;

export const isFileIcon = (icon: IconValue): icon is FileIcon =>
  typeof icon === 'object' && icon.type === 'file';
