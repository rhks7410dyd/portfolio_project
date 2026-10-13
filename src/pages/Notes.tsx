import VaultCard from '../components/VaultCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useVaults } from '../notes/api';
import { pick } from '../notes/format';

const Notes = () => {
  const { t, lang } = useLanguage();
  const { data: vaults, error, loading } = useVaults();

  return (
    <section className="flex flex-col gap-lg">
      <header className="flex flex-col gap-sm">
        <h1 className="font-headline-lg text-headline-lg text-on-background flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">
            library_books
          </span>
          {t.notes.title}
        </h1>
        <p className="text-on-surface-variant">{t.notes.subtitle}</p>
      </header>
      {loading && <p className="text-on-surface-variant">{t.notes.loading}</p>}
      {error !== undefined && <p className="text-error">{t.notes.loadError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {vaults?.map((v) => (
          <VaultCard
            key={v.id}
            to={`/${lang}/notes/${v.id}`}
            icon={v.icon}
            title={pick(v.title, lang)}
            description={pick(v.description, lang)}
            count={v.count}
            updated={v.updated}
          />
        ))}
      </div>
    </section>
  );
};

export default Notes;
