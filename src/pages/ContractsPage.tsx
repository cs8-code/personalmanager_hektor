import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, Plus } from 'lucide-react';
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
        .order('created_at', { ascending: false });

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
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/siportal"
            className="inline-flex items-center text-yellow-100 hover:text-white mb-6 transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Aufträge suchen</h1>
              <p className="text-xl text-yellow-100">
                Finden Sie passende Aufträge von Subunternehmen
              </p>
            </div>
            {user && isSelbstandig && (
              <Link
                to="/contracts-management"
                className="flex items-center px-6 py-3 bg-white text-yellow-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Auftrag erstellen
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Firma oder Beschreibung suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ort"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <p className="mt-4 text-gray-600">Aufträge werden geladen...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Keine Aufträge gefunden
            </h3>
            <p className="text-gray-500">
              Versuchen Sie, Ihre Suchfilter anzupassen
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {contract.company_name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{contract.location}</span>
                    </div>
                  </div>
                  <Link
                    to={`/contracts/${contract.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>1 + {contract.num_workers}</span>
                  </div>
                </div>

                <p className="text-gray-700 line-clamp-2">{contract.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
