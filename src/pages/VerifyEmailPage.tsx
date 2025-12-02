import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, HardHat } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the current session after email confirmation
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          // Email verified successfully
          setVerificationStatus('success');

          // Redirect to profile after 3 seconds
          setTimeout(() => {
            navigate('/profile');
          }, 3000);
        } else {
          // No session found - verification may have failed or expired
          setVerificationStatus('error');
          setErrorMessage('Verifizierung fehlgeschlagen. Der Link ist möglicherweise abgelaufen.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.');
      }
    };

    handleEmailVerification();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex items-center">
            <HardHat className="w-10 h-10 text-yellow-400" />
            <span className="ml-3 text-3xl font-bold text-gray-900">HEKTOR</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus === 'loading' && (
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                E-Mail wird verifiziert...
              </h2>
              <p className="text-gray-600">
                Bitte warten Sie einen Moment.
              </p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                E-Mail erfolgreich verifiziert!
              </h2>
              <p className="text-gray-600 mb-6">
                Ihr Konto wurde aktiviert. Sie werden automatisch zu Ihrem Profil weitergeleitet...
              </p>
              <div className="flex justify-center">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Zum Profil
                </Link>
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifizierung fehlgeschlagen
              </h2>
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Erneut registrieren
                </Link>
                <Link
                  to="/siportal"
                  className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Zurück zur Startseite
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
