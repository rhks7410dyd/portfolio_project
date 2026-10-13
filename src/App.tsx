import { lazy, Suspense } from 'react';
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

// the notes section is split out so the portfolio pages don't pay for it
const Notes = lazy(() => import('./pages/Notes'));
const NotesVault = lazy(() => import('./pages/NotesVault'));
const NotesVaultHome = lazy(() => import('./pages/NotesVaultHome'));
const NotesNote = lazy(() => import('./pages/NotesNote'));

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/${detectPreferredLang()}`} replace />}
      />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<Home />} />
        <Route path="experience" element={<Experience />} />
        <Route path="projects" element={<Projects />} />
        <Route path="activity" element={<Activity />} />
        <Route path="skills" element={<Skills />} />
        <Route
          path="notes"
          element={
            <Suspense fallback={null}>
              <Notes />
            </Suspense>
          }
        />
        <Route
          path="notes/:vaultId"
          element={
            <Suspense fallback={null}>
              <NotesVault />
            </Suspense>
          }
        >
          <Route index element={<NotesVaultHome />} />
          <Route path="*" element={<NotesNote />} />
        </Route>
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={`/${detectPreferredLang()}`} replace />}
      />
    </Routes>
  );
};

export default App;
