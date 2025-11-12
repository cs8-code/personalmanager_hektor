import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Briefcase, Stethoscope, ShoppingCart, MessageSquare, FileText, Building2, HardHat } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fullDescription: string;
}

const services: Service[] = [
  {
    id: 'personal-search',
    title: 'Personalsuche',
    description: 'Finden Sie qualifizierte Fachkräfte für Ihre Bauprojekte',
    icon: Users,
    fullDescription: 'Mit unserem Personalsuche-Service können Sie schnell und einfach qualifizierte Fachkräfte für Ihre Bauprojekte finden. Durchsuchen Sie unsere umfangreiche Datenbank von erfahrenen Bauarbeitern, Ingenieuren und Spezialisten.'
  },
  {
    id: 'jobs',
    title: 'Jobs finden',
    description: 'Finde Jobs für deine Karriere',
    icon: Briefcase,
    fullDescription: 'Entdecken Sie spannende Karrieremöglichkeiten in der Baubranche. Unser Job-Portal bietet eine Vielzahl von Stellenangeboten für alle Qualifikationsstufen und Spezialisierungen.'
  },
  {
    id: 'contracts',
    title: 'Aufträge suchen',
    description: 'Finde neue Aufträge für dein Subunternehmen',
    icon: Briefcase,
    fullDescription: 'Erweitern Sie Ihr Geschäft durch unsere Auftrags-Plattform. Verbinden Sie sich mit Hauptauftragnehmern und finden Sie lukrative Projekte für Ihr Subunternehmen.'
  },
  {
    id: 'health-services',
    title: 'Physiologische Untersuchungen',
    description: 'FiT & Schulungen - Bahnärztliche Untersuchungen',
    icon: Stethoscope,
    fullDescription: 'Bleiben Sie gesund und sicher auf der Baustelle. Wir bieten umfassende physiologische Untersuchungen, FiT-Schulungen und bahnärztliche Untersuchungen für Mitarbeiter im Gleisbau.'
  },
  {
    id: 'equipment-marketplace',
    title: 'Warnanlagen',
    description: 'Neu oder gebraucht kaufen, verkaufen, mieten oder vermieten',
    icon: ShoppingCart,
    fullDescription: 'Ihr Marktplatz für Warnanlagen und Sicherheitsausrüstung. Kaufen, verkaufen, mieten oder vermieten Sie neue und gebrauchte Warnanlagen für Ihre Bauprojekte.'
  },
  {
    id: 'sipo-community',
    title: 'SiPOS & SUPiS',
    description: 'Community und Austausch für Bauleiter',
    icon: MessageSquare,
    fullDescription: 'Treten Sie unserer Community bei und tauschen Sie sich mit anderen SiPOS und SUPiS aus. Teilen Sie Erfahrungen, stellen Sie Fragen und lernen Sie von erfahrenen Kollegen.'
  },
  {
    id: 'start-subcontractor',
    title: 'Wie gründe ich ein Subunternehmen?',
    description: 'Schritt-für-Schritt Anleitung wie man ein Subunternehmen gründet',
    icon: Building2,
    fullDescription: 'Unser umfassender Leitfaden führt Sie durch alle Schritte zur Gründung Ihres eigenen Subunternehmens. Von der rechtlichen Grundlage bis zur ersten Auftragsakquise.'
  },
  {
    id: 'start-sipo',
    title: 'Wie wird man SIPO?',
    description: 'Alles was man auf dem Weg zum SIPO wissen muss',
    icon: HardHat,
    fullDescription: 'Erfahren Sie alles über den Weg zum Sicherungsposten (SIPO). Wir informieren Sie über notwendige Qualifikationen, Schulungen und Zertifizierungen.'
  }
];

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();

  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service nicht gefunden</h2>
          <p className="text-gray-600 mb-6">Der gesuchte Service existiert nicht.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/siportal"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
              <p className="text-lg text-gray-600">{service.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Beschreibung</h2>
            <p className="text-gray-700 leading-relaxed">{service.fullDescription}</p>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Dieser Service wird in Kürze verfügbar sein. Bleiben Sie dran für weitere Updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
