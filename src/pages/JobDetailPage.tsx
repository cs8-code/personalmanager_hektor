import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Clock, Euro, Mail, Phone, CheckCircle2, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
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

export default function JobDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && id) {
      loadJob(id);
    }
  }, [id, authLoading]);

  const loadJob = async (jobId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error loading job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Job wird geladen...</p>
        </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job nicht gefunden</h2>
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Zurück zur Jobübersicht
          </Link>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/jobs"
            className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            ← Zurück zur Jobübersicht
          </Link>
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <p className="text-2xl text-blue-100">{job.company}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-wrap gap-6 mb-8 text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">{job.employment_type}</span>
            </div>
            {job.experience_required !== null && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">{job.experience_required} Jahre Erfahrung</span>
              </div>
            )}
            {job.salary_range && (
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">{job.salary_range}</span>
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobbeschreibung</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                Anforderungen
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Wir bieten
              </h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Jetzt bewerben</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">E-Mail</p>
                <a
                  href={`mailto:${job.contact_email}`}
                  className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                >
                  {job.contact_email}
                </a>
              </div>
            </div>
            {job.contact_phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <a
                    href={`tel:${job.contact_phone}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {job.contact_phone}
                  </a>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-blue-200">
            <a
              href={`mailto:${job.contact_email}?subject=Bewerbung: ${job.title}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 font-semibold"
            >
              <Mail className="w-5 h-5" />
              Per E-Mail bewerben
            </a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
