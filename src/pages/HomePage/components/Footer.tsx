import { Link } from 'react-router-dom';
import { HardHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <HardHat className="w-6 h-6 text-yellow-400" />
              <span className="ml-2 text-xl font-bold">HEKTOR</span>
            </div>
            <p className="text-gray-400 text-sm">
              Die führende Plattform für Sicherheitsposten und Baustellenschutz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Schnellzugriff</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/workers" className="hover:text-yellow-400 transition-colors">
                  Personalsuche
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-yellow-400 transition-colors">
                  Stellenangebote
                </Link>
              </li>
              <li>
                <Link to="/contracts" className="hover:text-yellow-400 transition-colors">
                  Aufträge
                </Link>
              </li>
              <li>
                <Link to="/atws" className="hover:text-yellow-400 transition-colors">
                  ATWS-Marktplatz
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/impressum" className="hover:text-yellow-400 transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-yellow-400 transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-yellow-400 transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="mailto:info@hektor.de" className="hover:text-yellow-400 transition-colors">
                  info@hektor.de
                </a>
              </li>
              <li>
                <a href="tel:+491234567890" className="hover:text-yellow-400 transition-colors">
                  +49 (0) 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} HEKTOR. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
