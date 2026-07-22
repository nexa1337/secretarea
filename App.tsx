
import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';

import Roadmap from './pages/Roadmap';
import CategoryDetail from './pages/CategoryDetail';
import SecretArea from './pages/SecretArea';
import PersonalFinance from './pages/PersonalFinance';
import Disclaimer from './pages/Disclaimer';

// Logic to handle initial redirect and scrolling
const AppBehavior = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected routes logic
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isUnlocked = localStorage.getItem('secret_area_unlocked') === 'true';
  if (!isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AppBehavior />
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        
        <main className="flex-grow">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-white"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div><div className="mt-4 text-slate-500 font-mono text-sm tracking-widest uppercase">Loading Core...</div></div></div>}>
            <Routes>
              <Route path="/" element={<SecretArea />} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/roadmap/:id" element={<ProtectedRoute><CategoryDetail /></ProtectedRoute>} />
              <Route path="/personal-space" element={<ProtectedRoute><PersonalFinance /></ProtectedRoute>} />
              <Route path="/disclaimer" element={<Disclaimer />} />
            </Routes>
          </Suspense>
          <Footer />
        </main>

        <BottomNav />
      </div>
    </Router>
  );
};

export default App;