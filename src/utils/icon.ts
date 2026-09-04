/** icon 값이 이미지 경로(svg/png 등)인지, Material Symbols 이름인지 판별 */
export const isImageIcon = (icon: string) =>
  /^(https?:\/\/|\/|\.\/|data:image)/.test(icon) ||
  /\.(svg|png|jpe?g|webp)$/i.test(icon);
