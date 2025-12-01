import { X, MapPin, Briefcase, Clock, Euro, Mail, Phone, CheckCircle2, Award } from 'lucide-react';
import { Job } from '../types/job.types';

interface JobDetailPanelProps {
  job: Job;
  onClose: () => void;
}

export default function JobDetailPanel({ job, onClose }: JobDetailPanelProps) {
  return (
    <div className="hidden lg:block w-full lg:w-1/2 sticky top-24 h-fit">
      <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-8 max-h-[calc(100vh-8rem)] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
              <p className="text-lg text-blue-600 font-semibold mb-2">{job.company}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {job.employment_type}
                </div>
              </div>
            </div>
          </div>

          {/* Salary and Experience */}
          <div className="flex gap-4">
            {job.salary_range && (
              <div className="flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <Euro className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-sm font-semibold text-green-900">{job.salary_range}</span>
              </div>
            )}
            {job.experience_required !== null && (
              <div className="flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Award className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  {job.experience_required} {job.experience_required === 1 ? 'Jahr' : 'Jahre'} Erfahrung
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Beschreibung</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Anforderungen</h3>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontakt</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            {job.contact_email && (
              <a
                href={`mailto:${job.contact_email}`}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium text-sm">{job.contact_email}</span>
              </a>
            )}
            {job.contact_phone && (
              <a
                href={`tel:${job.contact_phone}`}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Phone className="w-5 h-5 mr-3 text-blue-600" />
                <span className="font-medium text-sm">{job.contact_phone}</span>
              </a>
            )}
          </div>
        </div>

        {/* Application Button */}
        <div className="mt-6">
          <a
            href={`mailto:${job.contact_email}?subject=Bewerbung: ${job.title}`}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-md hover:shadow-lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            Jetzt bewerben
          </a>
        </div>
      </div>
    </div>
  );
}
