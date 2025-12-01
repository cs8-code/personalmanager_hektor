import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Euro, ArrowLeft, Plus, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Job } from '../types/job.types';
import JobDetailPanel from '../components/JobDetailPanel';

export default function JobsPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [showEmploymentTypeDropdown, setShowEmploymentTypeDropdown] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const isManager = userProfile?.systemRole === 'manager' || userProfile?.systemRole === 'administrator';
  const isSelbstandig = userProfile?.employment_type === 'selbständig';
  const canManageJobs = isManager || isSelbstandig;

  const employmentTypes = [
    { value: '', label: 'Alle Beschäftigungsarten' },
    { value: 'Vollzeit', label: 'Vollzeit' },
    { value: 'Teilzeit', label: 'Teilzeit' },
    { value: 'Minijob', label: 'Minijob' },
    { value: 'Freelance', label: 'Freelance' },
  ];

  useEffect(() => {
    if (!authLoading) {
      loadJobs();
    }
  }, [authLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowEmploymentTypeDropdown(false);
      }
    };

    if (showEmploymentTypeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmploymentTypeDropdown]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationFilter === '' ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesEmploymentType =
      employmentTypeFilter === '' || job.employment_type === employmentTypeFilter;

    return matchesSearch && matchesLocation && matchesEmploymentType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return 'Gestern';
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`;
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
                <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
              </div>
              {user && canManageJobs && (
                <Link
                  to="/jobs-management"
                  className="flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Job erstellen
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Location Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job-Titel, Firma oder Beschreibung suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ort"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtern nach</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Employment Type Dropdown */}
              <div className="relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschäftigungsart
                </label>
                <button
                  onClick={() => setShowEmploymentTypeDropdown(!showEmploymentTypeDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-yellow-400 focus:border-yellow-400 focus:outline-none transition-colors"
                >
                  <span className="text-gray-900">
                    {employmentTypes.find((t) => t.value === employmentTypeFilter)?.label || 'Alle Beschäftigungsarten'}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      showEmploymentTypeDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showEmploymentTypeDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {employmentTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setEmploymentTypeFilter(type.value);
                          setShowEmploymentTypeDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors ${
                          employmentTypeFilter === type.value ? 'bg-yellow-100 font-semibold' : ''
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredJobs.length}</span> Jobs gefunden
            </p>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keine Jobs gefunden</h3>
              <p className="text-gray-600">Versuchen Sie es mit anderen Suchkriterien</p>
            </div>
          ) : (
            <div className={`flex gap-6 transition-all duration-300 ${selectedJob ? 'flex-col lg:flex-row' : 'flex-col'}`}>
              {/* Jobs List */}
              <div className={`grid gap-6 transition-all duration-300 ${
                selectedJob ? 'grid-cols-1 flex-1' : 'grid-cols-1'
              }`}>
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`group bg-white rounded-xl shadow-sm border-2 hover:shadow-lg transition-all p-6 cursor-pointer ${
                      selectedJob?.id === job.id ? 'border-yellow-400' : 'border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2">
                          {job.title}
                        </h3>
                        <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {job.employment_type}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      {job.experience_required && (
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.experience_required} Jahre Erfahrung
                        </div>
                      )}
                      {job.salary_range && (
                        <div className="flex items-center">
                          <Euro className="w-4 h-4 mr-1" />
                          {job.salary_range}
                        </div>
                      )}
                      <div className="flex items-center ml-auto">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(job.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Job Detail Panel */}
              {selectedJob && (
                <JobDetailPanel
                  job={selectedJob}
                  onClose={() => setSelectedJob(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
