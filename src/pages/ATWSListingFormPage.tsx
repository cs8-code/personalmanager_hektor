import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ATWSListingFormData, ListingType, ListingCondition, ListingStatus } from '../types/atws';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function ATWSListingFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<ATWSListingFormData>({
    title: '',
    description: '',
    listing_type: 'verkaufen',
    condition: 'gebraucht',
    price: undefined,
    price_negotiable: false,
    location: '',
    contact_name: userProfile?.name || '',
    contact_email: user?.email || '',
    contact_phone: userProfile?.phone || '',
    status: 'active',
  });

  useEffect(() => {
    if (!user) {
      toast.error('Bitte melden Sie sich an');
      navigate('/atws');
      return;
    }

    if (id) {
      fetchListing();
    }
  }, [id, user]);

  useEffect(() => {
    // Update contact info when userProfile changes
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        contact_name: prev.contact_name || userProfile.name || '',
        contact_email: prev.contact_email || user?.email || '',
        contact_phone: prev.contact_phone || userProfile.phone || '',
      }));
    }
  }, [userProfile, user]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase.from('atws_listings').select('*').eq('id', id).single();

      if (error) throw error;

      if (data.user_id !== user?.id) {
        toast.error('Sie haben keine Berechtigung, dieses Inserat zu bearbeiten');
        navigate('/atws');
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        listing_type: data.listing_type,
        condition: data.condition,
        price: data.price,
        price_negotiable: data.price_negotiable,
        location: data.location,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        status: data.status,
      });

      setExistingImages(data.images || []);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Fehler beim Laden des Inserats');
      navigate('/atws');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} ist kein gültiges Bild`);
        return false;
      }
      return true;
    });

    // Validate total number of images
    const totalImages = existingImages.length + imageFiles.length + validFiles.length;
    if (totalImages > 10) {
      toast.error('Maximal 10 Bilder erlaubt');
      return;
    }

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage.from('atws-images').upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from('atws-images').getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Bitte melden Sie sich an');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error('Bitte geben Sie einen Titel ein');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Bitte geben Sie eine Beschreibung ein');
      return;
    }

    if (!formData.contact_name.trim() || !formData.contact_email.trim()) {
      toast.error('Bitte geben Sie vollständige Kontaktinformationen ein');
      return;
    }

    try {
      setLoading(true);

      // Upload new images
      const newImageUrls = await uploadImages();
      const allImageUrls = [...existingImages, ...newImageUrls];

      const listingData = {
        ...formData,
        user_id: user.id,
        images: allImageUrls,
        price: formData.price || null,
      };

      if (id) {
        // Update existing listing
        const { error } = await supabase.from('atws_listings').update(listingData).eq('id', id);

        if (error) throw error;

        toast.success('Inserat erfolgreich aktualisiert');
        navigate(`/atws/${id}`);
      } else {
        // Create new listing
        const { data, error } = await supabase.from('atws_listings').insert([listingData]).select().single();

        if (error) throw error;

        toast.success('Inserat erfolgreich erstellt');
        navigate(`/atws/${data.id}`);
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      toast.error('Fehler beim Speichern des Inserats');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/atws')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {id ? 'Inserat bearbeiten' : 'Neues Inserat erstellen'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Listing Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anzeigentyp <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.listing_type}
                  onChange={(e) => setFormData({ ...formData, listing_type: e.target.value as ListingType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  <option value="verkaufen">Zu Verkaufen</option>
                  <option value="kaufen">Suche zu Kaufen</option>
                  <option value="vermieten">Zu Vermieten</option>
                  <option value="mieten">Suche zu Mieten</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. ATWS Warnanlage Typ XYZ - Neuwertig"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschreibung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  placeholder="Beschreiben Sie das Gerät, Zustand, technische Details, Zubehör, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zustand</label>
                <select
                  value={formData.condition || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value as ListingCondition | undefined })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="">Bitte wählen</option>
                  <option value="neu">Neu</option>
                  <option value="gebraucht">Gebraucht</option>
                  <option value="überholt">Überholt</option>
                </select>
              </div>

              {/* Price */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preis (€)</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Leer lassen für 'Auf Anfrage'"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.price_negotiable}
                      onChange={(e) => setFormData({ ...formData, price_negotiable: e.target.checked })}
                      className="w-5 h-5 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verhandlungsbasis (VB)</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Standort</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="z.B. Berlin, Hamburg, München"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Kontaktinformationen</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-Mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={formData.contact_phone || ''}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bilder (max. 10)</h2>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Vorhandene Bilder:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <img src={url} alt={`Bild ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Neue Bilder:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img src={preview} alt={`Neu ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {existingImages.length + imageFiles.length < 10 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Bilder hochladen</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {existingImages.length + imageFiles.length}/10 Bilder
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ListingStatus })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="active">Aktiv</option>
                  <option value="draft">Entwurf</option>
                  <option value="closed">Geschlossen</option>
                  {formData.listing_type === 'verkaufen' && <option value="sold">Verkauft</option>}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/atws')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                      Speichert...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {id ? 'Aktualisieren' : 'Erstellen'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
