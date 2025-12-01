import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function TermsOfServicePage() {
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
                <FileText className="w-6 h-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Allgemeine Geschäftsbedingungen (AGB)</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">

            {/* Introduction */}
            <section>
              <p className="text-gray-700 leading-relaxed">
                Willkommen bei HEKTOR. Die folgenden Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung unserer Plattform zur Vermittlung von Sicherheitsposten und zur Verwaltung von Aufträgen im Baustellenschutz.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Stand: Dezember 2024
              </p>
            </section>

            {/* Scope */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Geltungsbereich</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Diese AGB gelten für alle Nutzer der HEKTOR-Plattform, einschließlich:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Arbeitnehmer, die Profile erstellen und sich auf Stellen bewerben</li>
                <li>Arbeitgeber und Manager, die Personal suchen</li>
                <li>Subunternehmer, die Aufträge anbieten oder suchen</li>
                <li>Anbieter und Käufer von ATWS-Warnanlagen</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Durch die Nutzung unserer Plattform akzeptieren Sie diese AGB.
              </p>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Leistungsbeschreibung</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                HEKTOR bietet folgende Dienstleistungen an:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Personalvermittlung:</strong> Vermittlung zwischen Arbeitgebern und Arbeitnehmern im Bereich Baustellenschutz</li>
                <li><strong>Stellenausschreibungen:</strong> Veröffentlichung und Verwaltung von Stellenangeboten</li>
                <li><strong>Auftragsverwaltung:</strong> Plattform für Ausschreibung und Verwaltung von Aufträgen</li>
                <li><strong>ATWS-Marktplatz:</strong> Handelsplattform für ATWS-Warnanlagen</li>
                <li><strong>Community-Funktionen:</strong> Austausch und Networking für Fachkräfte</li>
              </ul>
            </section>

            {/* Registration */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registrierung und Nutzerkonto</h2>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3.1 Registrierung</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Die Registrierung ist kostenlos und erfordert wahrheitsgemäße Angaben</li>
                <li>Sie müssen mindestens 18 Jahre alt sein</li>
                <li>Pro Person ist nur ein Benutzerkonto zulässig</li>
                <li>Sie sind für die Geheimhaltung Ihrer Zugangsdaten verantwortlich</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3.2 Pflichten der Nutzer</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Wahrheitsgemäße und aktuelle Profilinformationen</li>
                <li>Keine Verwendung fremder Identitäten</li>
                <li>Keine missbräuchliche Nutzung der Plattform</li>
                <li>Einhaltung geltender Gesetze und dieser AGB</li>
                <li>Respektvoller Umgang mit anderen Nutzern</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3.3 Sperrung und Löschung</h3>
              <p className="text-gray-700 leading-relaxed">
                Wir behalten uns das Recht vor, Benutzerkonten bei Verstößen gegen diese AGB zu sperren oder zu löschen. Sie können Ihr Konto jederzeit selbst löschen.
              </p>
            </section>

            {/* Content */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Inhalte und Verantwortlichkeit</h2>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">4.1 Nutzerinhalte</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Als Nutzer sind Sie für alle von Ihnen eingestellten Inhalte verantwortlich. Verboten sind:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Rechtswidrige, beleidigende oder diskriminierende Inhalte</li>
                <li>Falsche oder irreführende Angaben</li>
                <li>Spam oder unerwünschte Werbung</li>
                <li>Verletzung von Urheberrechten oder anderen Rechten Dritter</li>
                <li>Schädliche Software oder Links</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4.2 Prüfung und Löschung</h3>
              <p className="text-gray-700 leading-relaxed">
                Wir behalten uns das Recht vor, Inhalte zu überprüfen und bei Verstößen ohne Vorankündigung zu entfernen. Eine generelle Überwachung aller Inhalte findet nicht statt.
              </p>
            </section>

            {/* Job Applications */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Stellenangebote und Bewerbungen</h2>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">5.1 Für Arbeitgeber</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Stellenangebote müssen real und rechtlich zulässig sein</li>
                <li>Alle Angaben müssen wahrheitsgemäß sein</li>
                <li>Diskriminierung ist untersagt</li>
                <li>Arbeitgeber sind für die Einhaltung arbeitsrechtlicher Vorschriften verantwortlich</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">5.2 Für Arbeitnehmer</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Bewerbungsdaten müssen wahrheitsgemäß sein</li>
                <li>Qualifikationen und Erfahrungen müssen nachweisbar sein</li>
                <li>Verfügbarkeitsangaben müssen aktuell gehalten werden</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">5.3 Vermittlung</h3>
              <p className="text-gray-700 leading-relaxed">
                HEKTOR stellt lediglich die Plattform zur Verfügung. Ein Vermittlungsvertrag oder Arbeitsvertrag kommt ausschließlich zwischen Arbeitgeber und Arbeitnehmer zustande. HEKTOR ist nicht Vertragspartner und übernimmt keine Gewähr für die Qualität oder Rechtmäßigkeit der Vermittlungen.
              </p>
            </section>

            {/* Contracts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Aufträge und Verträge</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Die Plattform ermöglicht die Ausschreibung und Vermittlung von Aufträgen:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Auftraggeber und Auftragnehmer schließen Verträge direkt miteinander ab</li>
                <li>HEKTOR ist nicht Vertragspartner und haftet nicht für die Erfüllung oder Nichterfüllung der Verträge</li>
                <li>Alle steuerlichen und rechtlichen Pflichten liegen bei den Vertragspartnern</li>
                <li>Auftragsbeschreibungen müssen vollständig und wahrheitsgemäß sein</li>
              </ul>
            </section>

            {/* ATWS Marketplace */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. ATWS-Marktplatz</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Der ATWS-Marktplatz dient dem Handel mit ATWS-Warnanlagen:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Angebote müssen den tatsächlichen Geräten entsprechen</li>
                <li>Preise und Verfügbarkeit müssen korrekt angegeben werden</li>
                <li>Käufer und Verkäufer schließen Verträge direkt ab</li>
                <li>HEKTOR haftet nicht für Mängel, Lieferung oder Zahlung</li>
                <li>Alle gesetzlichen Gewährleistungspflichten liegen beim Verkäufer</li>
              </ul>
            </section>

            {/* Fees */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Gebühren</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Die Nutzung der Plattform ist derzeit kostenlos. Wir behalten uns vor, in Zukunft Gebühren einzuführen:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Für Premium-Funktionen</li>
                <li>Für erweiterte Stellenanzeigen</li>
                <li>Für Provisionen bei erfolgreichen Vermittlungen</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Gebührenänderungen werden rechtzeitig angekündigt. Bestehende Nutzer erhalten Bestandsschutz für einen angemessenen Zeitraum.
              </p>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Haftung</h2>

              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">9.1 Haftungsbeschränkung</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, außer bei:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Verletzung von Leben, Körper oder Gesundheit</li>
                <li>Verletzung wesentlicher Vertragspflichten</li>
                <li>Zwingenden gesetzlichen Haftungsvorschriften</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">9.2 Keine Garantie</h3>
              <p className="text-gray-700 leading-relaxed">
                Wir übernehmen keine Gewähr für:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-2">
                <li>Die Richtigkeit oder Vollständigkeit von Nutzerinhalten</li>
                <li>Die erfolgreiche Vermittlung von Personal oder Aufträgen</li>
                <li>Die ununterbrochene Verfügbarkeit der Plattform</li>
                <li>Die Vertrauenswürdigkeit anderer Nutzer</li>
              </ul>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Datenschutz</h2>
              <p className="text-gray-700 leading-relaxed">
                Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
                <Link to="/privacy-policy" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                  Datenschutzerklärung
                </Link>
                , die integraler Bestandteil dieser AGB ist.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Urheberrecht und geistiges Eigentum</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Alle Inhalte auf der Plattform (Texte, Bilder, Logos, Design) sind urheberrechtlich geschützt:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Die Nutzung ist nur im Rahmen der bestimmungsgemäßen Plattformnutzung gestattet</li>
                <li>Eine Vervielfältigung oder Verbreitung bedarf unserer Zustimmung</li>
                <li>Nutzer behalten die Rechte an ihren eigenen Inhalten</li>
                <li>Nutzer räumen HEKTOR ein nicht-exklusives Nutzungsrecht ein</li>
              </ul>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Änderungen der AGB</h2>
              <p className="text-gray-700 leading-relaxed">
                Wir behalten uns das Recht vor, diese AGB zu ändern. Änderungen werden den Nutzern rechtzeitig mitgeteilt. Widersprechen Sie nicht innerhalb von 4 Wochen, gelten die geänderten AGB als akzeptiert. Im Falle des Widerspruchs endet das Nutzungsverhältnis.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Kündigung</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Das Nutzungsverhältnis kann jederzeit beendet werden:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Durch Löschen des Benutzerkontos</li>
                <li>Durch außerordentliche Kündigung bei schweren Verstößen</li>
                <li>Bei längerer Inaktivität (über 24 Monate)</li>
              </ul>
            </section>

            {/* Applicable Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Anwendbares Recht und Gerichtsstand</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Für diese AGB und alle Rechtsbeziehungen zwischen Ihnen und HEKTOR gilt ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich zulässig, der Sitz von HEKTOR.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Salvatorische Klausel</h2>
              <p className="text-gray-700 leading-relaxed">
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame Regelung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bei Fragen zu diesen AGB kontaktieren Sie uns bitte:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">HEKTOR</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-600" />
                    <a href="mailto:info@hektor.de" className="hover:text-yellow-600">info@hektor.de</a>
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
