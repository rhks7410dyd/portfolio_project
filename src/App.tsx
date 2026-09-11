import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { detectPreferredLang } from './i18n/LanguageContext';
import LocaleLayout from './i18n/LocaleLayout';
import Activity from './pages/Activity';
import Contact from './pages/Contact';
import Experience from './pages/Experience';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Skills from './pages/Skills';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${detectPreferredLang()}`} replace />} />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<Home />} />
        <Route path="experience" element={<Experience />} />
        <Route path="projects" element={<Projects />} />
        <Route path="activity" element={<Activity />} />
        <Route path="skills" element={<Skills />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${detectPreferredLang()}`} replace />} />
    </Routes>
  );
};

export default App;
