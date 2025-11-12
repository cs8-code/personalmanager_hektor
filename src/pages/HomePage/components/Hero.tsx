import { ChevronRight, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Main Title */}
        <h1 className="flex justify-center items-center mb-6">
          <HardHat className="w-12 h-12 text-yellow-400 mr-3" />
          <span className="text-6xl font-bold text-gray-900 leading-tight">
            Siportal
          </span>
        </h1>

        {/* Subtitle (smaller than h1) */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-8 leading-snug">
          Die Plattform für Personal und Firmen in der Gleisbausicherung
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Siportal verbindet Subunternehmer mit qualifizierten Fachkräften in der Gleisbausicherung.
          Finde dein Match für Projekte oder deine Karriere.
          Tausche dich mit anderen Kollegen aus und bleibe auf dem neuesten Stand in der Branche.
        </p>

        {/* Call to Action */}
        <Link
          to="/register"
          className="group px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl inline-flex items-center"
        >
          Jetzt registrieren
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}
