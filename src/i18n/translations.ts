import en from './en.json';
import ko from './ko.json';

export const SUPPORTED_LANGS = ['ko', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export type Translation = typeof en;

export const translations: Record<Lang, Translation> = { en, ko };
