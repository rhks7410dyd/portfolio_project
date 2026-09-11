import type { Lang } from '../i18n/translations';
import en from './skillsPage.en.json';
import ko from './skillsPage.ko.json';

export type SkillsPageContent = typeof en;

export const SKILLS_PAGE: Record<Lang, SkillsPageContent> = { en, ko };
