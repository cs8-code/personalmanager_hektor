import { ChevronRight, HardHat, Vote } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function HeroSection() {
  const { user } = useAuth();

  const scrollToSurvey = () => {
    const surveySection = document.getElementById('umfrage');
    if (surveySection) {
      surveySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="flex justify-center items-center mb-6">
            <HardHat className="w-12 h-12 text-yellow-400 mr-3" />
            <span className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Siportal
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 leading-snug">
            Das Portal für Firmen und Personal in der Gleisbausicherung
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Siportal verbindet Subunternehmer mit qualifizierten Fachkräften in der Gleisbausicherung.
            Finde dein Match für Projekte oder deine Karriere.
            Tausche dich mit anderen Kollegen aus und bleibe auf dem neuesten Stand in der Branche.
          </p>

          {/* Survey Hint */}
            <div className="mt-8">
              <button
                onClick={scrollToSurvey}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Vote className="w-6 h-6" />
                <span>An aktueller Umfrage teilnehmen</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Ihre Meinung zur neuen ELBA-Regelung ist gefragt!
              </p>
            </div>
        </div>
      </div>
    </section>
  );
}
