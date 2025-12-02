import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from './components/Hero';
import Services from './components/Services';
import News from './components/News';
import Survey from './components/Survey';
import LoginModal from '../../components/LoginModal';

export default function HomePage() {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (location.state?.showLoginModal) {
      setShowLoginModal(true);
    }
  }, [location]);

 return (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main className='flex-grow'>
      <HeroSection />
      <Services />
      <News />
      <Survey />
    </main>
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
  </div>
);
}
