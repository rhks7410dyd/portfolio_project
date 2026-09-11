import ExperienceItem from '../components/ExperienceItem';
import { EXPERIENCE } from '../data/experience';
import { useLanguage } from '../i18n/LanguageContext';

const Experience = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="flex flex-col gap-md">
      <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">
          work_history
        </span>
        {t.experience.title}
      </h3>
      <div className="flex flex-col gap-sm border-l-2 border-surface-bright ml-[10px] pl-md py-sm">
        {EXPERIENCE[lang].map((exp) => (
          <ExperienceItem key={exp.role} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
