import { useState, useEffect } from 'react';
import { HardHat, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../contexts/AuthContext';

interface RegistrationData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: 'männlich' | 'weiblich' | 'divers' | '';
  city: string;
  employment_type: 'selbständig' | 'angestellt' | '';
  company_name: string;
  company_address: string;
  qualifications: string[];
  languages: string[];
  work_days: 'Montag bis Freitag' | 'Nur Wochenende' | '7-Tage (ohne Feiertag)' | 'Täglich (inklusive Feiertag)' | '';
  shifts: 'Früh' | 'Mittag/Spät' | 'Nacht' | 'Alle' | '';
  smoking_status: 'Raucher' | 'Nicht-Raucher' | '';
  arbeitsort: 'Nahbaustellen' | 'Montage (ohne km-Begrenzung)' | 'Montage (mit km-Begrenzung)' | 'Nahbau & Montage' | '';
  remarks: string;
  availability_status: 'Sofort verfügbar' | 'demnächst verfügbar' | 'nicht verfügbar' | 'zurzeit beschäftigt' | '';
  password: string;
  confirmPassword: string;
}

export default function RegistrationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [formData, setFormData] = useState<RegistrationData>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    city: '',
    employment_type: '',
    company_name: '',
    company_address: '',
    qualifications: [],
    languages: [],
    work_days: '',
    shifts: '',
    smoking_status: '',
    arbeitsort: '',
    remarks: '',
    availability_status: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQualificationChange = (qualification: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualification)
        ? prev.qualifications.filter(q => q !== qualification)
        : [...prev.qualifications, qualification]
    }));
  };

  const handleLanguageChange = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name) {
      newErrors.first_name = 'Vorname ist erforderlich';
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Nachname ist erforderlich';
    }

    if (!formData.username) {
      newErrors.username = 'Benutzername ist erforderlich';
    }

    if (!formData.email) {
      newErrors.email = 'E-Mail ist erforderlich';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    if (!formData.birth_date) {
      newErrors.birth_date = 'Geburtsdatum ist erforderlich';
    }

    if (!formData.gender) {
      newErrors.gender = 'Geschlecht ist erforderlich';
    }

    if (!formData.city) {
      newErrors.city = 'Stadt ist erforderlich';
    }

    if (!formData.employment_type) {
      newErrors.employment_type = 'Bitte wählen Sie einen Status aus';
    }

    if (formData.employment_type === 'selbständig') {
      if (!formData.company_name) {
        newErrors.company_name = 'Firmenname ist erforderlich';
      }
      if (!formData.company_address) {
        newErrors.company_address = 'Adresse ist erforderlich';
      }
    }

    if (!formData.availability_status) {
      newErrors.availability_status = 'Verfügbarkeit ist erforderlich';
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwort bestätigen ist erforderlich';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.username,
            phone: formData.phone || '',
            birth_date: formData.birth_date,
            gender: formData.gender,
            city: formData.city,
            employment_type: formData.employment_type,
            company_name: formData.company_name || '',
            company_address: formData.company_address || '',
            qualifications: formData.qualifications,
            languages: formData.languages,
            work_days: formData.work_days,
            shifts: formData.shifts,
            smoking_status: formData.smoking_status,
            arbeitsort: formData.arbeitsort,
            remarks: formData.remarks,
            availability_status: formData.availability_status
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        setTempUserId(authData.user.id);

        // Create worker profile (for both angestellt and selbständig)
        const { error: profileError } = await supabase
          .from('workers')
          .insert({
            id: authData.user.id,
            name: `${formData.first_name} ${formData.last_name}`,
            username: formData.username,
            email: formData.email,
            phone: formData.phone || '',
            birth_date: formData.birth_date,
            gender: formData.gender,
            city: formData.city,
            employment_type: formData.employment_type,
            company_name: formData.company_name || null,
            company_address: formData.company_address || null,
            availability_status: formData.availability_status,
            work_days: formData.work_days || null,
            qualifications: formData.qualifications,
            languages: formData.languages,
            shifts: formData.shifts || null,
            smoking_status: formData.smoking_status || null,
            arbeitsort: formData.arbeitsort || null,
            remarks: formData.remarks || null,
            location: formData.city,
            experience_years: 0,
            bio: '',
            company: '',
            image_url: profileImageUrl || ''
          });

        if (profileError) throw profileError;

        // If selbständig, also create company profile
        if (formData.employment_type === 'selbständig') {
          const { error: companyError } = await supabase
            .from('companies')
            .insert({
              id: authData.user.id,
              company_name: formData.company_name || '',
              company_address: formData.company_address || null,
              contact_person: `${formData.first_name} ${formData.last_name}`,
              email: formData.email,
              phone: formData.phone || null
            });

          if (companyError) {
            console.error('Company creation error:', companyError);
            throw companyError;
          }
        }
      }

      setIsSubmitted(true);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.' });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Registrierung erfolgreich!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren.
          </p>
          <div className="mt-6">
            <Link
              to="/siportal"
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <div className="flex items-center">
            <HardHat className="w-10 h-10 text-yellow-400" />
            <span className="ml-3 text-3xl font-bold text-gray-900">Siportal</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Registrierung
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Registrieren Sie sich für Siportal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex justify-center">
                <ImageUpload
                  currentImageUrl={profileImageUrl}
                  onImageUpload={setProfileImageUrl}
                  userId={tempUserId || 'temp-' + Date.now()}
                  size="medium"
                />
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  Vorname *
                </label>
                <div className="mt-1">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Max"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Nachname *
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mustermann"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Benutzername *
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="maxmustermann"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-Mail-Adresse *
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="max@beispiel.de"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefonnummer (optional)
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                  Geburtsdatum *
                </label>
                <div className="mt-1">
                  <input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.birth_date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.birth_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.birth_date}</p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Geschlecht *
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="männlich">männlich</option>
                    <option value="weiblich">weiblich</option>
                    <option value="divers">divers</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Stadt *
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Berlin"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700">
                  Ich bin ... *
                </label>
                <div className="mt-1">
                  <select
                    id="employment_type"
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.employment_type ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="selbständig">selbständig</option>
                    <option value="angestellt">angestellt</option>
                  </select>
                  {errors.employment_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.employment_type}</p>
                  )}
                </div>
              </div>


              {/* Conditional fields for selbständig */}
              {formData.employment_type === 'selbständig' && (
                <>
                  {/* Company Name */}
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                      Firmenname *
                    </label>
                    <div className="mt-1">
                      <input
                        id="company_name"
                        name="company_name"
                        type="text"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                          errors.company_name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Meine Firma GmbH"
                      />
                      {errors.company_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
                      )}
                    </div>
                  </div>

                  {/* Company Address */}
                  <div>
                    <label htmlFor="company_address" className="block text-sm font-medium text-gray-700">
                      Adresse *
                    </label>
                    <div className="mt-1">
                      <input
                        id="company_address"
                        name="company_address"
                        type="text"
                        value={formData.company_address}
                        onChange={handleInputChange}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                          errors.company_address ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Musterstraße 123, 12345 Berlin"
                      />
                      {errors.company_address && (
                        <p className="mt-1 text-sm text-red-600">{errors.company_address}</p>
                      )}
                    </div>
                  </div>
                </>
              )}


              {/* Availability Status */}
              <div>
                <label htmlFor="availability_status" className="block text-sm font-medium text-gray-700">
                  Verfügbarkeit *
                </label>
                <div className="mt-1">
                  <select
                    id="availability_status"
                    name="availability_status"
                    value={formData.availability_status}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.availability_status ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Sofort verfügbar">Sofort verfügbar</option>
                    <option value="demnächst verfügbar">demnächst verfügbar</option>
                    <option value="nicht verfügbar">nicht verfügbar</option>
                    <option value="zurzeit beschäftigt">zurzeit beschäftigt</option>
                  </select>
                  {errors.availability_status && (
                    <p className="mt-1 text-sm text-red-600">{errors.availability_status}</p>
                  )}
                </div>
              </div>
              
              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifikationen
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
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
                  ].map((qualification) => (
                    <label
                      key={qualification}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.qualifications.includes(qualification)}
                        onChange={() => handleQualificationChange(qualification)}
                        className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700">{qualification}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sprachen
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Deutsch',
                    'Englisch',
                    'Türkisch',
                    'Italienisch',
                    'Albanisch',
                    'Arabisch',
                    'Polnisch',
                    'Russisch',
                    'Spanisch',
                    'Französisch'
                  ].map((language) => (
                    <label
                      key={language}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(language)}
                        onChange={() => handleLanguageChange(language)}
                        className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Work Days */}
              <div>
                <label htmlFor="work_days" className="block text-sm font-medium text-gray-700">
                  Arbeitseiten
                </label>
                <div className="mt-1">
                  <select
                    id="work_days"
                    name="work_days"
                    value={formData.work_days}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Montag bis Freitag">Montag bis Freitag</option>
                    <option value="Nur Wochenende">Nur Wochenende</option>
                    <option value="7-Tage (ohne Feiertag)">7-Tage (ohne Feiertag)</option>
                    <option value="Täglich (inklusive Feiertag)">Täglich (inklusive Feiertag)</option>
                  </select>
                </div>
              </div>

               {/* Schichten */}
              <div>
                <label htmlFor="shifts" className="block text-sm font-medium text-gray-700">
                  Schichten
                </label>
                <div className="mt-1">
                  <select
                    id="shifts"
                    name="shifts"
                    value={formData.shifts}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Früh">Früh</option>
                    <option value="Mittag/Spät">Mittag/Spät</option>
                    <option value="Nacht">Nacht</option>
                    <option value="Alle">Alle</option>
                  </select>
                </div>
              </div>

              {/* Smoking Status */}
              <div>
                <label htmlFor="smoking_status" className="block text-sm font-medium text-gray-700">
                  Raucherstatus
                </label>
                <div className="mt-1">
                  <select
                    id="smoking_status"
                    name="smoking_status"
                    value={formData.smoking_status}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Raucher">Raucher</option>
                    <option value="Nicht-Raucher">Nicht-Raucher</option>
                  </select>
                </div>
              </div>

              {/* Arbeitsort */}
              <div>
                <label htmlFor="arbeitsort" className="block text-sm font-medium text-gray-700">
                  Arbeitsort
                </label>
                <div className="mt-1">
                  <select
                    id="arbeitsort"
                    name="arbeitsort"
                    value={formData.arbeitsort}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Nahbaustellen">Nahbaustellen</option>
                    <option value="Montage (ohne km-Begrenzung)">Montage (ohne km-Begrenzung)</option>
                    <option value="Montage (mit km-Begrenzung)">Montage (mit km-Begrenzung)</option>
                    <option value="Nahbau & Montage">Nahbau & Montage</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                  Bemerkungen/Besondere Wünsche
                </label>
                <div className="mt-1">
                  <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    maxLength={200}
                    rows={3}
                    placeholder="Besondere Wünsche oder Anmerkungen (max. 200 Zeichen)"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.remarks.length}/200 Zeichen
                  </p>
                </div>
              </div>

 

   
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Passwort *
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Mindestens 6 Zeichen"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Passwort wiederholen *
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Passwort wiederholen"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Registrieren'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oder</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/siportal"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück zur Startseite
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
