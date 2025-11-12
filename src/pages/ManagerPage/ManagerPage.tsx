import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  experience_years: number | null;
  bio: string | null;
  company: string | null;
  role: string | null;
  user_role: string;
  availability_status: string;
  created_by: string | null;
}

export default function ManagerPage() {
  const { user, userProfile, loading } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience_years: 0,
    bio: '',
    company: '',
    role: '',
    user_role: 'Subunternehmer',
    availability_status: 'available',
  });

  const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

  useEffect(() => {
    if (user && isManager) {
      loadWorkers();
    }
  }, [user, isManager]);

  const loadWorkers = async () => {
    setLoadingWorkers(true);
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('created_by', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading workers:', error);
    } else {
      setWorkers(data || []);
    }
    setLoadingWorkers(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      experience_years: 0,
      bio: '',
      company: '',
      role: '',
      user_role: 'Subunternehmer',
      availability_status: 'available',
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!user || !formData.name || !formData.email) {
      alert('Name und E-Mail sind erforderlich');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('workers').insert([
      {
        ...formData,
        created_by: user.id,
      },
    ]);

    if (error) {
      console.error('Error adding worker:', error);
      alert('Fehler beim Hinzufügen des Mitarbeiters: ' + error.message);
    } else {
      alert('Mitarbeiter erfolgreich hinzugefügt');
      resetForm();
      loadWorkers();
    }
    setSaving(false);
  };

  const handleEdit = (worker: Worker) => {
    setFormData({
      name: worker.name,
      email: worker.email,
      phone: worker.phone || '',
      location: worker.location || '',
      experience_years: worker.experience_years || 0,
      bio: worker.bio || '',
      company: worker.company || '',
      role: worker.role || '',
      user_role: worker.user_role,
      availability_status: worker.availability_status,
    });
    setEditingId(worker.id);
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.email) {
      alert('Name und E-Mail sind erforderlich');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('workers')
      .update({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience_years: formData.experience_years,
        bio: formData.bio,
        company: formData.company,
        role: formData.role,
        user_role: formData.user_role,
        availability_status: formData.availability_status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId);

    if (error) {
      console.error('Error updating worker:', error);
      alert('Fehler beim Aktualisieren des Mitarbeiters: ' + error.message);
    } else {
      alert('Mitarbeiter erfolgreich aktualisiert');
      resetForm();
      loadWorkers();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Möchten Sie ${name} wirklich löschen?`)) {
      return;
    }

    const { error } = await supabase.from('workers').delete().eq('id', id);

    if (error) {
      console.error('Error deleting worker:', error);
      alert('Fehler beim Löschen des Mitarbeiters: ' + error.message);
    } else {
      alert('Mitarbeiter erfolgreich gelöscht');
      loadWorkers();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </>
    );
  }

  if (!user || !isManager) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Zugriff verweigert</h2>
          <p className="text-gray-600 mb-6">
            Sie benötigen Manager-Rechte, um auf diese Seite zuzugreifen.
          </p>
          <Link
            to="/siportal"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>

          {!showAddForm && !editingId && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Mitarbeiter hinzufügen
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Personal verwalten</h1>

        {(showAddForm || editingId) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Standort
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Firma
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Position/Funktion
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Erfahrung (Jahre)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Nutzertyp
                  </label>
                  <select
                    value={formData.user_role}
                    onChange={(e) => setFormData({ ...formData, user_role: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="Subunternehmer">Subunternehmer</option>
                    <option value="SIPO">SIPO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Verfügbarkeit
                  </label>
                  <select
                    value={formData.availability_status}
                    onChange={(e) =>
                      setFormData({ ...formData, availability_status: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="available">Verfügbar</option>
                    <option value="busy">Beschäftigt</option>
                    <option value="unavailable">Nicht verfügbar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Über den Mitarbeiter
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingId ? handleUpdate : handleAdd}
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Speichern...' : editingId ? 'Aktualisieren' : 'Hinzufügen'}
                </button>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Meine Mitarbeiter</h2>

          {loadingWorkers ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Noch keine Mitarbeiter hinzugefügt</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ersten Mitarbeiter hinzufügen
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nutzertyp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Standort
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                        {worker.company && (
                          <div className="text-sm text-gray-500">{worker.company}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worker.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {worker.user_role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worker.location || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            worker.availability_status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : worker.availability_status === 'busy'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {worker.availability_status === 'available' && 'Verfügbar'}
                          {worker.availability_status === 'busy' && 'Beschäftigt'}
                          {worker.availability_status === 'unavailable' && 'Nicht verfügbar'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(worker)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(worker.id, worker.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
