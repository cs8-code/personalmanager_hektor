import { Building2, HardHat, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CareerGuideCombined() {
  const navigate = useNavigate();

  return (
    <section id="career-guide" className="py-20 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Deine Karriere im Gleisbau
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Alles was du wissen musst: Vom SiPO zur eigenen Firma
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-yellow-400 transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-6">
              <HardHat className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Wie wird man SiPO?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Der Weg zur Bauüberwachung: Voraussetzungen, Ausbildung und Karrieremöglichkeiten
            </p>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Ausbildung & Qualifikation</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Technische Ausbildung oder Studium im Bauwesen bildet die Grundlage
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Hochschulstudium oder Meisterbrief</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Technische Fachkenntnisse</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Rechtliche Grundlagen</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Berufserfahrung</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Praktische Erfahrung in der Baubranche ist essentiell
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>3-5 Jahre Praxiserfahrung</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Projektmanagement-Skills</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Baustellenerfahrung</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Spezialisierung & Zertifikate</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Zusätzliche Qualifikationen erhöhen die Jobchancen
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Fachfortbildungen</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Spezialisierung (z.B. Hochbau)</span>
                      </li>
                      <li className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Projektmanagement-Zertifikate</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-yellow-400 transition-all">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-6">
              <Building2 className="w-8 h-8 text-gray-900" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Wie gründe ich ein Subunternehmen?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Schritt-für-Schritt Anleitung zur erfolgreichen Unternehmensgründung
            </p>

            <button
              onClick={() => navigate('/subcontractor-guide')}
              className="w-full px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all inline-flex items-center justify-center mb-8"
            >
              Vollständige Anleitung lesen
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Voraussetzungen prüfen
                </h4>
                <p className="text-sm text-gray-600 ml-11">
                  Qualifikationen, Berufserfahrung und finanzielle Mittel klären
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Rechtsform wählen
                </h4>
                <p className="text-sm text-gray-600 ml-11">
                  Einzelunternehmen, GmbH oder UG - die richtige Rechtsform finden
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Gewerbeanmeldung
                </h4>
                <p className="text-sm text-gray-600 ml-11">
                  Beim Gewerbeamt anmelden und alle erforderlichen Genehmigungen einholen
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Versicherungen & Finanzen
                </h4>
                <p className="text-sm text-gray-600 ml-11">
                  Betriebshaftpflicht, Geschäftskonto und Buchhaltung einrichten
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border-2 border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                  Marketing & Aufträge
                </h4>
                <p className="text-sm text-gray-600 ml-11">
                  Online-Präsenz aufbauen und erste Aufträge akquirieren
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Starte deine Karriere oder gründe dein eigenes Unternehmen im Gleisbau
          </p>
          <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all inline-flex items-center">
            Mehr erfahren
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
