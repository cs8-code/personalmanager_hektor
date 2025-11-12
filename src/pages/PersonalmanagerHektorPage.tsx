import { useNavigate } from 'react-router-dom';
import { Building2, Shield, Leaf, HelpCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from './HomePage/components/Footer';
import HektorLogo from '../components/HektorLogo';

interface ServiceCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  available: boolean;
  onNavigate?: () => void;
}

function ServiceCard({ icon: Icon, title, description, features, available, onNavigate }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-yellow-400 transition-all relative">
      {!available && (
        <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Coming Soon
        </div>
      )}

      <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-6">
        <Icon className="w-8 h-8 text-gray-900" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {available ? (
        <button
          onClick={onNavigate}
          className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all inline-flex items-center justify-center"
        >
          Jetzt entdecken
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      ) : (
        <button
          disabled
          className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
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
      available: false
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
      available: false
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
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <HektorLogo className="w-16 h-16" textClassName="text-3xl" showText={true} />
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ihre umfassende Lösung für Personal- und Dienstleistungsmanagement
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 md:p-12 mb-16 shadow-xl">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Willkommen bei Personalmanager Hektor
                </h2>
                <p className="text-lg text-gray-800">
                  Wir bieten innovative Lösungen für Ihr Unternehmen. Von Bauüberwachung über Sicherheitsdienste
                  bis hin zu Facility Management – alles aus einer Hand.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Haben Sie Fragen zu unseren Services?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Kontaktieren Sie uns für weitere Informationen oder um über kommende Services
                auf dem Laufenden zu bleiben.
              </p>
              <button
                onClick={() => navigate('/siportal#contact')}
                className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all inline-flex items-center"
              >
                Kontakt aufnehmen
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
