import type { Experience } from '../components/ExperienceItem';
import type { Lang } from '../i18n/translations';
import en from './experience.en.json';
import ko from './experience.ko.json';

export const EXPERIENCE: Record<Lang, Experience[]> = { en, ko };
