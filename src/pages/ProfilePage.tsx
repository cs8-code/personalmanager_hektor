import { Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ContactRequests from '../components/ContactRequests';
import ImageUpload from '../components/ImageUpload';

const availableQualifications = [
  'SIPO',
  'SAKRA',
  'Büro & technisches Arbeiten',
  '4.2',
  'Koordinator',
  'Einsatzleiter',
  'Bahnerder',
  'BüP',
  'HIB',
  'Scheibenaufsteller',
  'BM',
  'Führerschein'
];

const availableLanguages = [
  'Deutsch',
  'Englisch',
  'Polnisch',
  'Rumänisch',
  'Türkisch',
  'Serbisch',
  'Kroatisch',
  'Sonstiges'
];

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    birthdate: '',
    gender: '' as 'männlich' | 'weiblich' | 'divers' | '',
    city: '',
    employment_type: '' as 'selbständig' | 'angestellt' | '',
    company_name: '',
    company_address: '',
    qualifications: [] as string[],
    languages: [] as string[],
    work_days: '' as 'Montag bis Freitag' | 'Nur Wochenende' | '7-Tage (ohne Feiertag)' | 'Täglich (inklusive Feiertag)' | '',
    shifts: '' as 'Früh' | 'Mittag/Spät' | 'Nacht' | 'Alle' | '',
    smoking_status: '' as 'Raucher' | 'Nicht-Raucher' | '',
    remarks: '',
    availability_status: '' as 'Sofort verfügbar' | 'demnächst verfügbar' | 'nicht verfügbar' | 'zurzeit beschäftigt' | '',
  });

  useEffect(() => {
    if (window.location.hash === '#anfragen') {
      setTimeout(() => {
        const element = document.getElementById('anfragen-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      const nameParts = (userProfile.name || '').split(' ');
      setFormData({
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        username: userProfile.username || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        birthdate: userProfile.birthdate || '', 
        gender: (userProfile.gender as 'männlich' | 'weiblich' | 'divers' | '') || '',
        city: userProfile.city || '',
        employment_type: (userProfile.employment_type as 'selbständig' | 'angestellt' | '') || '',
        company_name: userProfile.company_name || '',
        company_address: userProfile.company_address || '',
        qualifications: userProfile.qualifications || [],
        languages: userProfile.languages || [],
        work_days: (userProfile.work_days as 'Montag bis Freitag' | 'Nur Wochenende' | '7-Tage (ohne Feiertag)' | 'Täglich (inklusive Feiertag)' | '') || '',
        shifts: (userProfile.shifts as 'Früh' | 'Mittag/Spät' | 'Nacht' | 'Alle' | '') || '',
        smoking_status: (userProfile.smoking_status as 'Raucher' | 'Nicht-Raucher' | '') || '',
        remarks: userProfile.remarks || '',
        availability_status: (userProfile.availability_status as 'Sofort verfügbar' | 'demnächst verfügbar' | 'nicht verfügbar' | 'zurzeit beschäftigt' | '') || '',
      });
      setProfileImageUrl(userProfile.image_url || '');
    }
  }, [userProfile]);

  const handleCheckboxChange = (field: 'qualifications' | 'languages', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

    setSaving(true);
    try {
      // Update workers table
      const { error: workerError } = await supabase
        .from('workers')
        .update({
          name: `${formData.first_name} ${formData.last_name}`,
          username: formData.username,
          phone: formData.phone,
          birth_date: formData.birthdate,
          gender: formData.gender,
          city: formData.city,
          employment_type: formData.employment_type,
          company_name: formData.company_name || null,
          company_address: formData.company_address || null,
          qualifications: formData.qualifications,
          languages: formData.languages,
          work_days: formData.work_days || null,
          shifts: formData.shifts || null,
          smoking_status: formData.smoking_status || null,
          remarks: formData.remarks || null,
          availability_status: formData.availability_status,
          location: formData.city,
          image_url: profileImageUrl || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userProfile.id);

      if (workerError) throw workerError;

      // If selbständig, also update companies table
      if (formData.employment_type === 'selbständig') {
        const { error: companyError } = await supabase
          .from('companies')
          .upsert({
            id: user.id,
            company_name: formData.company_name || '',
            company_address: formData.company_address || null,
            contact_person: `${formData.first_name} ${formData.last_name}`,
            email: formData.email,
            phone: formData.phone || null,
            updated_at: new Date().toISOString(),
          });

        if (companyError) throw companyError;
      }

      alert('Profil erfolgreich aktualisiert');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Fehler beim Speichern des Profils');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nicht angemeldet</h2>
          <p className="text-gray-600 mb-6">Sie müssen angemeldet sein, um Ihr Profil zu sehen.</p>
          <Link
            to="/siportal"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/siportal"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Startseite
          </Link>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Profil bearbeiten
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mein Profil</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <ImageUpload
              currentImageUrl={profileImageUrl}
              onImageUpload={setProfileImageUrl}
              userId={user?.id || ''}
              size="large"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Vorname
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{formData.first_name || '-'}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nachname
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{formData.last_name || '-'}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Benutzername
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{formData.username || '-'}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                E-Mail
              </label>
              <p className="text-gray-700">{user.email}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Telefon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{formData.phone || '-'}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Geburtsdatum
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{formData.birthdate || '-'}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Geschlecht
              </label>
              {isEditing ? (
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="männlich">Männlich</option>
                  <option value="weiblich">Weiblich</option>
                  <option value="divers">Divers</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.gender || '-'}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Stadt
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
              ) : (
                <p className="text-gray-700">{formData.city || '-'}</p>
              )}
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Beschäftigungsart
              </label>
              {isEditing ? (
                <select
                  value={formData.employment_type}
                  onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="selbständig">Selbständig</option>
                  <option value="angestellt">Angestellt</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.employment_type || '-'}</p>
              )}
            </div>

            {/* Company Name */}
            {(isEditing || formData.company_name) && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Firmenname
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700">{formData.company_name || '-'}</p>
                )}
              </div>
            )}

            {/* Company Address */}
            {(isEditing || formData.company_address) && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Firmenadresse
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company_address}
                    onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700">{formData.company_address || '-'}</p>
                )}
              </div>
            )}

            {/* Work Days */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Arbeitseiten
              </label>
              {isEditing ? (
                <select
                  value={formData.work_days}
                  onChange={(e) => setFormData({ ...formData, work_days: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Montag bis Freitag">Montag bis Freitag</option>
                  <option value="Nur Wochenende">Nur Wochenende</option>
                  <option value="7-Tage (ohne Feiertag)">7-Tage (ohne Feiertag)</option>
                  <option value="Täglich (inklusive Feiertag)">Täglich (inklusive Feiertag)</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.work_days || '-'}</p>
              )}
            </div>

            {/* Shifts */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Schichten
              </label>
              {isEditing ? (
                <select
                  value={formData.shifts}
                  onChange={(e) => setFormData({ ...formData, shifts: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Früh">Früh</option>
                  <option value="Mittag/Spät">Mittag/Spät</option>
                  <option value="Nacht">Nacht</option>
                  <option value="Alle">Alle</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.shifts || '-'}</p>
              )}
            </div>

            {/* Smoking Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Raucherstatus
              </label>
              {isEditing ? (
                <select
                  value={formData.smoking_status}
                  onChange={(e) => setFormData({ ...formData, smoking_status: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Raucher">Raucher</option>
                  <option value="Nicht-Raucher">Nicht-Raucher</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.smoking_status || '-'}</p>
              )}
            </div>

            {/* Availability Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Verfügbarkeit
              </label>
              {isEditing ? (
                <select
                  value={formData.availability_status}
                  onChange={(e) => setFormData({ ...formData, availability_status: e.target.value as any })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Bitte wählen</option>
                  <option value="Sofort verfügbar">Sofort verfügbar</option>
                  <option value="demnächst verfügbar">demnächst verfügbar</option>
                  <option value="nicht verfügbar">nicht verfügbar</option>
                  <option value="zurzeit beschäftigt">zurzeit beschäftigt</option>
                </select>
              ) : (
                <p className="text-gray-700">{formData.availability_status || '-'}</p>
              )}
            </div>
          </div>

          {/* Qualifications (full width) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Qualifikationen
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableQualifications.map((qual) => (
                  <label key={qual} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.qualifications.includes(qual)}
                      onChange={() => handleCheckboxChange('qualifications', qual)}
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-700">{qual}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.qualifications.length > 0 ? (
                  formData.qualifications.map((qual) => (
                    <span
                      key={qual}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                    >
                      {qual}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-700">-</p>
                )}
              </div>
            )}
          </div>

          {/* Languages (full width) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sprachen
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableLanguages.map((lang) => (
                  <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleCheckboxChange('languages', lang)}
                      className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.languages.length > 0 ? (
                  formData.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {lang}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-700">-</p>
                )}
              </div>
            )}
          </div>

          {/* Remarks (full width) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Bemerkungen/Besondere Wünsche
            </label>
            {isEditing ? (
              <div>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  maxLength={200}
                  rows={3}
                  placeholder="Besondere Wünsche oder Anmerkungen (max. 200 Zeichen)"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-yellow-400 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.remarks.length}/200 Zeichen
                </p>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{formData.remarks || '-'}</p>
            )}
          </div>

          {/* User ID */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              User ID
            </label>
            <code className="text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded font-mono block">
              {user.id}
            </code>
          </div>
        </div>
      </div>

      {/* Contact Requests Section */}
      <div id="anfragen-section" className="mt-8">
        <ContactRequests />
      </div>
    </div>
  );
}
