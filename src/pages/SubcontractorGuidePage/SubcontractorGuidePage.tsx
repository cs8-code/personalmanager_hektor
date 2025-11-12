import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, AlertCircle, FileText, Shield, Briefcase, GraduationCap, Users, Euro, Calculator, Phone } from 'lucide-react';

interface ChecklistItem {
  text: string;
}

interface Section {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

const checklist: ChecklistItem[] = [
  { text: 'Fachliche Qualifikation geprüft' },
  { text: 'Rechtsform gewählt (z. B. UG, GmbH)' },
  { text: 'Gewerbe angemeldet' },
  { text: 'Finanzamt-Fragebogen ausgefüllt' },
  { text: 'BG Bau & Versicherungen abgeschlossen' },
  { text: 'DB-Sicherheitsnachweise vorhanden' },
  { text: 'Freistellungsbescheinigung beantragt' },
  { text: 'Verträge vorbereitet' },
  { text: 'Geschäftskonto eröffnet' },
  { text: 'Erste Auftraggeber akquiriert' }
];

export default function SubcontractorGuidePage() {
  const sections: Section[] = [
    {
      title: '1. Voraussetzungen und Qualifikationen prüfen',
      icon: GraduationCap,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Die Bauüberwachung im Gleisbau ist ein regulierter Fachbereich. Folgende Voraussetzungen sollten vorliegen oder nachweisbar sein:
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
            <h4 className="font-semibold text-gray-900 mb-2">Fachliche Qualifikation:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Ingenieur / Techniker / Meister im Bereich Bauwesen, Tiefbau oder Eisenbahninfrastruktur</li>
              <li>Erfahrung in Oberbau, Fahrleitung, Leit- und Sicherungstechnik oder Konstruktiver Ingenieurbau</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <h4 className="font-semibold text-gray-900 mb-2">DB-Zulassung / EBA-Konformität:</h4>
            <p className="text-gray-700">
              Für Projekte der Deutschen Bahn AG ist eine Bauüberwachungsberechtigung (BÜB) erforderlich, oft über Nachunternehmerverträge mit zugelassenen Firmen.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
            <h4 className="font-semibold text-gray-900 mb-2">Sicherheitsqualifikationen:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Sicherheits- und Gesundheitsschutzkoordinator (SiGeKo) nach Baustellenverordnung</li>
              <li>Bahnspezifische Sicherheitsunterweisung (z. B. Sicherungsplaner, Sicherungsaufsicht)</li>
              <li>Ggf. betriebliche Unterweisung durch DB Training</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>💡 Tipp:</strong> Die Deutsche Bahn führt eine eigene Liste zugelassener Bauüberwacher. Subunternehmer können dort über Rahmenverträge oder Präqualifikationen eingebunden werden.
            </p>
          </div>
        </div>
      )
    },
    {
      title: '2. Rechtsform und Gründungsart festlegen',
      icon: Briefcase,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Übliche Varianten für diese Branche:</p>

          <div className="space-y-3">
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Einzelunternehmen</h4>
              <p className="text-gray-700 text-sm">Schnell gegründet, aber volle Haftung.</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">UG (haftungsbeschränkt) oder GmbH</h4>
              <p className="text-gray-700 text-sm">
                Empfehlenswert wegen Haftungsbegrenzung und höherer Seriosität bei öffentlichen Auftraggebern (z. B. DB Netz AG, Länder, Kommunen).
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700">
              Bei größeren Projekten fordern Auftraggeber oft den Nachweis einer Kapitalgesellschaft mit Haftpflicht- und Betriebshaftpflichtversicherung.
            </p>
          </div>
        </div>
      )
    },
    {
      title: '3. Gewerbeanmeldung',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Anmeldung beim örtlichen Gewerbeamt (meist online möglich)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-gray-700">
                <span>Tätigkeit angeben, z. B.:</span>
                <div className="bg-gray-50 p-3 rounded mt-2 text-sm italic">
                  "Erbringung von Ingenieur- und Überwachungsleistungen im Bereich Gleis- und Tiefbau, insbesondere Bauüberwachung und Sicherheitskoordination."
                </div>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Kosten: ca. 20–60 €</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Anschließend automatische Meldung an Finanzamt, IHK und Berufsgenossenschaft</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: '4. Finanzamt und steuerliche Registrierung',
      icon: Calculator,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Nach der Gewerbeanmeldung folgt der Fragebogen zur steuerlichen Erfassung über{' '}
            <a href="https://www.elster.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ELSTER.de
            </a>
            .
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <h4 className="font-semibold text-gray-900 mb-2">Wichtige Punkte:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Tätigkeitsbeschreibung: "Ingenieurleistungen/Bauüberwachung im Gleisbau"</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Umsatz- und Gewinnschätzung (realistisch planen!)</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Entscheidung über Kleinunternehmerregelung (§ 19 UStG) – meist nicht sinnvoll, da Auftraggeber (z. B. DB) vorsteuerabzugsberechtigt sind</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Erhalt der Steuernummer und ggf. USt-ID</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '5. Berufsgenossenschaft, Versicherungen und Nachweise',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 font-semibold">Pflicht und Empfehlung für den Gleisbau:</p>

          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Berufsgenossenschaft
              </h4>
              <p className="text-gray-700 text-sm">
                Zuständig ist in der Regel die BG Bau (innerhalb 1 Woche nach Gründung anmelden).
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Betriebshaftpflichtversicherung
              </h4>
              <p className="text-gray-700 text-sm">
                Pflicht für Bauüberwachung! Deckt Personen-, Sach- und Vermögensschäden ab.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Berufshaftpflichtversicherung (Ingenieure)</h4>
              <p className="text-gray-700 text-sm">
                Deckt Planungs- und Überwachungsfehler ab.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Unbedenklichkeitsbescheinigungen</h4>
              <p className="text-gray-700 text-sm">
                Vom Finanzamt, Krankenkasse und BG – Auftraggeber verlangen diese regelmäßig.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Freistellungsbescheinigung (§ 48b EStG)</h4>
              <p className="text-gray-700 text-sm">
                Pflicht bei Bauleistungen zur Vermeidung des Steuerabzugs.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '6. Fachliche Zulassung und Präqualifikation',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Für Projekte im DB-Netz oder öffentlichen Bereich:</p>

          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Registrierung im Unternehmensportal der Deutschen Bahn (DB Services Portal)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Nachweis über Qualifikation der Bauüberwacher, SiGeKo, Sicherungsaufsichten</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">EBA- oder DB-Sicherheitszertifikate müssen regelmäßig erneuert werden</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Optionale PQ-VOB Präqualifikation bei der Auftragsberatungsstelle für öffentliche Aufträge</span>
            </li>
          </ul>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              Diese Nachweise erleichtern die Aufnahme in Nachunternehmerlisten großer Auftraggeber.
            </p>
          </div>
        </div>
      )
    },
    {
      title: '7. Geschäftskonto und Buchhaltung',
      icon: Euro,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Ein separates Geschäftskonto ist Pflicht für professionelle Subunternehmer.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <h4 className="font-semibold text-gray-900 mb-2">Empfohlen:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Digitale Buchhaltung (z. B. sevDesk, lexoffice, DATEV Unternehmen online)</li>
              <li>• Erstellung einer Einnahmen-Überschuss-Rechnung (EÜR) oder Bilanz (bei GmbH)</li>
              <li>• Laufende Umsatzsteuervoranmeldung über ELSTER</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '8. Verträge und Zusammenarbeit mit Auftraggebern',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Subunternehmer im Gleisbau schließen meist Werkverträge oder Ingenieurverträge mit Bauüberwachungsbüros oder Generalunternehmern ab.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r">
            <h4 className="font-semibold text-gray-900 mb-2">Verträge sollten enthalten:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Leistungsumfang (Bauüberwachung, Dokumentation, Abnahme, SiGeKo, etc.)</li>
              <li>• Haftungsgrenzen und Versicherungsdeckung</li>
              <li>• Stunden- oder Tagessätze, Pauschalen</li>
              <li>• Vertraulichkeit und Sicherheitsbestimmungen der DB</li>
              <li>• Kündigungs- und Zahlungsbedingungen</li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-gray-700">
              <strong>⚠️ Wichtig:</strong> Viele Auftraggeber verlangen vor Einsatz eine vollständige Dokumentation aller Nachweise (Unterweisungen, Qualifikationen, Zertifikate).
            </p>
          </div>
        </div>
      )
    },
    {
      title: '9. Rechnungsstellung',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Pflichtangaben gemäß § 14 UStG:</p>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <ul className="space-y-1 text-gray-700">
              <li>✓ Vollständiger Firmenname und Anschrift</li>
              <li>✓ Steuernummer oder USt-ID</li>
              <li>✓ Rechnungsnummer und -datum</li>
              <li>✓ Leistungsbeschreibung mit Zeitraum / Projekt</li>
              <li>✓ Netto- und Umsatzsteuerbetrag</li>
              <li>✓ Zahlungsziel</li>
              <li>✓ Ggf. Hinweis auf Freistellungsbescheinigung</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '10. Laufende Pflichten',
      icon: AlertCircle,
      content: (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <ul className="space-y-2 text-gray-700">
              <li>• Fortbildungen & Sicherheitsunterweisungen: jährlich verpflichtend im Bahnbereich</li>
              <li>• Aktualisierung der DB-Sicherheitsnachweise</li>
              <li>• Umsatzsteuervoranmeldungen / Jahresabschluss</li>
              <li>• Beiträge an BG Bau und Versicherungen</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/siportal"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-white rounded-xl p-3">
                <Building2 className="w-10 h-10 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Subunternehmen für Bauüberwachung im Gleisbau gründen
                </h1>
                <p className="text-gray-800 mt-1">
                  Schritt-für-Schritt Anleitung für Deutschland 2025
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Wer als Subunternehmer im Gleisbau oder in der Bauüberwachung von Eisenbahninfrastrukturprojekten arbeiten möchte,
                übernimmt eine verantwortungsvolle Rolle: Qualität, Arbeitssicherheit und Einhaltung der Richtlinien der Deutschen Bahn
                (DB Netz AG) stehen im Mittelpunkt. Damit der Start gelingt, sind einige rechtliche, fachliche und sicherheitsrelevante
                Schritte notwendig.
              </p>

              <div className="space-y-8">
                {sections.map((section, index) => {
                  const IconComponent = section.icon;
                  return (
                    <div key={index} className="border-l-4 border-yellow-400 pl-6 py-2">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-2">
                          <IconComponent className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                      </div>
                      <div className="ml-11">
                        {section.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-200">
                <div className="flex items-center space-x-3 mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Kurz-Checkliste</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {checklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        id={`checklist-${index}`}
                        className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      />
                      <label htmlFor={`checklist-${index}`} className="text-gray-700 cursor-pointer flex-1">
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Fazit</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ein Subunternehmen im Bereich Bauüberwachung Gleisbau zu gründen erfordert neben den üblichen Gründungsformalitäten
                  auch bahnspezifische Fachkenntnisse und Sicherheitsnachweise. Mit einer klaren Qualifikation, den richtigen Versicherungen
                  und einer guten Positionierung bei Auftraggebern (z. B. Deutsche Bahn, Ingenieurbüros, Bauunternehmen) kann sich ein
                  Subunternehmen in dieser Nische erfolgreich etablieren.
                </p>
              </div>

              <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hinweis:</h3>
                    <p className="text-sm text-gray-700">
                      Diese Informationen dienen der allgemeinen Orientierung und ersetzen keine individuelle Rechts-, Steuer- oder Fachberatung.
                      Verbindliche Auskünfte erteilen Ihre IHK, BG Bau, Steuerberatung oder die DB Netz AG (Bereich Bauüberwachung / Nachunternehmermanagement).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-300">
                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Benötigen Sie Unterstützung?</h3>
                    <p className="text-sm text-gray-700">
                      Kontaktieren Sie uns für weitere Informationen oder individuelle Beratung zur Gründung Ihres Subunternehmens im Gleisbau.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
