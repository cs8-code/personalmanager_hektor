import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  employment_type: string;
  experience_required: number | null;
  salary_range: string | null;
  requirements: string[];
  benefits: string[];
  contact_email: string;
  contact_phone: string | null;
  status: string;
  created_at: string;
}

export default function JobsManagementPage() {
  const { user, userProfile, loading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    employment_type: 'Vollzeit',
    experience_required: 0,
    salary_range: '',
    requirements: '',
    benefits: '',
    contact_email: '',
    contact_phone: '',
    status: 'active',
  });

  const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';

  useEffect(() => {
    if (user && isManager) {
      loadJobs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isManager]);

  const loadJobs = async () => {
    try {
      setLoadingJobs(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleAdd = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from('jobs').insert([
        {
          ...formData,
          requirements: formData.requirements.split('\n').filter((r) => r.trim()),
          benefits: formData.benefits.split('\n').filter((b) => b.trim()),
          experience_required: formData.experience_required || null,
          salary_range: formData.salary_range || null,
          contact_phone: formData.contact_phone || null,
          created_by: user!.id,
        },
      ]);

      if (error) throw error;

      await loadJobs();
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Fehler beim Hinzufügen des Jobs: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('jobs')
        .update({
          ...formData,
          requirements: formData.requirements.split('\n').filter((r) => r.trim()),
          benefits: formData.benefits.split('\n').filter((b) => b.trim()),
          experience_required: formData.experience_required || null,
          salary_range: formData.salary_range || null,
          contact_phone: formData.contact_phone || null,
        })
        .eq('id', id);

      if (error) throw error;

      await loadJobs();
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Fehler beim Aktualisieren des Jobs: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Job wirklich löschen?')) return;

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);

      if (error) throw error;

      await loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Fehler beim Löschen des Jobs: ' + (error as Error).message);
    }
  };

  const startEdit = (job: Job) => {
    setFormData({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      employment_type: job.employment_type,
      experience_required: job.experience_required || 0,
      salary_range: job.salary_range || '',
      requirements: job.requirements.join('\n'),
      benefits: job.benefits.join('\n'),
      contact_email: job.contact_email,
      contact_phone: job.contact_phone || '',
      status: job.status,
    });
    setEditingId(job.id);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      company: '',
      location: '',
      employment_type: 'Vollzeit',
      experience_required: 0,
      salary_range: '',
      requirements: '',
      benefits: '',
      contact_email: '',
      contact_phone: '',
      status: 'active',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Lädt...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user || !isManager) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Zugriff verweigert</h2>
            <p className="text-gray-600 mb-6">Sie benötigen Manager-Rechte für diese Seite.</p>
            <Link
              to="/siportal"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
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
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/siportal"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Jobs verwalten</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Neuer Job
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Neuen Job hinzufügen</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job-Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="z.B. Bauleiter (m/w/d)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Firmenname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ort *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Stadt oder Region"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anstellungsart *
                </label>
                <select
                  value={formData.employment_type}
                  onChange={(e) =>
                    setFormData({ ...formData, employment_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Vollzeit">Vollzeit</option>
                  <option value="Teilzeit">Teilzeit</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Befristet">Befristet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Erforderliche Erfahrung (Jahre)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience_required}
                  onChange={(e) =>
                    setFormData({ ...formData, experience_required: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gehaltsbereich
                </label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="z.B. 50.000 - 70.000 €"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontakt E-Mail *
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="bewerbung@firma.de"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontakt Telefon
                </label>
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+49 123 456789"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Aktiv</option>
                  <option value="draft">Entwurf</option>
                  <option value="closed">Geschlossen</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jobbeschreibung *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detaillierte Beschreibung des Jobs..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anforderungen (eine pro Zeile)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Abgeschlossenes Studium&#10;3+ Jahre Erfahrung&#10;Führerschein Klasse B"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (eine pro Zeile)
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Firmenwagen&#10;Flexible Arbeitszeiten&#10;Weiterbildungsmöglichkeiten"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={saving || !formData.title || !formData.company || !formData.location || !formData.description || !formData.contact_email}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Speichern...' : 'Job hinzufügen'}
            </button>
          </div>
        )}

        {loadingJobs ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Jobs werden geladen...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Noch keine Jobs erstellt
            </h3>
            <p className="text-gray-500">
              Klicken Sie auf "Neuer Job" um Ihren ersten Job zu erstellen
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                {editingId === job.id ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job-Titel *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Firma *
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ort *
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Anstellungsart *
                        </label>
                        <select
                          value={formData.employment_type}
                          onChange={(e) =>
                            setFormData({ ...formData, employment_type: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Vollzeit">Vollzeit</option>
                          <option value="Teilzeit">Teilzeit</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Befristet">Befristet</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Erfahrung (Jahre)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.experience_required}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              experience_required: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gehalt
                        </label>
                        <input
                          type="text"
                          value={formData.salary_range}
                          onChange={(e) =>
                            setFormData({ ...formData, salary_range: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kontakt E-Mail *
                        </label>
                        <input
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) =>
                            setFormData({ ...formData, contact_email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kontakt Telefon
                        </label>
                        <input
                          type="tel"
                          value={formData.contact_phone}
                          onChange={(e) =>
                            setFormData({ ...formData, contact_phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Aktiv</option>
                          <option value="draft">Entwurf</option>
                          <option value="closed">Geschlossen</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Beschreibung *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Anforderungen (eine pro Zeile)
                      </label>
                      <textarea
                        value={formData.requirements}
                        onChange={(e) =>
                          setFormData({ ...formData, requirements: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Benefits (eine pro Zeile)
                      </label>
                      <textarea
                        value={formData.benefits}
                        onChange={(e) =>
                          setFormData({ ...formData, benefits: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(job.id)}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Speichern...' : 'Speichern'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          resetForm();
                        }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Abbrechen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-lg text-blue-600 font-semibold">{job.company}</p>
                        <p className="text-gray-600">
                          {job.location} • {job.employment_type}
                        </p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : job.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {job.status === 'active'
                            ? 'Aktiv'
                            : job.status === 'draft'
                            ? 'Entwurf'
                            : 'Geschlossen'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Ansehen"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => startEdit(job)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
