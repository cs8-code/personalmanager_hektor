import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';

interface Company {
  id: string;
  company_name: string;
  company_address: string;
  contact_person: string;
  email: string;
  phone: string | null;
}

export default function ContractManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    location: '',
    start_date: '',
    end_date: '',
    num_workers: 1,
    description: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/', { state: { showLoginModal: true } });
      return;
    }
    if (user) {
      loadCompanyData();
    }
  }, [user, authLoading, navigate]);

  const loadCompanyData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        alert('Sie müssen als Selbständig registriert sein, um Aufträge zu erstellen.');
        navigate('/contracts');
        return;
      }

      setCompany(data);
    } catch (error) {
      console.error('Error loading company:', error);
      alert('Fehler beim Laden der Firmendaten');
      navigate('/contracts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company) return;

    if (formData.description.length > 200) {
      alert('Die Beschreibung darf maximal 200 Zeichen enthalten');
      return;
    }

    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      alert('Das Enddatum muss nach dem Startdatum liegen');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .insert([
          {
            user_id: user.id,
            company_id: company.id,
            contact_name: company.contact_person,
            company_name: company.company_name,
            company_address: company.company_address,
            contact_email: company.email,
            contact_phone: company.phone,
            location: formData.location,
            start_date: formData.start_date,
            end_date: formData.end_date,
            num_workers: formData.num_workers,
            description: formData.description,
            status: 'active'
          }
        ]);

      if (error) throw error;

      alert('Auftrag erfolgreich erstellt!');
      navigate('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Fehler beim Erstellen des Auftrags');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const incrementWorkers = () => {
    setFormData(prev => ({ ...prev, num_workers: prev.num_workers + 1 }));
  };

  const decrementWorkers = () => {
    if (formData.num_workers > 1) {
      setFormData(prev => ({ ...prev, num_workers: prev.num_workers - 1 }));
    }
  };

  if (authLoading || !company) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <p className="mt-4 text-gray-600">Laden...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-16 px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/contracts"
            className="inline-flex items-center text-yellow-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Auftragssuche
          </Link>
          <h1 className="text-4xl font-bold mb-4">Neuen Auftrag erstellen</h1>
          <p className="text-xl text-yellow-100">
            Teilen Sie Ihren Auftrag mit qualifizierten Fachkräften
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Ihre Kontaktinformationen</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Firma:</strong> {company.company_name}</p>
              <p><strong>Kontaktperson:</strong> {company.contact_person}</p>
              <p><strong>Adresse:</strong> {company.company_address}</p>
              <p><strong>Email:</strong> {company.email}</p>
              {company.phone && <p><strong>Telefon:</strong> {company.phone}</p>}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                Einsatzort *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="z.B. Berlin, Hamburg, München"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Startdatum *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Enddatum *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="num_workers" className="block text-sm font-semibold text-gray-700 mb-2">
                Anzahl benötigter Mitarbeiter *
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={decrementWorkers}
                  disabled={formData.num_workers <= 1}
                  className="p-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{formData.num_workers}</span>
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={incrementWorkers}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Beschreibung * (max. 200 Zeichen)
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                maxLength={200}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Beschreiben Sie kurz die Anforderungen und Aufgaben..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length} / 200 Zeichen
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white font-bold rounded-lg transition-all shadow-md"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Wird erstellt...' : 'Auftrag erstellen'}
              </button>
              <Link
                to="/contracts"
                className="flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all"
              >
                <X className="w-5 h-5 mr-2" />
                Abbrechen
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
