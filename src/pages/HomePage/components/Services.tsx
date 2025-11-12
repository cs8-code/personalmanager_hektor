import { Users, Briefcase, Stethoscope, ShoppingCart, FileText, MessageSquare, UserPlus } from 'lucide-react';
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
  const { userProfile } = useAuth();
  const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

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

        {/* Service Cards */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
              <Link
              to="/workers"
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                <Users className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personalsuche</h3>
              <p className="text-gray-600 text-sm">Finden Sie qualifizierte Fachkräfte für Ihre Bauprojekte</p>
            </Link>
            <Link
              to="/jobs"
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform                           hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                <Briefcase className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Jobsuche</h3>
              <p className="text-gray-600 text-sm">Finde Jobs für deine Karriere</p>
            </Link>
            <Link
              to="/contracts"
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                <FileText className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aufträge suchen</h3>
              <p className="text-gray-600 text-sm">Finde neue Aufträge für dein Subunternehmen</p>
            </Link>
            <Link
              to="/sipo-news"
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border-2 border-gray-100 hover:border-yellow-400 transition-all transform hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-xl mb-4 group-hover:bg-yellow-500 transition-colors">
                <MessageSquare className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">SiPOS & SUPiS</h3>
              <p className="text-gray-600 text-sm">Community und Austausch für Bauleiter</p>
            </Link>
             <ServiceCard
              id="health-services"
              icon={Stethoscope}
              title="Physiologische Untersuchungen"
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
          </div>
        </div>
      </div>
    </section>
  );
}
