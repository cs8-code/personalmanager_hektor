import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="text-[150px] font-bold text-gray-200 leading-none">404</div>
              <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-yellow-400" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seite nicht gefunden
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Die gesuchte Seite existiert nicht oder wurde verschoben.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/siportal"
              className="flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Zurück
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Häufig besuchte Seiten:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/workers"
                className="px-4 py-2 bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 hover:text-gray-900 rounded-lg transition-colors text-sm"
              >
                Personalsuche
              </Link>
              <Link
                to="/jobs"
                className="px-4 py-2 bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 hover:text-gray-900 rounded-lg transition-colors text-sm"
              >
                Stellenangebote
              </Link>
              <Link
                to="/contracts"
                className="px-4 py-2 bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 hover:text-gray-900 rounded-lg transition-colors text-sm"
              >
                Aufträge
              </Link>
              <Link
                to="/atws-listings"
                className="px-4 py-2 bg-white border border-gray-300 hover:border-yellow-400 text-gray-700 hover:text-gray-900 rounded-lg transition-colors text-sm"
              >
                ATWS-Marktplatz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
