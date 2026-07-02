import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Werewolf from './pages/Werewolf';
import CookieConsent from './components/CookieConsent';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-stone-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/werewolf" element={<Werewolf />} />
        </Routes>
        <CookieConsent />
      </div>
    </HashRouter>
  );
}
