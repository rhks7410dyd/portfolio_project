import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Nav from '../components/Nav';
import { detectPreferredLang, LanguageProvider } from './LanguageContext';
import { SUPPORTED_LANGS } from './translations';

const LocaleLayout = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  if (!lang || !SUPPORTED_LANGS.includes(lang as (typeof SUPPORTED_LANGS)[number])) {
    const rest = location.pathname.replace(/^\/[^/]+/, '');
    return <Navigate to={`/${detectPreferredLang()}${rest}`} replace />;
  }

  return (
    <LanguageProvider lang={lang as (typeof SUPPORTED_LANGS)[number]}>
      <div className="min-h-screen flex flex-col font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
        <Nav />
        <main className="flex-grow pt-[80px] pb-xl px-gutter max-w-container-max mx-auto w-full flex flex-col gap-xl">
          <Outlet />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default LocaleLayout;
