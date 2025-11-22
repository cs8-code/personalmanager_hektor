import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Mail, Phone, Edit2, Trash2, Send, Eye, Clock, Search, Plus, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { calculateAge } from '../utils/dateUtils';
import { getStatusColor, getStatusIcon } from '../utils/statusUtils';
import { QUALIFICATIONS } from '../constants/qualifications';

interface Worker {
  id: string;
  name: string;
  username: string;
  birth_date: string;
  email: string;
  phone: string;
  image_url: string;
  qualifications: string[];
  availability_status: string;
  location: string;
  experience_years: number;
  bio: string;
  created_by?: string;
}

interface ContactRequest {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function WorkerListingPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [qualificationFilters, setQualificationFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [contactRequests, setContactRequests] = useState<Map<string, ContactRequest>>(new Map());
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [showQualificationDropdown, setShowQualificationDropdown] = useState(false);

  const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

  const availabilityOptions = [
    { value: 'all', label: 'Alle' },
    { value: 'sofort verfügbar', label: 'Sofort verfügbar' },
    { value: 'demnächst verfügbar', label: 'Demnächst verfügbar' },
    { value: 'nicht verfügbar', label: 'Nicht verfügbar' },
    { value: 'Minijob beschäftigt und teilzeit arbeitssuchend', label: 'Zurzeit beschäftigt' },
  ];

  useEffect(() => {
    if (!authLoading) {
      fetchWorkers();
      if (user) {
        checkUserRole();
        fetchContactRequests();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside dropdown containers
      if (!target.closest('.dropdown-container')) {
        setShowAvailabilityDropdown(false);
        setShowQualificationDropdown(false);
      }
    };

    if (showAvailabilityDropdown || showQualificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAvailabilityDropdown, showQualificationDropdown]);

  const checkUserRole = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setUserRole(data.role);
    }
  };

  const fetchWorkers = async () => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('id, worker_id, status')
        .eq('requester_id', user.id);

      if (error) throw error;

      const requestsMap = new Map<string, ContactRequest>();
      data?.forEach(req => {
        requestsMap.set(req.worker_id, { id: req.id, status: req.status });
      });
      setContactRequests(requestsMap);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
    }
  };

  const handleSendRequest = async (workerId: string) => {
    if (!user) {
      alert('Bitte melden Sie sich an, um eine Anfrage zu senden.');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          requester_id: user.id,
          worker_id: workerId,
          status: 'pending'
        });

      if (error) throw error;

      alert('Anfrage erfolgreich gesendet!');
      fetchContactRequests();
    } catch (error: unknown) {
      console.error('Error sending request:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        alert('Sie haben bereits eine ausstehende Anfrage an diese Person gesendet.');
      } else {
        alert('Fehler beim Senden der Anfrage. Bitte versuchen Sie es erneut.');
      }
    }
  };

  const canEdit = (worker: Worker) => {
    if (!user || !userRole) return false;
    if (userRole === 'administrator') return true;
    if (userRole === 'manager' && worker.created_by === user.id) return true;
    return false;
  };

  const canDelete = (worker: Worker) => {
    return canEdit(worker);
  };

  const handleDelete = async (workerId: string) => {
    if (!confirm('Are you sure you want to delete this worker?')) return;

    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', workerId);

    if (error) {
      console.error('Error deleting worker:', error);
      alert('Failed to delete worker');
    } else {
      fetchWorkers();
    }
  };

  const toggleQualification = (qual: string) => {
    setQualificationFilters(prev =>
      prev.includes(qual)
        ? prev.filter(q => q !== qual)
        : [...prev, qual]
    );
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesAvailability = availabilityFilter === 'all' || worker.availability_status === availabilityFilter;

    const matchesQualifications =
      qualificationFilters.length === 0 ||
      qualificationFilters.some(qual => worker.qualifications.includes(qual));

    const matchesSearch =
      searchTerm === '' ||
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.qualifications.some(q => q.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation =
      locationFilter === '' ||
      worker.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesAvailability && matchesQualifications && matchesSearch && matchesLocation;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/siportal"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Personalsuche</h1>
            </div>
            {isManager && (
              <Link
                to="/manager"
                className="flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Personal erstellen
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Location Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Name, Qualifikation oder Beschreibung suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ort"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtern nach</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Verfügbarkeit Dropdown */}
            <div className="relative dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verfügbarkeit
              </label>
              <button
                onClick={() => {
                  setShowAvailabilityDropdown(!showAvailabilityDropdown);
                  setShowQualificationDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors"
              >
                <span className="text-gray-900">
                  {availabilityOptions.find(opt => opt.value === availabilityFilter)?.label || 'Alle'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showAvailabilityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showAvailabilityDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {availabilityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setAvailabilityFilter(option.value);
                        setShowAvailabilityDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors ${
                        availabilityFilter === option.value ? 'bg-yellow-100 font-semibold' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Qualifikation Dropdown */}
            <div className="relative dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifikation
              </label>
              <button
                onClick={() => {
                  setShowQualificationDropdown(!showQualificationDropdown);
                  setShowAvailabilityDropdown(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors"
              >
                <span className="text-gray-900 truncate">
                  {qualificationFilters.length === 0
                    ? 'Alle Qualifikationen'
                    : `${qualificationFilters.length} ausgewählt`}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${showQualificationDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showQualificationDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {QUALIFICATIONS.map((qual) => (
                    <label
                      key={qual}
                      className="flex items-center px-4 py-3 hover:bg-yellow-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={qualificationFilters.includes(qual)}
                        onChange={() => toggleQualification(qual)}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-900">{qual}</span>
                    </label>
                  ))}
                  {qualificationFilters.length > 0 && (
                    <button
                      onClick={() => setQualificationFilters([])}
                      className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold border-t-2 border-gray-200 transition-colors"
                    >
                      Alle abwählen
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(qualificationFilters.length > 0 || availabilityFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {availabilityFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {availabilityOptions.find(opt => opt.value === availabilityFilter)?.label}
                    <button
                      onClick={() => setAvailabilityFilter('all')}
                      className="ml-2 hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {qualificationFilters.map((qual) => (
                  <span
                    key={qual}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {qual}
                    <button
                      onClick={() => toggleQualification(qual)}
                      className="ml-2 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">Keine Fachkräfte gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/workers/${worker.id}`)}
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                  {worker.image_url ? (
                    <img
                      src={worker.image_url}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">
                          {worker.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(worker.availability_status)}`}>
                      {getStatusIcon(worker.availability_status)}
                      <span className="ml-1">{worker.availability_status}</span>
                    </div>
                  </div>
                  {(canEdit(worker) || canDelete(worker)) && (
                    <div className="absolute top-3 left-3 flex gap-2">
                      {canEdit(worker) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingWorker(worker);
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-700" />
                        </button>
                      )}
                      {canDelete(worker) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(worker.id);
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{worker.name}</h3>

                  <div className="flex items-center text-gray-600 mb-3">
                    <span className="text-sm">{calculateAge(worker.birth_date)} Jahre</span>
                  </div>

                  {worker.location && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{worker.location}</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Qualifikationen:</h4>
                    <div className="flex flex-wrap gap-2">
                      {worker.qualifications.map((qual, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  {worker.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{worker.bio}</p>
                  )}

                  <div className="space-y-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workers/${worker.id}`);
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Details ansehen
                    </button>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {user && user.id !== worker.id ? (
                      (() => {
                        const request = contactRequests.get(worker.id);
                        if (request?.status === 'accepted') {
                          // Show contact details if request is accepted
                          return (
                            <>
                              <a
                                href={`mailto:${worker.email}`}
                                className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                {worker.email}
                              </a>
                              {worker.phone && (
                                <a
                                  href={`tel:${worker.phone}`}
                                  className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                                  title={worker.phone}
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                            </>
                          );
                        } else if (request?.status === 'pending') {
                          // Show pending status
                          return (
                            <button
                              disabled
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg cursor-not-allowed"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Anfrage ausstehend
                            </button>
                          );
                        } else if (request?.status === 'rejected') {
                          // Show rejected status
                          return (
                            <button
                              disabled
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg cursor-not-allowed"
                            >
                              Anfrage abgelehnt
                            </button>
                          );
                        } else {
                          // Show send request button
                          return (
                            <button
                              onClick={() => handleSendRequest(worker.id)}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Anfrage senden
                            </button>
                          );
                        }
                      })()
                    ) : user && user.id === worker.id ? (
                      // Current user viewing their own profile
                      <div className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-600 font-semibold rounded-lg">
                        Ihr Profil
                      </div>
                    ) : (
                      // Not logged in
                      <button
                        onClick={() => alert('Bitte melden Sie sich an, um Kontakt aufzunehmen.')}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Anfrage senden
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Edit Worker Modal */}
      {editingWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mitarbeiter bearbeiten</h2>
            <p className="text-gray-600 mb-4">
              Um die Daten von <strong>{editingWorker.name}</strong> zu bearbeiten, gehen Sie bitte zur Profilseite des Mitarbeiters.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingWorker(null);
                  navigate(`/workers/${editingWorker.id}`);
                }}
                className="flex-1 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-all"
              >
                Zum Profil
              </button>
              <button
                onClick={() => setEditingWorker(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
