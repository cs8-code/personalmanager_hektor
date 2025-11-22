import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useSurvey } from '../../../hooks';
import { useToast } from '../../../hooks';
import type { SurveyVote } from '../../../types';

export default function Survey() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { results, userStatus, loading: surveyLoading, submitVote } = useSurvey(user?.id);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleVote = async (vote: SurveyVote) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      await submitVote(vote);
      showToast('Vielen Dank für Ihre Teilnahme!', 'success');
    } catch (error) {
      showToast('Fehler beim Speichern Ihrer Stimme. Bitte versuchen Sie es erneut.', 'error');
    }
  };

  return (
    <section id="umfrage" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ihre Meinung zählt
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Teilen Sie uns Ihre Meinung mit und sehen Sie, was andere denken
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Umfrage
          </h3>

          <div className="mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Was halten Sie von der neuen ELBA-Regelung?
            </p>

            <div className="space-y-4">
              {/* Vote Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleVote('thumbs_up')}
                  disabled={surveyLoading}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    userStatus.vote === 'thumbs_up'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-700'
                  }`}
                >
                  <ThumbsUp className="w-6 h-6" />
                  <span>Positiv</span>
                </button>

                <button
                  onClick={() => handleVote('thumbs_down')}
                  disabled={surveyLoading}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    userStatus.vote === 'thumbs_down'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700'
                  }`}
                >
                  <ThumbsDown className="w-6 h-6" />
                  <span>Negativ</span>
                </button>
              </div>

              {user && userStatus.hasVoted && (
                <p className="text-sm text-gray-600 text-center italic">
                  Sie können Ihre Stimme jederzeit ändern
                </p>
              )}

              {!user && (
                <p className="text-sm text-gray-600 text-center">
                  Melden Sie sich an, um an der Umfrage teilzunehmen
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Ergebnisse ({results.total} Teilnehmer)
            </h4>

            <div className="space-y-4">
              {/* Thumbs Up Result */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-700">Positiv</span>
                  </div>
                  <span className="font-bold text-green-600">
                    {results.thumbs_up_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${results.thumbs_up_percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.thumbs_up} {results.thumbs_up === 1 ? 'Stimme' : 'Stimmen'}
                </p>
              </div>

              {/* Thumbs Down Result */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-700">Negativ</span>
                  </div>
                  <span className="font-bold text-red-600">
                    {results.thumbs_down_percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${results.thumbs_down_percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {results.thumbs_down} {results.thumbs_down === 1 ? 'Stimme' : 'Stimmen'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                An der Umfrage teilnehmen
              </h3>
              <p className="text-gray-600 mb-6">
                Um an der Umfrage teilzunehmen, müssen Sie angemeldet sein.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    navigate('/siportal', { state: { showLoginModal: true } });
                  }}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Anmelden
                </button>

                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
