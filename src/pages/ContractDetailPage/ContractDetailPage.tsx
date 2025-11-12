import { Link, useParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Mail, Phone, Building2, MapPinned } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

interface Contract {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  company_address: string;
  contact_email: string;
  contact_phone: string | null;
  location: string;
  start_date: string;
  end_date: string;
  num_workers: number;
  description: string;
  status: string;
  created_at: string;
}

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadContract(id);
    }
  }, [id]);

  const loadContract = async (contractId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', contractId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setContract(data);
    } catch (error) {
      console.error('Error loading contract:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <p className="mt-4 text-gray-600">Auftrag wird geladen...</p>
          </div>
        </div>
      </>
    );
  }

  if (!contract) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Auftrag nicht gefunden</h2>
            <Link
              to="/contracts"
              className="text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Zurück zur Auftragssuche
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16 px-4 pt-24">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/contracts"
            className="inline-flex items-center text-yellow-100 hover:text-white mb-6 transition-colors"
          >
            ← Zurück zur Auftragssuche
          </Link>
          <h1 className="text-4xl font-bold mb-2">{contract.company_name}</h1>
          <div className="flex items-center text-yellow-100">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">{contract.location}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Zeitraum
                  </h3>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-5 h-5 mr-3 text-yellow-600" />
                    <span className="text-lg">
                      {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Benötigte Mitarbeiter
                  </h3>
                  <div className="flex items-center text-gray-900">
                    <Users className="w-5 h-5 mr-3 text-yellow-600" />
                    <span className="text-lg">1 + {contract.num_workers}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Einsatzort
                  </h3>
                  <div className="flex items-center text-gray-900">
                    <MapPinned className="w-5 h-5 mr-3 text-yellow-600" />
                    <span className="text-lg">{contract.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Kontaktperson
                  </h3>
                  <div className="flex items-center text-gray-900 mb-3">
                    <Building2 className="w-5 h-5 mr-3 text-yellow-600" />
                    <span className="text-lg">{contract.contact_name}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Firmenadresse
                  </h3>
                  <div className="flex items-start text-gray-900">
                    <MapPin className="w-5 h-5 mr-3 text-yellow-600 mt-0.5" />
                    <span className="text-lg">{contract.company_address}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Kontakt
                  </h3>
                  <div className="space-y-2">
                    <a
                      href={`mailto:${contract.contact_email}`}
                      className="flex items-center text-yellow-600 hover:text-yellow-700"
                    >
                      <Mail className="w-5 h-5 mr-3" />
                      <span>{contract.contact_email}</span>
                    </a>
                    {contract.contact_phone && (
                      <a
                        href={`tel:${contract.contact_phone}`}
                        className="flex items-center text-yellow-600 hover:text-yellow-700"
                      >
                        <Phone className="w-5 h-5 mr-3" />
                        <span>{contract.contact_phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Beschreibung</h3>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {contract.description}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex gap-4">
              <a
                href={`mailto:${contract.contact_email}`}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-all shadow-md"
              >
                <Mail className="w-5 h-5 mr-2" />
                Jetzt bewerben
              </a>
              {contract.contact_phone && (
                <a
                  href={`tel:${contract.contact_phone}`}
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Anrufen
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
