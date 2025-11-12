import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import { useAuth } from '../contexts/AuthContext';
import HektorLogo from './HektorLogo';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPendingRequestsCount();

      const subscription = supabase
        .channel('contact_requests_changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'contact_requests',
            filter: `worker_id=eq.${user.id}`
          },
          () => {
            fetchPendingRequestsCount();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchPendingRequestsCount = async () => {
    if (!user) return;

    const { count, error } = await supabase
      .from('contact_requests')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', user.id)
      .eq('status', 'pending');

    if (!error && count !== null) {
      setPendingRequestsCount(count);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <HektorLogo className="w-8 h-8" textClassName="text-base" showText={false} />
            <span className="ml-2 text-xl font-bold text-gray-900">HEKTOR</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/#services"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Services
            </a>
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Jobs
            </Link>
            <Link
              to="/workers"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Personal
            </Link>
            <a
              href="/#about"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Über uns
            </a>
            <a
              href="/#contact"
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Kontakt
            </a>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{user.user_metadata?.first_name || user.email}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      <div className="font-medium">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</div>
                      <div className="text-xs">{user.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </Link>
                    <Link
                      to="/profile#anfragen"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        Anfragen
                      </div>
                      {pendingRequestsCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {pendingRequestsCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Login
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a
              href="/#services"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <Link
              to="/jobs"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              to="/workers"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Personal
            </Link>
            <a
              href="/#about"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Über uns
            </a>
            <a
              href="/#contact"
              className="block text-gray-700 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kontakt
            </a>
            {user ? (
              <div className="border-t border-gray-200 pt-3">
                <div className="px-2 py-2 text-sm text-gray-500">
                  <div className="font-medium">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</div>
                  <div className="text-xs">{user.email}</div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center w-full text-left text-gray-700 font-medium py-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profil
                </Link>
                <Link
                  to="/profile#anfragen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full text-left text-gray-700 font-medium py-2"
                >
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Anfragen
                  </div>
                  {pendingRequestsCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left text-gray-700 font-medium py-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Abmelden
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors text-center"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </nav>
  );
}
