import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function PrivacyPolicyPage() {
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
                <Shield className="w-6 h-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Datenschutzerklärung</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">

            {/* Introduction */}
            <section>
              <p className="text-gray-700 leading-relaxed">
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener Daten auf unserer Website.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Stand: Dezember 2024
              </p>
            </section>

            {/* Responsible Party */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Verantwortlicher</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">HEKTOR</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:info@hektor.de" className="hover:text-yellow-600">info@hektor.de</a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+49 (0) 123 456789</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.1 Registrierung</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Bei der Registrierung auf unserer Plattform erheben wir folgende Daten:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Name und Vorname</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer</li>
                <li>Geburtsdatum</li>
                <li>Berufliche Qualifikationen</li>
                <li>Verfügbarkeitsstatus</li>
                <li>Standort/Wohnort</li>
                <li>Profilbild (optional)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Diese Daten werden zur Erstellung und Verwaltung Ihres Benutzerkontos sowie zur Vermittlung zwischen Arbeitgebern und Arbeitnehmern verwendet.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2.2 Automatisch erfasste Daten</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Bei jedem Besuch unserer Website werden automatisch Informationen erfasst:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Browser-Typ und Version</li>
                <li>Betriebssystem</li>
                <li>Referrer URL</li>
              </ul>
            </section>

            {/* Purpose of Data Processing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Zweck der Datenverarbeitung</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Wir verwenden Ihre personenbezogenen Daten für folgende Zwecke:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Bereitstellung und Verwaltung Ihres Benutzerkontos</li>
                <li>Vermittlung zwischen Arbeitgebern und Arbeitnehmern</li>
                <li>Kommunikation bezüglich Stellenangeboten und Aufträgen</li>
                <li>Verbesserung unserer Dienstleistungen</li>
                <li>Erfüllung rechtlicher Verpflichtungen</li>
                <li>Benachrichtigungen über Kontaktanfragen</li>
              </ul>
            </section>

            {/* Legal Basis */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Rechtsgrundlage</h2>
              <p className="text-gray-700 leading-relaxed">
                Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage von:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung</li>
                <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Vertragserfüllung</li>
                <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Rechtliche Verpflichtung</li>
                <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Berechtigtes Interesse</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Weitergabe von Daten</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Ihre Daten werden nur in folgenden Fällen an Dritte weitergegeben:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>An potenzielle Arbeitgeber im Rahmen der Arbeitsvermittlung (mit Ihrer Zustimmung)</li>
                <li>An technische Dienstleister (z.B. Hosting, Datenbankverwaltung)</li>
                <li>Wenn gesetzliche Pflichten dies erfordern</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Wir geben Ihre Daten nicht an Dritte zu Werbezwecken weiter.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Datensicherheit</h2>
              <p className="text-gray-700 leading-relaxed">
                Wir verwenden technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulation, Verlust, Zerstörung oder Zugriff unberechtigter Personen zu schützen. Unsere Sicherheitsmaßnahmen werden kontinuierlich verbessert.
              </p>
            </section>

            {/* Storage Duration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Speicherdauer</h2>
              <p className="text-gray-700 leading-relaxed">
                Ihre personenbezogenen Daten werden gespeichert, solange:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>Sie ein aktives Benutzerkonto haben</li>
                <li>Es zur Erfüllung vertraglicher oder gesetzlicher Pflichten erforderlich ist</li>
                <li>Es zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Nach Ablauf dieser Fristen werden Ihre Daten gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Ihre Rechte</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Auskunftsrecht:</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen</li>
                <li><strong>Berichtigungsrecht:</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
                <li><strong>Löschungsrecht:</strong> Sie können die Löschung Ihrer Daten verlangen</li>
                <li><strong>Einschränkung der Verarbeitung:</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
                <li><strong>Datenübertragbarkeit:</strong> Sie können eine Kopie Ihrer Daten in einem strukturierten Format erhalten</li>
                <li><strong>Widerspruchsrecht:</strong> Sie können der Verarbeitung Ihrer Daten widersprechen</li>
                <li><strong>Widerruf der Einwilligung:</strong> Sie können erteilte Einwilligungen jederzeit widerrufen</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte unter den oben angegebenen Kontaktdaten.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Unsere Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern und bestimmte Funktionen bereitzustellen. Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden. Sie können Ihren Browser so einstellen, dass er Sie über die Platzierung von Cookies informiert oder diese ablehnt.
              </p>
            </section>

            {/* Third Party Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Drittanbieter-Dienste</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Wir verwenden folgende Drittanbieter-Dienste:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Supabase:</strong> Für Backend-Services, Authentifizierung und Datenbankmanagement</li>
                <li>Diese Dienste haben eigene Datenschutzrichtlinien und unterliegen europäischen Datenschutzstandards</li>
              </ul>
            </section>

            {/* Complaint */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Beschwerderecht</h2>
              <p className="text-gray-700 leading-relaxed">
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Änderungen der Datenschutzerklärung</h2>
              <p className="text-gray-700 leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, um sie an geänderte Rechtslagen oder Änderungen unserer Dienstleistungen anzupassen. Die jeweils aktuelle Version finden Sie stets auf dieser Seite.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bei Fragen zum Datenschutz kontaktieren Sie uns bitte:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    <a href="mailto:datenschutz@hektor.de" className="hover:text-yellow-600">datenschutz@hektor.de</a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-600" />
                    <span>+49 (0) 123 456789</span>
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
