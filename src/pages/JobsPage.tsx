import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Clock, Euro, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../pages/HomePage/components/Navbar';
import { useAuth } from '../contexts/AuthContext';

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

export default function JobsPage() {
  const { loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');

  useEffect(() => {
    if (!authLoading) {
      loadJobs();
    }
  }, [authLoading]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/siportal"
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="text-4xl font-bold mb-4">Jobs finden</h1>
          <p className="text-xl text-blue-100">
            Finden Sie Ihre nächste Karrierechance in der Bauüberwachung
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job-Titel oder Firma suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ort"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={employmentTypeFilter}
                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Alle Anstellungsarten</option>
                <option value="Vollzeit">Vollzeit</option>
                <option value="Teilzeit">Teilzeit</option>
                <option value="Freelance">Freelance</option>
                <option value="Befristet">Befristet</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Jobs werden geladen...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Keine Jobs gefunden
            </h3>
            <p className="text-gray-500">
              Versuchen Sie, Ihre Suchfilter anzupassen
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold mb-2">
                      {job.company}
                    </p>
                  </div>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.employment_type}</span>
                  </div>
                  {job.experience_required !== null && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{job.experience_required} Jahre Erfahrung</span>
                    </div>
                  )}
                  {job.salary_range && (
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 line-clamp-3">{job.description}</p>

                {job.requirements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Anforderungen:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 5).map((req, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 5 && (
                        <span className="text-gray-500 text-sm self-center">
                          +{job.requirements.length - 5} weitere
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
