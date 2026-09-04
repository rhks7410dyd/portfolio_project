/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';

  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/** 프로젝트 상세 설명을 raw text로 로드 (rsbuild.config.ts의 asset/source 룰) */
declare module '*.md' {
  const content: string;
  export default content;
}
