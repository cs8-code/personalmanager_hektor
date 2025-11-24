import { useState } from 'react';
import { Stethoscope, Heart, FileCheck, GraduationCap, Clock, MapPin, Phone, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../pages/HomePage/components/Footer';

interface ServiceSectionProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  color: string;
  gradient: string;
}

function ServiceSection({ id, icon: Icon, title, description, features, color, gradient }: ServiceSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-xl border-2 border-${color}-200`}>
        <div className="flex items-start gap-6 mb-6">
          <div className={`flex-shrink-0 w-16 h-16 bg-${color}-500 rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start bg-white/50 backdrop-blur-sm rounded-lg p-4">
              <CheckCircle className={`w-5 h-5 text-${color}-600 mr-3 mt-0.5 flex-shrink-0`} />
              <span className="text-gray-800">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center text-gray-700">
              <Clock className={`w-5 h-5 text-${color}-600 mr-3`} />
              <div>
                <p className="text-sm text-gray-500">Dauer</p>
                <p className="font-semibold">Nach Vereinbarung</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className={`w-5 h-5 text-${color}-600 mr-3`} />
              <div>
                <p className="text-sm text-gray-500">Standort</p>
                <p className="font-semibold">Bundesweit verfügbar</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className={`w-5 h-5 text-${color}-600 mr-3`} />
              <div>
                <p className="text-sm text-gray-500">Kontakt</p>
                <p className="font-semibold">Bald verfügbar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function UntersuchungenPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const services = [
    {
      id: 'fit',
      icon: Heart,
      title: 'FiT (Fahren im Tunnel)',
      description: 'Spezielle Untersuchung für Mitarbeiter, die im Tunnel arbeiten. Überprüfung der körperlichen und psychischen Eignung für Arbeiten in beengten Räumen und unter besonderen Bedingungen.',
      features: [
        'Körperliche Eignungsprüfung',
        'Psychologische Beurteilung',
        'Belastbarkeitstest',
        'Klaustrophobie-Screening',
        'Seh- und Hörtests',
        'Herz-Kreislauf-Untersuchung',
        'Lungenfunktionsprüfung',
        'Zertifikat nach bestandener Untersuchung',
      ],
      color: 'red',
      gradient: 'from-red-50 to-orange-50',
    },
    {
      id: 'physiological',
      icon: Stethoscope,
      title: 'Physiologische Untersuchungen',
      description: 'Umfassende medizinische Untersuchungen zur Überprüfung der körperlichen Funktionen und Leistungsfähigkeit für sicherheitsrelevante Tätigkeiten im Gleisbau.',
      features: [
        'Allgemeine körperliche Untersuchung',
        'Labor- und Blutuntersuchungen',
        'EKG und Belastungs-EKG',
        'Lungenfunktionstest',
        'Beweglichkeits- und Koordinationstests',
        'Seh- und Farbsehtests',
        'Hörtests und Audiometrie',
        'Dokumentation und Bescheinigung',
      ],
      color: 'blue',
      gradient: 'from-blue-50 to-cyan-50',
    },
    {
      id: 'railway-medical',
      icon: FileCheck,
      title: 'Bahnärztliche Untersuchungen',
      description: 'Offizielle bahnärztliche Untersuchungen nach den Vorgaben der Deutschen Bahn und gesetzlichen Bestimmungen für sicherheitsrelevante Tätigkeiten im Bahnbereich.',
      features: [
        'Tauglichkeitsuntersuchung nach EBO/DGUV',
        'Erstuntersuchung für neue Mitarbeiter',
        'Nachuntersuchungen (alle 3 Jahre)',
        'Sonderfalluntersuchungen',
        'Gesundheitszeugnisse',
        'Seh- und Hörtests nach Bahnnorm',
        'Drogen- und Alkohol-Screening',
        'Offizielle Zertifizierung',
      ],
      color: 'green',
      gradient: 'from-green-50 to-emerald-50',
    },
    {
      id: 'training',
      icon: GraduationCap,
      title: 'Schulungen',
      description: 'Umfassende Schulungs- und Weiterbildungsangebote für Mitarbeiter im Gleisbau, um Sicherheit und Qualifikation zu gewährleisten.',
      features: [
        'Erstschulung für neue Mitarbeiter',
        'Auffrischungskurse',
        'Sicherheitsunterweisungen',
        'Arbeitsschutz und Unfallverhütung',
        'Erste-Hilfe-Kurse',
        'Spezielle Geräteschulungen',
        'Zertifizierte Abschlüsse',
        'Dokumentation für Arbeitgeber',
      ],
      color: 'purple',
      gradient: 'from-purple-50 to-pink-50',
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Stethoscope className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Medizinische Untersuchungen & Schulungen
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professionelle medizinische Untersuchungen und Schulungen für Mitarbeiter im Gleisbau.
              Zertifiziert, zuverlässig und bundesweit verfügbar.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Unsere Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => scrollToSection(service.id)}
                  className={`group p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    activeSection === service.id
                      ? `border-${service.color}-500 bg-${service.color}-50`
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 bg-${service.color}-500 rounded-lg mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <span>Mehr erfahren</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Service Sections */}
          <div className="max-w-6xl mx-auto">
            {services.map((service) => (
              <ServiceSection key={service.id} {...service} />
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interesse an unseren Services?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Kontaktieren Sie uns für weitere Informationen zu unseren medizinischen Untersuchungen und Schulungen.
              Wir beraten Sie gerne!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-semibold text-gray-900">Bald verfügbar</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-500">E-Mail</p>
                  <p className="font-semibold text-gray-900">Bald verfügbar</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-semibold">
                🚧 Dieser Service befindet sich derzeit im Aufbau. Buchungen werden in Kürze möglich sein.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
