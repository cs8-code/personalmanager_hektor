import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Euro,
  Clock,
  Eye,
  Mail,
  Phone,
  User,
  Edit,
  Trash2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ATWSListing, ListingType } from '../types/atws';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function ATWSListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<ATWSListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
      incrementViews();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('atws_listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Fehler beim Laden des Inserats');
      navigate('/atws');
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    try {
      await supabase.rpc('increment', {
        table_name: 'atws_listings',
        row_id: id,
      });
    } catch (error) {
      // Silently fail - views are not critical
      console.error('Error incrementing views:', error);
    }
  };

  const handleDelete = async () => {
    if (!listing) return;

    try {
      // Delete images from storage
      if (listing.images && listing.images.length > 0) {
        const imagePaths = listing.images.map((url) => {
          const urlParts = url.split('/');
          return `${user?.id}/${urlParts[urlParts.length - 1]}`;
        });

        await supabase.storage.from('atws-images').remove(imagePaths);
      }

      // Delete listing
      const { error } = await supabase.from('atws_listings').delete().eq('id', listing.id);

      if (error) throw error;

      toast.success('Inserat erfolgreich gelöscht');
      navigate('/atws');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Fehler beim Löschen des Inserats');
    }
  };

  const getListingTypeLabel = (type: ListingType) => {
    const labels = {
      verkaufen: 'Zu Verkaufen',
      kaufen: 'Suche zu Kaufen',
      vermieten: 'Zu Vermieten',
      mieten: 'Suche zu Mieten',
    };
    return labels[type];
  };

  const getListingTypeBadge = (type: ListingType) => {
    const styles = {
      verkaufen: 'bg-green-100 text-green-800',
      kaufen: 'bg-blue-100 text-blue-800',
      vermieten: 'bg-purple-100 text-purple-800',
      mieten: 'bg-orange-100 text-orange-800',
    };
    return styles[type];
  };

  const formatPrice = (price?: number, negotiable?: boolean) => {
    if (!price) return 'Preis auf Anfrage';
    return `€${price.toLocaleString('de-DE')}${negotiable ? ' VB' : ''}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const nextImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }
  };

  const prevImage = () => {
    if (listing?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Inserat nicht gefunden</h2>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === listing.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            to="/atws"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zur Übersicht
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="relative bg-gray-200">
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-96 object-cover"
                    />
                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {listing.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center">
                    <ShoppingCart className="w-24 h-24 text-gray-400" />
                  </div>
                )}

                {/* Thumbnail Gallery */}
                {listing.images && listing.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-yellow-500' : 'border-gray-300'
                        }`}
                      >
                        <img src={image} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${getListingTypeBadge(
                        listing.listing_type
                      )}`}
                    >
                      {getListingTypeLabel(listing.listing_type)}
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <Link
                        to={`/atws/edit/${listing.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Bearbeiten"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center text-3xl font-bold text-yellow-600 mb-6">
                  <Euro className="w-8 h-8 mr-2" />
                  {formatPrice(listing.price, listing.price_negotiable)}
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                  {listing.condition && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Zustand</p>
                      <p className="font-semibold text-gray-900 capitalize">{listing.condition}</p>
                    </div>
                  )}
                  {listing.location && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Standort</p>
                      <div className="flex items-center font-semibold text-gray-900">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.location}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Erstellt am</p>
                    <div className="flex items-center font-semibold text-gray-900">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDate(listing.created_at)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Aufrufe</p>
                    <div className="flex items-center font-semibold text-gray-900">
                      <Eye className="w-4 h-4 mr-1" />
                      {listing.views}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">Beschreibung</h2>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{listing.description}</p>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Kontakt</h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-3 text-gray-400" />
                      <span className="font-semibold">{listing.contact_name}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-gray-400" />
                      <a href={`mailto:${listing.contact_email}`} className="hover:text-yellow-600 transition-colors">
                        {listing.contact_email}
                      </a>
                    </div>
                    {listing.contact_phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 mr-3 text-gray-400" />
                        <a href={`tel:${listing.contact_phone}`} className="hover:text-yellow-600 transition-colors">
                          {listing.contact_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Inserat löschen?</h3>
            <p className="text-gray-600 mb-6">
              Möchten Sie dieses Inserat wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
