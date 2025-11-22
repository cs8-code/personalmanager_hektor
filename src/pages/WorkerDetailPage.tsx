import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, Clock, CheckCircle2, Mail, Phone, MapPin, Send, Calendar, User as UserIcon } from 'lucide-react';
import { calculateAge } from '../utils/dateUtils';
import { getStatusColor, getStatusIcon } from '../utils/statusUtils';

interface Worker {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  image_url: string;
  qualifications: string[];
  availability_status: string;
  location: string;
  birth_date: string;
  city: string;
  gender: string;
  employment_type: string;
  company_name: string;
  company_address: string;
  languages: string[];
  work_days: string;
  shifts: string;
  smoking_status: string;
  remarks: string;
  arbeitsort: string;
  created_at: string;
}

interface ContactRequest {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactRequest, setContactRequest] = useState<ContactRequest | null>(null);

  useEffect(() => {
    if (id) {
      fetchWorkerDetails();
      if (user) {
        fetchContactRequest();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const fetchWorkerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate('/workers');
        return;
      }

      setWorker(data);
    } catch (error) {
      console.error('Error fetching worker:', error);
      navigate('/workers');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactRequest = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('id, status')
        .eq('requester_id', user.id)
        .eq('worker_id', id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setContactRequest(data);
    } catch (error) {
      console.error('Error fetching contact request:', error);
    }
  };

  const handleSendRequest = async () => {
    if (!user || !id) {
      alert('Bitte melden Sie sich an, um eine Anfrage zu senden.');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          requester_id: user.id,
          worker_id: id,
          status: 'pending'
        });

      if (error) throw error;

      alert('Anfrage erfolgreich gesendet!');
      fetchContactRequest();
    } catch (error: unknown) {
      console.error('Error sending request:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        alert('Sie haben bereits eine ausstehende Anfrage an diese Person gesendet.');
      } else {
        alert('Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.');
      }
    }
  };

  const canViewContactInfo = contactRequest?.status === 'accepted';

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </>
    );
  }

  if (!worker) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/workers"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Zurück zur Übersicht
          </Link>

          <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8">
            {/* Profile Section - Horizontal Layout */}
            <div className="flex items-start gap-8 mb-8 pb-8 border-b border-gray-200">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {worker.image_url ? (
                  <img
                    src={worker.image_url}
                    alt={worker.name}
                    className="w-32 h-32 rounded-3xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-900">
                      {worker.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Name, Username, and Basic Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{worker.username}</h1>
                <p className="text-xl text-gray-600 mb-4">{worker.name}</p>

                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  {worker.birth_date && (
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="w-5 h-5 mr-2" />
                      <span>{calculateAge(worker.birth_date)} Jahre</span>
                    </div>
                  )}
                  {worker.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{worker.location}</span>
                    </div>
                  )}
                  {worker.employment_type && (
                    <div className="flex items-center text-gray-600">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                        {worker.employment_type}
                      </span>
                    </div>
                  )}
                </div>

                {/* Availability Status */}
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(worker.availability_status)}`}>
                  {getStatusIcon(worker.availability_status)}
                  <span>{worker.availability_status}</span>
                </div>
              </div>

              {/* Action Button */}
              {user && user.id !== worker.id && (
                <div className="flex-shrink-0">
                  {contactRequest?.status === 'pending' ? (
                    <button
                      disabled
                      className="flex items-center px-6 py-3 bg-gray-300 text-gray-600 font-semibold rounded-2xl cursor-not-allowed"
                    >
                      <Clock className="w-5 h-5 mr-2" />
                      Ausstehend
                    </button>
                  ) : contactRequest?.status === 'rejected' ? (
                    <button
                      disabled
                      className="flex items-center px-6 py-3 bg-red-100 text-red-600 font-semibold rounded-2xl cursor-not-allowed"
                    >
                      Abgelehnt
                    </button>
                  ) : contactRequest?.status === 'accepted' ? (
                    <div className="text-green-600 font-semibold flex items-center px-6 py-3">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Akzeptiert
                    </div>
                  ) : (
                    <button
                      onClick={handleSendRequest}
                      className="flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all shadow-md hover:shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Anfrage senden
                    </button>
                  )}
                </div>
              )}
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {worker.gender && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Geschlecht</h3>
                    <p className="text-gray-900">{worker.gender}</p>
                  </div>
                )}


                {worker.city && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Stadt</h3>
                    <p className="text-gray-900">{worker.city}</p>
                  </div>
                )}

                {worker.employment_type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Beschäftigungsart</h3>
                    <p className="text-gray-900 capitalize">{worker.employment_type}</p>
                  </div>
                )}

                {worker.arbeitsort && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Arbeitsort</h3>
                    <p className="text-gray-900">{worker.arbeitsort}</p>
                  </div>
                )}

                {worker.work_days && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Arbeitstage</h3>
                    <p className="text-gray-900">{worker.work_days}</p>
                  </div>
                )}

                {worker.shifts && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Schichten</h3>
                    <p className="text-gray-900">{worker.shifts}</p>
                  </div>
                )}

                {worker.smoking_status && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Raucherstatus</h3>
                    <p className="text-gray-900">{worker.smoking_status}</p>
                  </div>
                )}

                {worker.employment_type === 'selbständig' && worker.company_name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Firma</h3>
                    <p className="text-gray-900">{worker.company_name}</p>
                  </div>
                )}
              </div>

              {worker.qualifications && worker.qualifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Qualifikationen</h2>
                  <div className="flex flex-wrap gap-2">
                    {worker.qualifications.map((qual, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full"
                      >
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {worker.languages && worker.languages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Sprachen</h2>
                  <div className="flex flex-wrap gap-2">
                    {worker.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {worker.remarks && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Bemerkungen</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{worker.remarks}</p>
                </div>
              )}

              {canViewContactInfo && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Kontaktinformationen</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                    {worker.email && (
                      <a
                        href={`mailto:${worker.email}`}
                        className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
                      >
                        <Mail className="w-5 h-5 mr-3" />
                        <span className="font-medium">{worker.email}</span>
                      </a>
                    )}
                    {worker.phone && (
                      <a
                        href={`tel:${worker.phone}`}
                        className="flex items-center text-gray-700 hover:text-yellow-600 transition-colors"
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        <span className="font-medium">{worker.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {!canViewContactInfo && user && user.id !== worker.id && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600 text-center">
                      <UserIcon className="w-5 h-5 inline mr-2" />
                      Senden Sie eine Anfrage, um die Kontaktinformationen zu sehen
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
