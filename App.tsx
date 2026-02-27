import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MediaConfig from './pages/MediaConfig';
import AdCreator from './pages/AdCreator';
import Users from './pages/Users';
import Login from './pages/Login';
import { User } from './types';

// --- Types ---

export type Language = 'en' | 'zh';

interface PrivateRouteProps {
  children?: React.ReactNode;
  isAuthenticated: boolean;
}

interface MainLayoutProps {
  children?: React.ReactNode;
  user: User;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

// --- Components ---

const PrivateRoute = ({ children, isAuthenticated }: PrivateRouteProps) => {
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const MainLayout = ({ children, user, onLogout, language, setLanguage }: MainLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract active page from path (e.g., /ad-creator -> ad-creator)
  const currentPath = location.pathname.substring(1);
  // Default to ad-creator
  const activePage = currentPath || 'ad-creator';

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        language={language}
      />
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header 
          user={user} 
          title={activePage} 
          language={language} 
          onToggleLanguage={() => setLanguage(language === 'en' ? 'zh' : 'en')} 
        />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem('tiktok_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('tiktok_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tiktok_user');
  };

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/ad-creator" />} 
        />
        
        <Route 
          path="/ad-creator" 
          element={
            <PrivateRoute isAuthenticated={!!user}>
              <MainLayout user={user!} onLogout={handleLogout} language={language} setLanguage={setLanguage}>
                <AdCreator />
              </MainLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/media-config" 
          element={
            <PrivateRoute isAuthenticated={!!user}>
              <MainLayout user={user!} onLogout={handleLogout} language={language} setLanguage={setLanguage}>
                <MediaConfig />
              </MainLayout>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/users" 
          element={
            <PrivateRoute isAuthenticated={!!user}>
              <MainLayout user={user!} onLogout={handleLogout} language={language} setLanguage={setLanguage}>
                <Users />
              </MainLayout>
            </PrivateRoute>
          } 
        />

        {/* Default redirect to ad-creator */}
        <Route path="*" element={<Navigate to={user ? "/ad-creator" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;