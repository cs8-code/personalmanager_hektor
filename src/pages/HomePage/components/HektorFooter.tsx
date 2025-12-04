import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

export default function HektorFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Personalmanager HEKTOR
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Ihre professionelle Lösung für Personalverwaltung, Sicherheitsposten
              und Baustellenorganisation. Effizient, modern und zuverlässig.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                <span>Musterstraße 123, 12345 Musterstadt</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2 text-emerald-400" />
                <a href="tel:+491234567890" className="hover:text-emerald-400 transition-colors">
                  +49 (0) 123 456 7890
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2 text-emerald-400" />
                <a href="mailto:info@hektor.de" className="hover:text-emerald-400 transition-colors">
                  info@hektor.de
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-emerald-400">Dienstleistungen</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/siportal" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">
                  → SIPORTAL
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  → Personalmanagement
                </span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  → Sicherheitsmanagement
                </span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">
                  → Umweltmanagement
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="font-semibold mb-4 text-lg text-emerald-400">Rechtliches</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/impressum" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">
                  → Impressum
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">
                  → Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">
                  → AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Personalmanager HEKTOR. Alle Rechte vorbehalten.
          </p>
          <p className="mt-2 md:mt-0">
            Made with <span className="text-emerald-400">❤</span> for efficient workforce management
          </p>
        </div>
      </div>
    </footer>
  );
}
