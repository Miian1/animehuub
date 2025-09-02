
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AllAnimePage from './pages/AllAnimePage';
import SearchPage from './pages/SearchPage';
import GenrePage from './pages/GenrePage';
import SchedulePage from './pages/SchedulePage';
import NewsPage from './pages/NewsPage';
import ReviewsPage from './pages/ReviewsPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showLayout = !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f1a] text-white">
      {showLayout && <Navbar />}
      <main className={`flex-grow ${showLayout ? 'pt-[70px]' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/browse" element={<AllAnimePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/genre/:id" element={<GenrePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {showLayout && <Footer />}
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
