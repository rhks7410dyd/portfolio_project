import Button from '../components/Button';
import { useLanguage } from '../i18n/LanguageContext';

const CONTACT_LINKS = [
  { icon: 'mail', label: 'EMAIL ME', href: 'mailto:hello@devarchitect.dev' },
  { icon: 'code', label: 'GITHUB', href: 'https://github.com' },
  { icon: 'link', label: 'LINKEDIN', href: 'https://linkedin.com' },
];

const Contact = () => {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col gap-md items-start">
      <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">mail</span>
        {t.contact.title}
      </h3>
      <p className="text-on-surface-variant max-w-2xl">{t.contact.description}</p>
      <div className="flex flex-wrap gap-md">
        {CONTACT_LINKS.map((link) => (
          <Button key={link.label} variant="outline" onClick={() => window.open(link.href, '_blank')}>
            <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
            {link.label}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default Contact;
