import { createContext, type ReactNode, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Lang, translations } from './translations';

export const detectPreferredLang = (): Lang => {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem('lang');
  if (stored === 'ko' || stored === 'en') return stored;
  const browserLangs = navigator.languages?.length ? navigator.languages : [navigator.language];
  return browserLangs.some((locale) => locale.toLowerCase().startsWith('ko')) ? 'ko' : 'en';
};

type LanguageContextValue = {
  lang: Lang;
  t: (typeof translations)[Lang];
  switchTo: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ lang, children }: { lang: Lang; children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: translations[lang],
      switchTo: (next) => {
        window.localStorage.setItem('lang', next);
        const rest = location.pathname.replace(/^\/(ko|en)/, '');
        navigate(`/${next}${rest}${location.search}`);
      },
    }),
    [lang, location.pathname, location.search, navigate],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
