import { MessageSquare, HardHat, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function News() {
  return (
    <section id="news" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-9 h-9 text-yellow-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-4">
            SIPOS & SUPIS
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Community & Austausch für Subunternehmer und Angestellte
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* Tal der SIPOS */}
              <Link
                to="/sipo-news"
                className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors mx-auto">
                  <HardHat className="w-8 h-8 text-gray-900" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">Tal der Sipos</h4>
                <p className="text-gray-700 text-sm text-center">Für angestellte Sicherheitsposten</p>
              </Link>

              {/* Business Room */}
              <Link
                to="/business-room"
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-400 rounded-xl mb-4 group-hover:bg-blue-500 transition-colors mx-auto">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">Business Room</h4>
                <p className="text-gray-700 text-sm text-center">Für selbständige Subunternehmer</p>
              </Link>
          
            </div>
        </div>
      </div>
    </section>
  );
}
