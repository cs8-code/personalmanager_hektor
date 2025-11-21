import { useNavigate } from 'react-router-dom';
import { Building2, Shield, Leaf, HelpCircle, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Footer from './HomePage/components/Footer';

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  available: boolean;
  iconGradient: string;
  onNavigate?: () => void;
}

function ServiceCard({ icon: Icon, title, description, features, available, iconGradient, onNavigate }: ServiceCardProps) {
  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50 hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {!available && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
          Coming Soon
        </div>
      )}

      <div className={`flex items-center justify-center w-16 h-16 ${iconGradient} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {available ? (
        <button
          onClick={onNavigate}
          className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
        >
          Jetzt entdecken
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          disabled
          className="w-full px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
        >
          Bald verfügbar
        </button>
      )}
    </div>
  );
}

export default function PersonalmanagerHektorPage() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Building2,
      title: 'Siportal',
      description: 'Die zentrale Plattform für Bauüberwachung und Personalmanagement im Gleisbau',
      features: [
        'Personalsuche und -vermittlung',
        'Job- und Auftragsbörse',
        'Community & Austausch',
        'Karriere-Ressourcen'
      ],
      available: true,
      iconGradient: 'bg-gradient-to-br from-yellow-500 to-amber-500',
      onNavigate: () => navigate('/siportal')
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Professionelle Sicherheitsdienste für Baustellen und Projekte',
      features: [
        'Baustellensicherung',
        'Objektschutz',
        'Zugangskontrollen',
        'Sicherheitsberatung'
      ],
      available: false,
      iconGradient: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      icon: Leaf,
      title: 'Gärtner & Schneedienst',
      description: 'Grünflächenpflege und Winterdienst für Ihr Unternehmen',
      features: [
        'Gartenpflege & Landschaftsbau',
        'Winterdienst & Schneeräumung',
        'Grünflächenunterhalt',
        'Saisonale Betreuung'
      ],
      available: false,
      iconGradient: 'bg-gradient-to-br from-green-500 to-emerald-500'
    },
    {
      icon: HelpCircle,
      title: 'Weitere Services',
      description: 'Zusätzliche Dienstleistungen für Ihr Unternehmen in Planung',
      features: [
        'Innovative Lösungen',
        'Maßgeschneiderte Services',
        'Qualität & Zuverlässigkeit',
        'Persönliche Betreuung'
      ],
      available: false,
      iconGradient: 'bg-gradient-to-br from-slate-600 to-slate-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>

      <main className="flex-grow">
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 pb-2">
                Personalmanager Hektor
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ihre umfassende Lösung für Personal- und Dienstleistungsmanagement
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {services.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>

            {/* CTA Section */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center shadow-xl border border-gray-200/50">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Haben Sie Fragen zu unseren Services?
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Kontaktieren Sie uns für weitere Informationen oder um über kommende Services
                  auf dem Laufenden zu bleiben.
                </p>
                <button
                  onClick={() => navigate('/siportal#contact')}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  Kontakt aufnehmen
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
