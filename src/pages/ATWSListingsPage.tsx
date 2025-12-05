import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Search, Filter, MapPin, Euro, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ATWSListing, ListingType } from '../types/atws';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';

export default function ATWSListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ATWSListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ListingType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('atws_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching ATWS listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || listing.listing_type === filterType;
    return matchesSearch && matchesType;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = filteredListings.slice(startIndex, endIndex);

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
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return date.toLocaleDateString('de-DE');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <header className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/siportal"
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Zurück
                </Link>
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-yellow-600" />
                  <h1 className="text-2xl font-bold text-gray-900">ATWS-Warnanlagen Marktplatz</h1>
                </div>
              </div>
              {user && (
                <Link
                  to="/atws/create"
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Inserat erstellen
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-lg text-gray-600 mb-6">
            Kaufen, verkaufen, mieten oder vermieten Sie ATWS-Warnanlagen
          </p>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Suche nach Geräten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as ListingType | 'all')}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Alle Inserate</option>
                  <option value="verkaufen">Zu Verkaufen</option>
                  <option value="kaufen">Suche zu Kaufen</option>
                  <option value="vermieten">Zu Vermieten</option>
                  <option value="mieten">Suche zu Mieten</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
              <p className="mt-4 text-gray-600">Lade Inserate...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keine Inserate gefunden</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all'
                  ? 'Versuchen Sie andere Suchkriterien'
                  : 'Seien Sie der Erste, der ein Inserat erstellt!'}
              </p>
              {user && (
                <Link
                  to="/atws/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Erstes Inserat erstellen
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {paginatedListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/atws/${listing.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getListingTypeBadge(
                          listing.listing_type
                        )}`}
                      >
                        {getListingTypeLabel(listing.listing_type)}
                      </span>
                    </div>
                    {listing.condition && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                          {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                    <div className="space-y-2">
                      {listing.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {listing.location}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-lg font-bold text-yellow-600">
                          <Euro className="w-5 h-5 mr-1" />
                          {formatPrice(listing.price, listing.price_negotiable)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(listing.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredListings.length}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
