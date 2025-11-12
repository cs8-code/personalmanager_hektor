import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Navbar from '../../components/Navbar';
import HeroSection from './components/Hero';
import Services from './components/Services';
import CareerGuideCombined from './components/CareerGuideCombined';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoginModal from '../../components/LoginModal';

export default function HomePage() {
  const {user} = useAuth();
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
           {user ? (
          <>
            <Services />
            <CareerGuideCombined />
            <Contact />
          </>
      ) : (
      <>
      <HeroSection />
       <Services />
       <CareerGuideCombined />
      <Contact />
      </>
      )}
      </main>
      <Footer />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
