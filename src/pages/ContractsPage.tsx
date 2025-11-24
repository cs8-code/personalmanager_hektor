import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowLeft, Plus, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

interface Contract {
  id: string;
  user_id: string;
  company_name: string;
  location: string;
  start_date: string;
  end_date: string;
  num_workers: number;
  description: string;
  status: string;
  created_at: string;
}

export default function ContractsPage() {
  const { user, loading: authLoading } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isSelbstandig, setIsSelbstandig] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      loadContracts();
      if (user) {
        checkIfSelbstandig();
      }
    }
  }, [authLoading, user]);

  const checkIfSelbstandig = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('companies')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      setIsSelbstandig(!!data);
    } catch (error) {
      console.error('Error checking company status:', error);
      setIsSelbstandig(false);
    }
  };

  const loadContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false});

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      searchTerm === '' ||
      contract.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === '' ||
      contract.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`;
    return date.toLocaleDateString('de-DE');
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Aufträge</h1>
              </div>
              {user && (
                <Link
                  to="/contracts-management"
                  className="flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Auftrag erstellen
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
                  placeholder="Firma, Projekt oder Beschreibung suchen..."
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

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredContracts.length}</span> Aufträge gefunden
            </p>
          </div>

          {/* Contracts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keine Aufträge gefunden</h3>
              <p className="text-gray-600">Versuchen Sie es mit anderen Suchkriterien</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredContracts.map((contract) => (
                <Link
                  key={contract.id}
                  to={`/contracts/${contract.id}`}
                  className="group bg-white rounded-xl shadow-sm border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2">
                        {contract.company_name}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{contract.description}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                      {contract.status === 'active' ? 'Aktiv' : contract.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{contract.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{contract.num_workers} Mitarbeiter</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Erstellt {formatDateShort(contract.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
