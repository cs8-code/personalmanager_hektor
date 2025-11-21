import { Users, Briefcase, Stethoscope, ShoppingCart, FileText, MessageSquare, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';
import LoginModal from '../../../components/LoginModal';

interface ServiceCardProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  hashLink: string;
  customRoute?: string;
  requiresAuth?: boolean;
}

function ServiceCard({ icon: Icon, title, description, hashLink, customRoute, requiresAuth = false }: ServiceCardProps) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !user) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
  };

  if (user && customRoute) {
    return (
      <Link
        to={customRoute}
        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
          <Icon className="w-8 h-8 text-gray-900" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </Link>
    );
  }

  return (
    <>
      <a
        href={hashLink}
        onClick={handleClick}
        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
          <Icon className="w-8 h-8 text-gray-900" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </a>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}

export default function ServiceSection() {
  return (
    <section id="services" className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Services
          </h2>
          <p className="text-lg text-gray-600">
            Alles, was du für deine Karriere in der Gleisbausicherung brauchst
          </p>
        </div>

        {/* Main Search Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Personal */}
              <Link
                to="/workers"
                className="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors mx-auto">
                  <Users className="w-8 h-8 text-gray-900" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">Personal</h4>
                <p className="text-gray-700 text-sm text-center">Finden Sie qualifizierte Fachkräfte für Ihre Bauprojekte</p>
              </Link>

              {/* Jobs */}
              <Link
                to="/jobs"
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-400 rounded-xl mb-4 group-hover:bg-blue-500 transition-colors mx-auto">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">Jobs</h4>
                <p className="text-gray-700 text-sm text-center">Spannende Karrierechancen in der Gleisbausicherung</p>
              </Link>

              {/* Aufträge */}
              <Link
                to="/contracts"
                className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-green-400 rounded-xl mb-4 group-hover:bg-green-500 transition-colors mx-auto">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">Aufträge</h4>
                <p className="text-gray-700 text-sm text-center">Neue Projekte für Ihr Subunternehmen</p>
              </Link>
            </div>
          </div>
        </div>

        {/* SiPOS & SUPiS Featured Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <Link
            to="/sipo-news"
            className="group block bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <div className="flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-xl mb-6 group-hover:bg-yellow-500 transition-colors mx-auto">
              <MessageSquare className="w-10 h-10 text-gray-900" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">SiPOS & SUPiS</h3>
            <p className="text-lg text-gray-700 text-center mb-4">Community und Austausch für Bauleiter</p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 mb-1">Aktuelles & News</p>
                <p className="text-xs text-gray-600">Bleib informiert über Branchen-Updates</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 mb-1">Erfahrungsaustausch</p>
                <p className="text-xs text-gray-600">Tausche dich mit Kollegen aus</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 mb-1">Best Practices</p>
                <p className="text-xs text-gray-600">Lerne von anderen Profis</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Services Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard
              id="health-services"
              icon={Stethoscope}
              title="Untersuchungen"
              description="FiT & Schulungen - Bahnärztliche Untersuchungen"
              hashLink="#health-services"
            />

            <ServiceCard
              id="equipment-marketplace"
              icon={ShoppingCart}
              title="ATWS-Warnanlagen"
              description="Neu oder gebraucht kaufen, verkaufen, mieten oder vermieten"
              hashLink="#equipment-marketplace"
            />

            <Link
              to="/subcontractor-guide"
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                <GraduationCap className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Karriere</h3>
              <p className="text-gray-600 text-sm">Ratgeber für Subunternehmer und Karrieretipps</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
