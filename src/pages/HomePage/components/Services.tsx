import { Users, Briefcase, Stethoscope, ShoppingCart, FileText, GraduationCap, LayoutGrid } from 'lucide-react';
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

  // Use customRoute if provided, regardless of auth status
  if (customRoute) {
    return (
      <Link
        to={customRoute}
        className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-gray-200 hover:border-gray-400 transition-all transform hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 rounded-xl mb-4 group-hover:border-gray-400 group-hover:from-gray-50 group-hover:to-gray-100 transition-all mx-auto">
          <Icon className="w-8 h-8 text-gray-900" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-sm text-center">{description}</p>
      </Link>
    );
  }

  return (
    <>
      <a
        href={hashLink}
        onClick={handleClick}
        className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-gray-200 hover:border-gray-400 transition-all transform hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 rounded-xl mb-4 group-hover:border-gray-400 group-hover:from-gray-50 group-hover:to-gray-100 transition-all mx-auto">
          <Icon className="w-8 h-8 text-gray-600 group-hover:text-black transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-sm text-center">{description}</p>
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
        {/* Main Search Section */}
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <LayoutGrid className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-4">
              Unsere Services
            </p>
            <p className="text-lg text-gray-600">
              Alles, was du für deine Karriere in der Gleisbausicherung brauchst
            </p>
          </div>
        <div className="max-w-5xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Personal */}
              <Link
                 to="/workers"
                  className="group rounded-2xl p-6 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
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
                  className="group rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
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
                  className="group rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-green-400 rounded-xl mb-4 group-hover:bg-green-500 transition-colors mx-auto">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">Aufträge</h4>
                <p className="text-gray-700 text-sm text-center">Neue Projekte für Ihr Subunternehmen</p>
              </Link>
            </div>
        </div>

        {/* Additional Services Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
             <ServiceCard
              id="equipment-marketplace"
              icon={ShoppingCart}
              title="ATWS-Warnanlagen"
              description="Neu oder gebraucht kaufen, verkaufen, mieten oder vermieten"
              hashLink="#equipment-marketplace"
              customRoute="/atws"
            />
            <ServiceCard
              id="career"
              icon={GraduationCap}
              title="Karriere"
              description="Wie wird man SIPO oder wie gründet man ein Subunternehmen?"
              hashLink="#career"
              customRoute="/karriere"
            />
            <ServiceCard
              id="health-services"
              icon={Stethoscope}
              title="Untersuchungen"
              description="Physiologische & bahnärztliche Untersuchungen - FiT & Schulungen"
              hashLink="#health-services"
              customRoute="/untersuchungen"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
