import { Users, Briefcase, ChevronRight, HardHat } from 'lucide-react';

export default function CommunitySection() {

    return (
      <section id="sipo-community" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400 rounded-full mb-4">
              <span className="text-sm font-bold text-gray-900">COMMUNITY</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              SiPO News & Austausch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bleiben Sie informiert über aktuelle Themen, Trends und Best Practices in der Bauüberwachung
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* News Article 1 */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-500 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <HardHat className="w-20 h-20 text-yellow-400 opacity-60" />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
                  AKTUELL
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Vor 2 Tagen</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  Neue VOB-Regelungen 2025: Was ändert sich für SiPOs?
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Die wichtigsten Änderungen der VOB/B und ihre Auswirkungen auf die tägliche Arbeit in der Bauüberwachung.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">152 Kommentare</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </article>

            {/* News Article 2 */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-gray-600 to-gray-400 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-20 h-20 text-yellow-400 opacity-60" />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white text-gray-900 text-xs font-bold rounded-full">
                  DISKUSSION
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Vor 5 Tagen</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  Digitalisierung auf der Baustelle: Eure Erfahrungen?
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Welche digitalen Tools nutzt ihr in der Bauüberwachung? Teilt eure Best Practices und Herausforderungen.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">87 Kommentare</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </article>

            {/* News Article 3 */}
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group cursor-pointer">
              <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-600 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Briefcase className="w-20 h-20 text-yellow-400 opacity-60" />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full">
                  RATGEBER
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">Vor 1 Woche</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                  Vertragsverhandlungen als Freelance-SiPO
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  Tipps und Tricks für erfolgreiche Verhandlungen: Von Tagessätzen bis Vertragsbedingungen.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">203 Kommentare</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </article>
          </div>

          {/* Community CTA */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Werde Teil der SiPO-Community
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Tausche dich mit über 1.200 Fachkräften aus, stelle Fragen und teile dein Wissen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all inline-flex items-center justify-center">
                Zum Forum
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded-lg transition-all inline-flex items-center justify-center">
                Thema erstellen
              </button>
            </div>
          </div>
        </div>
      </section>
      );
    }