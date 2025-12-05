import { useState, useEffect } from 'react';
import { Building2, Phone, Mail, MapPin, Search, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks';
import { useAuth } from '../contexts/AuthContext';

interface Company {
  id: string;
  company_name: string;
  phone: string;
  email: string;
  city: string | null;
  created_by: string | null;
}

export default function GleissicherungsfirmenList() {
  const { user, userProfile } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    phone: '',
    email: '',
    city: ''
  });

  // Check if user is manager or admin
  const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company =>
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('id, company_name, phone, email, city, created_by')
        .order('company_name', { ascending: true });

      if (error) throw error;

      setCompanies(data || []);
      setFilteredCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      showError('Fehler beim Laden der Firmen');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('companies')
        .insert([{
          company_name: formData.company_name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          created_by: user.id
        }]);

      if (error) throw error;

      showSuccess('Firma erfolgreich hinzugefügt');
      setShowCreateModal(false);
      setFormData({ company_name: '', phone: '', email: '', city: '' });
      fetchCompanies();
    } catch (error) {
      console.error('Error creating company:', error);
      showError('Fehler beim Hinzufügen der Firma');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Möchten Sie diese Firma wirklich löschen?')) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      showSuccess('Firma erfolgreich gelöscht');
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      showError('Fehler beim Löschen der Firma');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Firma, Name oder Stadt suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Results Count and Add Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Firma' : 'Firmen'} gefunden
        </p>
        {isManager && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Firma hinzufügen
          </button>
        )}
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchTerm ? 'Keine Firmen gefunden' : 'Noch keine Firmen registriert'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow relative"
            >
              {/* Delete Button - Only show for managers who created this company */}
              {isManager && company.created_by === user?.id && (
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Firma löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Company Header */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="text-lg font-bold text-gray-900 break-words">
                    {company.company_name}
                  </h3>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-3">
                {company.city && (
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{company.city}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-start text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <a
                      href={`tel:${company.phone}`}
                      className="hover:text-blue-600 transition-colors break-words"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-start text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <a
                      href={`mailto:${company.email}`}
                      className="hover:text-blue-600 transition-colors break-words"
                    >
                      {company.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Firma hinzufügen</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firmenname *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Gleissicherungsfirma GmbH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stadt *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Berlin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+49 30 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@firma.de"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {submitting ? 'Wird hinzugefügt...' : 'Firma hinzufügen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}