import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import ThemeToggle from './ThemeToggle';

const Nav = () => {
  const { pathname } = useLocation();
  const { lang, t, switchTo } = useLanguage();

  const NAV_LINKS = [
    { label: t.nav.home, to: `/${lang}` },
    { label: t.nav.experience, to: `/${lang}/experience` },
    { label: t.nav.projects, to: `/${lang}/projects` },
    { label: t.nav.activity, to: `/${lang}/activity` },
    { label: t.nav.skills, to: `/${lang}/skills` },
    { label: t.nav.contact, to: `/${lang}/contact` },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center h-14 px-gutter max-w-container-max mx-auto">
        <Link
          to={`/${lang}`}
          className="font-headline-md text-headline-md font-bold text-primary tracking-tighter"
        >
          DEV_ARCHITECT
        </Link>
        <div className="hidden md:flex gap-lg items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                pathname === link.to
                  ? 'text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md'
                  : 'text-on-surface-variant hover:text-primary transition-colors duration-200 hover:bg-surface-container-high/50 px-2 py-1 rounded font-body-md text-body-md'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={() => switchTo(lang === 'ko' ? 'en' : 'ko')}
            className="font-code-sm text-code-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 px-2 py-1 rounded transition-all duration-300 ease-in-out"
          >
            {lang === 'ko' ? 'EN' : 'KO'}
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label={t.nav.downloadResume}
            className="text-primary hover:bg-surface-container-high/50 p-sm rounded transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
