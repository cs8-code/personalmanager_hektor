import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/siportal"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Impressum</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">

            {/* Company Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Angaben gemäß § 5 TMG</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-xl font-bold text-gray-900 mb-4">HEKTOR GmbH</p>

                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 mt-0.5 text-gray-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Anschrift:</p>
                        <p>Musterstraße 123</p>
                        <p>12345 Musterstadt</p>
                        <p>Deutschland</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Telefon:</p>
                        <a href="tel:+491234567890" className="text-yellow-600 hover:text-yellow-700">
                          +49 (0) 123 456 7890
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-gray-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">E-Mail:</p>
                        <a href="mailto:info@hektor.de" className="text-yellow-600 hover:text-yellow-700">
                          info@hektor.de
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Registereintrag</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
                <p><strong>Registergericht:</strong> Amtsgericht Musterstadt</p>
                <p><strong>Registernummer:</strong> HRB 12345</p>
                <p><strong>Umsatzsteuer-ID:</strong> DE123456789</p>
              </div>
            </section>

            {/* Management */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertretungsberechtigte Geschäftsführung</h2>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                <p>Max Mustermann (Geschäftsführer)</p>
              </div>
            </section>

            {/* Responsible for Content */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                <p>Max Mustermann</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Streitschlichtung</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:text-yellow-700 font-semibold break-all"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              <p className="text-gray-700 leading-relaxed mt-4">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            {/* Liability for Content */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            {/* Liability for Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Links</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>
            </section>

            {/* Copyright */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </section>

            {/* Data Protection Officer */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Datenschutzbeauftragter</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
                <p><strong>Name:</strong> Maria Musterfrau</p>
                <p><strong>E-Mail:</strong> <a href="mailto:datenschutz@hektor.de" className="text-yellow-600 hover:text-yellow-700">datenschutz@hektor.de</a></p>
              </div>
              <p className="text-gray-700 text-sm mt-4">
                Weitere Informationen zum Datenschutz finden Sie in unserer{' '}
                <Link to="/privacy-policy" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </section>

            {/* Professional Association */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Berufsbezeichnung und berufsrechtliche Regelungen</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
                <p><strong>Zuständige Kammer:</strong> IHK Musterstadt</p>
                <p><strong>Verliehen in:</strong> Deutschland</p>
              </div>
            </section>

            {/* Image Credits */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bildnachweise</h2>
              <p className="text-gray-700 leading-relaxed">
                Die auf dieser Website verwendeten Bilder und Grafiken sind urheberrechtlich geschützt. Bildquellen werden, soweit erforderlich, an den jeweiligen Stellen angegeben.
              </p>
            </section>

            {/* Contact for Legal Issues */}
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt bei rechtlichen Fragen</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bei rechtlichen Fragen oder Beschwerden kontaktieren Sie uns bitte:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    <a href="mailto:legal@hektor.de" className="hover:text-yellow-600">legal@hektor.de</a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-600" />
                    <span>+49 (0) 123 456 7890</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
